import { LEARN_LANGS, type LearnLang } from "./content";
import { LANGUAGE_LABELS, type LanguageCode } from "@/lib/participants/curriculum";

/**
 * The gap between the languages people speak and the languages the online
 * course is written in — and how we handle it honestly.
 *
 * The CRM records eight preferred languages because knowing someone speaks
 * Somali is useful to a counselor whether or not the website is translated:
 * it drives interpretation, printed handouts, and which class they're invited
 * to in person. But the self-serve course only exists in English, Spanish and
 * Arabic. Rather than silently serving English and calling it accessible, we
 * name the gap and route the learner to the human support that closes it.
 */

/** Languages the online course itself is fully written in. */
export const COURSE_LANGUAGES: readonly LearnLang[] = LEARN_LANGS;

export function isCourseLanguage(lang: LanguageCode): lang is LearnLang {
  return (COURSE_LANGUAGES as readonly string[]).includes(lang);
}

/** Languages we record but do not yet teach online. */
export function supportOnlyLanguages(): LanguageCode[] {
  return (Object.keys(LANGUAGE_LABELS) as LanguageCode[]).filter((l) => !isCourseLanguage(l));
}

/** Human list of the course languages, e.g. "English, Spanish, or Arabic". */
export function courseLanguageList(): string {
  const names = COURSE_LANGUAGES.map((l) => LANGUAGE_LABELS[l]);
  return `${names.slice(0, -1).join(", ")}, or ${names.at(-1)}`;
}

/**
 * What to tell a learner whose language we don't teach in yet. Returns null
 * when the course already speaks their language.
 */
export function languageSupportNotice(
  lang: LanguageCode,
): { language: string; heading: string; body: string } | null {
  if (isCourseLanguage(lang)) return null;
  const language = LANGUAGE_LABELS[lang];
  return {
    language,
    heading: `The online classes aren't in ${language} yet`,
    body:
      `You can still take them in ${courseLanguageList()}. We've noted that you prefer ` +
      `${language}, so your Benjamin Rose counselor can arrange an interpreter, printed ` +
      `materials, or an in-person class in your language — just ask.`,
  };
}
