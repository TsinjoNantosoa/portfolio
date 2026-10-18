import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { detectMessageLanguage, messageForAssistantApi } from "./assistant-language";
import { localizeAssistantMetadata } from "./assistant-localization";

describe("detectMessageLanguage", () => {
  it.each([
    "salut comment ca va",
    "comment contacter vous",
    "donne moi ici vore numero whatsap",
    "Quels projets dois-je consulter en premier ?",
    "Parle-moi de ton expérience",
    "merci beaucoup",
  ])("reads %j as French even when the site is in English", (text) => {
    expect(detectMessageLanguage(text, "en")).toBe("fr");
  });

  it.each([
    "hi how are you",
    "Which projects should I review first?",
    "Tell me about the RAG platform",
    "What is Tsinjo's professional experience?",
    "give me your whatsapp number",
  ])("reads %j as English even when the site is in French", (text) => {
    expect(detectMessageLanguage(text, "fr")).toBe("en");
  });

  it("falls back to the site language when the message gives no signal", () => {
    expect(detectMessageLanguage("RAG", "fr")).toBe("fr");
    expect(detectMessageLanguage("RAG", "en")).toBe("en");
    expect(detectMessageLanguage("", "fr")).toBe("fr");
  });
});

describe("messageForAssistantApi", () => {
  it("adds a short hint in the language of the question and keeps the question intact", () => {
    expect(messageForAssistantApi("salut", "fr", 800)).toBe("[Répondez en français.]\n\nsalut");
    expect(messageForAssistantApi("hello", "en", 800)).toBe("[Answer in English.]\n\nhello");
  });

  it("never exceeds the length limit", () => {
    expect(messageForAssistantApi("x".repeat(2000), "fr", 800)).toHaveLength(800);
  });
});

describe("localizeAssistantMetadata", () => {
  const metadata = {
    sources: [
      { title: "Languages", section: "Professional languages", url: "/work/x" },
      { title: "Contact and public profiles", section: "Public links", url: "/work/y" },
      { title: "SIHIA — AI-Powered HealthTech Platform", section: "Evaluation and testing", url: "/work/sihia" },
    ],
    suggestedLinks: [
      { label: "Contact Tsinjo", url: "/#contact" },
      { label: "View GitHub", url: "https://github.com/x" },
      { label: "View LinkedIn", url: "https://linkedin.com/x" },
      { label: "View Offshore Fares case study", url: "/work/offshore-fares" },
    ],
    suggestedQuestions: ["Which projects should I review first?", "What is Tsinjo's professional experience?", "Brand new question"],
  };

  it("leaves English untouched", () => {
    expect(localizeAssistantMetadata(metadata, "en")).toEqual(metadata);
  });

  it("shows French titles, sections, link labels and questions, and keeps URLs and project names", () => {
    const fr = localizeAssistantMetadata(metadata, "fr");
    expect(fr.sources.map((s) => `${s.title} · ${s.section}`)).toEqual([
      "Langues · Langues professionnelles",
      "Contact et profils publics · Liens publics",
      "SIHIA — AI-Powered HealthTech Platform · Évaluation et tests",
    ]);
    expect(fr.sources.map((s) => s.url)).toEqual(metadata.sources.map((s) => s.url));
    expect(fr.suggestedLinks.map((l) => l.label)).toEqual(["Contacter Tsinjo", "Voir GitHub", "Voir LinkedIn", "Voir l’étude de cas Offshore Fares"]);
    expect(fr.suggestedLinks.map((l) => l.url)).toEqual(metadata.suggestedLinks.map((l) => l.url));
    expect(fr.suggestedQuestions).toEqual([
      "Quels projets dois-je consulter en premier ?",
      "Quelle est l’expérience professionnelle de Tsinjo ?",
      "Brand new question",
    ]);
  });

  it("covers every section, link label and follow-up question of the knowledge base", () => {
    const file = path.resolve(__dirname, "../../../portfolio-ai-api/app/knowledge/public_portfolio.json");
    const chunks = JSON.parse(fs.readFileSync(file, "utf-8")) as Array<{
      section?: string;
      links: Array<{ label: string; url: string }>;
      suggested_questions: string[];
    }>;
    const sameInFrench = new Set(["Architecture", "Expertise", "AI Engineering Lab"]);
    const missing: string[] = [];
    for (const chunk of chunks) {
      const result = localizeAssistantMetadata(
        {
          sources: [{ title: "t", section: chunk.section, url: "/work/a" }],
          suggestedLinks: chunk.links.map((l) => ({ label: l.label, url: l.url })),
          suggestedQuestions: chunk.suggested_questions,
        },
        "fr",
      );
      if (chunk.section && !sameInFrench.has(chunk.section) && result.sources[0].section === chunk.section) missing.push(`section: ${chunk.section}`);
      chunk.links.forEach((l, i) => {
        if (result.suggestedLinks[i].label === l.label) missing.push(`label: ${l.label}`);
      });
      chunk.suggested_questions.forEach((q, i) => {
        if (result.suggestedQuestions[i] === q) missing.push(`question: ${q}`);
      });
    }
    expect([...new Set(missing)]).toEqual([]);
  });
});
