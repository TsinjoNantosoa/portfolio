import type { Language } from "@/i18n/I18nProvider";

/**
 * The reply language follows the language the visitor writes in, not the site language: someone reading the
 * English site who types in French gets a French answer, and the other way round. The site language is only
 * the tie-breaker (for example for "ok" or a project name).
 */
const FRENCH_WORDS = new Set([
  "salut", "bonjour", "bonsoir", "merci", "svp", "stp", "oui", "non", "ca", "ça", "va", "comment", "pourquoi", "quoi", "quel", "quelle",
  "quels", "quelles", "qui", "que", "est", "sont", "suis", "sommes", "etes", "êtes", "je", "tu", "il", "elle", "nous", "vous", "ils",
  "mon", "ma", "mes", "ton", "ta", "tes", "son", "sa", "ses", "votre", "vos", "notre", "le", "la", "les", "un", "une", "des", "du", "de",
  "au", "aux", "et", "ou", "avec", "pour", "dans", "sur", "sans", "chez", "ce", "cette", "ces", "donne", "donnez", "moi", "toi", "ici",
  "parle", "parler", "peux", "peut", "pouvez", "veux", "voudrais", "contacter", "contactez", "numero", "numéro", "projet", "projets",
  "competences", "compétences", "parcours", "travail", "travaille", "quelles", "decris", "décris", "explique", "expliquez", "montre",
  "montrez", "dis", "dites", "aussi", "beaucoup", "tres", "très", "bien", "pas", "plus", "mais", "donc", "alors", "avez",
  "avoir", "etre", "être", "fait", "faire", "fais", "combien", "quand", "où", "ou", "lequel", "laquelle",
]);

const ENGLISH_WORDS = new Set([
  "hi", "hello", "hey", "thanks", "thank", "please", "yes", "how", "what", "which", "why", "who", "where", "when", "you", "your",
  "the", "an", "and", "or", "is", "are", "was", "were", "do", "does", "did", "can", "could", "would", "will", "tell", "me", "show",
  "give", "about", "with", "for", "in", "on", "of", "to", "his", "her", "their", "my", "i", "we", "it", "this", "that", "have", "has",
  "any", "there", "contact", "number", "projects", "skills", "work", "worked", "experience", "should", "first", "review", "explain",
  "describe", "more", "also", "very", "not", "but",
]);

const FRENCH_ACCENTS = /[àâçéèêëîïôûùüÿœæ]/gi;

export function detectMessageLanguage(text: string, fallback: Language): Language {
  const words = text.toLowerCase().match(/[a-zà-ÿœæ]+/g) ?? [];
  let french = 2 * (text.match(FRENCH_ACCENTS)?.length ?? 0);
  let english = 0;
  for (const word of words) {
    if (FRENCH_WORDS.has(word)) french += 1;
    if (ENGLISH_WORDS.has(word)) english += 1;
  }
  if (french > english) return "fr";
  if (english > french) return "en";
  return fallback;
}

// The service picks the reply language by counting words in the whole message, so the hint itself must
// read as the language we want: a long English hint on a French question used to tip the answer into English.
const HINT_EN = "[Answer in English.]";
const HINT_FR = "[Répondez en français.]";

export function messageForAssistantApi(
  visibleMessage: string,
  language: Language,
  maxLength: number,
): string {
  const hint = language === "fr" ? HINT_FR : HINT_EN;
  const prefix = `${hint}\n\n`;
  const budget = Math.max(0, maxLength - prefix.length);
  return `${prefix}${visibleMessage.slice(0, budget)}`;
}
