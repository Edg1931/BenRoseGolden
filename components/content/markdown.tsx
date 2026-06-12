/** Tiny dependency-free Markdown renderer for newsletter/flyer previews.
 *  Supports #/##/### headings, - bullets, **bold**, and paragraphs. */
export function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = (key: string) => {
    if (list.length) {
      blocks.push(
        <ul key={key} className="my-2 list-disc space-y-1 pl-5">
          {list.map((li, i) => <li key={i}>{inline(li)}</li>)}
        </ul>,
      );
      list = [];
    }
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      return;
    }
    flushList(`ul-${i}`);
    if (line.startsWith("### ")) blocks.push(<h4 key={i} className="mt-3 font-semibold">{inline(line.slice(4))}</h4>);
    else if (line.startsWith("## ")) blocks.push(<h3 key={i} className="mt-3 text-lg font-semibold">{inline(line.slice(3))}</h3>);
    else if (line.startsWith("# ")) blocks.push(<h2 key={i} className="mt-2 text-xl font-bold">{inline(line.slice(2))}</h2>);
    else if (line.trim() === "") blocks.push(<div key={i} className="h-2" />);
    else blocks.push(<p key={i} className="text-sm leading-relaxed">{inline(line)}</p>);
  });
  flushList("ul-end");

  return <div className="prose-sm">{blocks}</div>;
}

/** Render **bold** and _italic_ inline. */
function inline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("_") && p.endsWith("_")) return <em key={i}>{p.slice(1, -1)}</em>;
    return <span key={i}>{p}</span>;
  });
}
