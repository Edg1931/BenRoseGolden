// @ts-check
/**
 * Lesson/quiz consistency checker for the learner course.
 *
 * Reads the course source files (no app runtime needed) and reports, per day:
 *   • lessons, sections, and how many lessons have an in-lesson reinforcement
 *     (inline check / sorter / calculator / activity)
 *   • the size of the day's test (curriculum module banks + local questions)
 *
 * It then flags consistency gaps an author should look at:
 *   • a section whose lessons contain NO inline knowledge check
 *   • a lesson with NO interactive reinforcement at all
 *   • a quiz question with no translation in quiz-i18n.ts (would render fallback)
 *   • a day whose test has fewer than MIN_DAY_QUESTIONS questions
 *
 * Parsing is done with the TypeScript compiler API (already a dependency), so it
 * stays accurate as the content files grow. Exit code is non-zero if any hard
 * inconsistency (missing translation) is found, so it can gate CI later.
 *
 * Run:  node scripts/check-learn-consistency.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import ts from "typescript";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MIN_DAY_QUESTIONS = 8; // ~8 hours of HUD content deserves a real test per day

/** Parse a .ts file into a SourceFile AST. */
function parse(rel) {
  const path = join(ROOT, rel);
  return ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true);
}

/** Find the initializer of a top-level `export const NAME = …` (or `const NAME = …`). */
function getExportInit(sf, name) {
  let found = null;
  sf.forEachChild((node) => {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === name) found = decl.initializer ?? null;
      }
    }
  });
  return found;
}

/** Property value lookup on an object literal by key name. */
function prop(objLit, key) {
  for (const p of objLit.properties) {
    if (ts.isPropertyAssignment(p)) {
      const n = p.name;
      const name = ts.isIdentifier(n) || ts.isStringLiteral(n) ? n.text : null;
      if (name === key) return p.initializer;
    }
  }
  return null;
}

function hasProp(objLit, key) {
  return prop(objLit, key) != null;
}

function strOf(node) {
  return node && ts.isStringLiteral(node) ? node.text : null;
}

/** Object-literal keys (handles identifier and string keys). */
function objectKeys(objLit) {
  return objLit.properties
    .map((p) => {
      const n = p.name;
      return n && (ts.isIdentifier(n) || ts.isStringLiteral(n)) ? n.text : null;
    })
    .filter(Boolean);
}

const DAYS = [
  { slug: "day-1", file: "lib/learn/content.ts", lessons: "DAY1_LESSONS", sections: "DAY1_SECTIONS" },
  { slug: "day-2", file: "lib/learn/day2.ts", lessons: "DAY2_LESSONS", sections: "DAY2_SECTIONS" },
  { slug: "day-3", file: "lib/learn/day3.ts", lessons: "DAY3_LESSONS", sections: "DAY3_SECTIONS" },
  { slug: "day-4", file: "lib/learn/day4.ts", lessons: "DAY4_LESSONS", sections: "DAY4_SECTIONS" },
];

/** Extract lessons from a day file as {id, section, interactive flags}. */
function readLessons(file, exportName) {
  const sf = parse(file);
  const arr = getExportInit(sf, exportName);
  if (!arr || !ts.isArrayLiteralExpression(arr)) return [];
  return arr.elements.filter(ts.isObjectLiteralExpression).map((o) => ({
    id: strOf(prop(o, "id")),
    section: strOf(prop(o, "section")),
    check: hasProp(o, "check"),
    sorter: hasProp(o, "sorter"),
    calculator: hasProp(o, "calculator"),
    activity: hasProp(o, "activity"),
  }));
}

function readSections(file, exportName) {
  const sf = parse(file);
  const obj = getExportInit(sf, exportName);
  return obj && ts.isObjectLiteralExpression(obj) ? objectKeys(obj) : [];
}

// ── Quiz banks ───────────────────────────────────────────────────────────────
function readQuizModules() {
  const sf = parse("lib/participants/quiz.ts");
  const obj = getExportInit(sf, "QUIZZES");
  const byModule = {};
  if (obj && ts.isObjectLiteralExpression(obj)) {
    for (const p of obj.properties) {
      if (ts.isPropertyAssignment(p) && ts.isArrayLiteralExpression(p.initializer)) {
        const key = ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) ? p.name.text : null;
        if (key) {
          byModule[key] = p.initializer.elements
            .filter(ts.isObjectLiteralExpression)
            .map((o) => strOf(prop(o, "id")))
            .filter(Boolean);
        }
      }
    }
  }
  return byModule;
}

function readDayQuizMap() {
  const sf = parse("lib/learn/quiz.ts");
  // DAY_MODULES is a non-exported const; getExportInit also catches plain const.
  const dayModules = {};
  const localQuestions = {};
  const modObj = getExportInit(sf, "DAY_MODULES");
  if (modObj && ts.isObjectLiteralExpression(modObj)) {
    for (const p of modObj.properties) {
      if (ts.isPropertyAssignment(p) && ts.isArrayLiteralExpression(p.initializer)) {
        const key = ts.isStringLiteral(p.name) || ts.isIdentifier(p.name) ? p.name.text : null;
        if (key) dayModules[key] = p.initializer.elements.map(strOf).filter(Boolean);
      }
    }
  }
  const localObj = getExportInit(sf, "LOCAL_QUESTIONS");
  if (localObj && ts.isObjectLiteralExpression(localObj)) {
    for (const p of localObj.properties) {
      if (ts.isPropertyAssignment(p) && ts.isArrayLiteralExpression(p.initializer)) {
        const key = ts.isStringLiteral(p.name) || ts.isIdentifier(p.name) ? p.name.text : null;
        if (key) {
          localQuestions[key] = p.initializer.elements
            .filter(ts.isObjectLiteralExpression)
            .map((o) => strOf(prop(o, "id")))
            .filter(Boolean);
        }
      }
    }
  }
  return { dayModules, localQuestions };
}

function readI18nKeys() {
  const sf = parse("lib/learn/quiz-i18n.ts");
  const obj = getExportInit(sf, "QUIZ_I18N");
  return new Set(obj && ts.isObjectLiteralExpression(obj) ? objectKeys(obj) : []);
}

// ── Run the report ───────────────────────────────────────────────────────────
const quizByModule = readQuizModules();
const { dayModules, localQuestions } = readDayQuizMap();
const i18nKeys = readI18nKeys();

let hardErrors = 0;
let warnings = 0;
const line = (s) => console.log(s);

line("\nLesson / quiz consistency report");
line("=".repeat(60));

for (const day of DAYS) {
  const lessons = readLessons(day.file, day.lessons);
  const sections = readSections(day.file, day.sections);

  const questionIds = [
    ...(dayModules[day.slug] ?? []).flatMap((m) => quizByModule[m] ?? []),
    ...(localQuestions[day.slug] ?? []),
  ];

  const withCheck = lessons.filter((l) => l.check).length;
  const withAny = lessons.filter((l) => l.check || l.sorter || l.calculator || l.activity).length;

  line(`\n${day.slug.toUpperCase()}  (${day.file})`);
  line(
    `  lessons: ${lessons.length} · sections: ${sections.length} · ` +
      `inline checks: ${withCheck} · any interactive: ${withAny}/${lessons.length} · ` +
      `test questions: ${questionIds.length}`,
  );

  // Day-test size
  if (questionIds.length < MIN_DAY_QUESTIONS) {
    warnings++;
    line(`  ⚠ test has ${questionIds.length} questions (< ${MIN_DAY_QUESTIONS} target)`);
  }

  // Sections with no inline check anywhere
  for (const sec of sections) {
    const inSec = lessons.filter((l) => l.section === sec);
    if (inSec.length && !inSec.some((l) => l.check)) {
      warnings++;
      line(`  ⚠ section "${sec}" has ${inSec.length} lesson(s) but no inline knowledge check`);
    }
  }

  // Lessons with no reinforcement at all
  const passive = lessons.filter((l) => !(l.check || l.sorter || l.calculator || l.activity));
  if (passive.length) {
    line(`  · ${passive.length} lesson(s) with no interactive: ${passive.map((l) => l.id).join(", ")}`);
  }

  // Quiz questions missing a translation (renders fallback text → hard error)
  const missing = questionIds.filter((id) => !i18nKeys.has(id));
  if (missing.length) {
    hardErrors += missing.length;
    line(`  ✗ ${missing.length} quiz question(s) missing a translation: ${missing.join(", ")}`);
  }
}

line("\n" + "=".repeat(60));
line(`Done — ${hardErrors} error(s), ${warnings} warning(s).`);
if (hardErrors > 0) process.exitCode = 1;
