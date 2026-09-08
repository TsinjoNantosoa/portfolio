import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const outputFile = path.join(scriptDir, "..", "app", "knowledge", "public_portfolio.json");

function loadTypeScriptModule(relativePath) {
  const filename = path.join(repoRoot, relativePath);
  const source = fs.readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    fileName: filename,
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, { module, exports: module.exports, require: () => { throw new Error(`Unexpected runtime import in ${relativePath}`); } }, { filename });
  return module.exports;
}

const projects = loadTypeScriptModule("src/data/projects.ts");
const experience = loadTypeScriptModule("src/data/experience.ts");
const documents = [];

const slugify = (value) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const sentenceList = (items = []) => items.filter(Boolean).join("; ");
const joinSentences = (...parts) => parts
  .map((part) => String(part || "").trim().replace(/[.\s]+$/g, ""))
  .filter(Boolean)
  .join(". ") + ".";
const projectQuestions = {
  "multi-tenant-rag": ["How was tenant isolation implemented?", "What stack powered the RAG platform?", "How did Tsinjo validate RAG quality?"],
  "arcwell-agentic-crm": ["How does Human-in-the-Loop work in Arcwell?", "Why are policy checks deterministic?", "Which other project uses LangGraph?"],
  "ai-business-os": ["How does AI BOS control agent actions?", "What is the AI BOS architecture?", "Which projects demonstrate multi-tenancy?"],
  sihia: ["How does SIHIA's hybrid retrieval work?", "Why does SIHIA use reranking?", "Which projects use Qdrant?"],
  "ai-sales-assistant": ["Why is lead scoring outside the LLM?", "Which n8n workflows does AI Sales use?", "How does Human-in-the-Loop protect sales actions?"],
};

function add({ type, slug, title, section, url, content, links = [], suggestedQuestions = [] }) {
  const clean = String(content || "").replace(/\s+/g, " ").trim();
  if (clean.length < 40) return;
  documents.push({
    id: `${type}:${slug}:${slugify(section)}`,
    type,
    slug,
    project_slug: type === "project" ? slug : null,
    title,
    section,
    url,
    content: clean,
    links,
    suggested_questions: suggestedQuestions.slice(0, 3),
  });
}

add({ type: "about", slug: "about", title: experience.ABOUT.headline, section: "Professional positioning", url: "/#background", content: experience.ABOUT.paragraphs.join(" "), suggestedQuestions: ["Which projects best demonstrate this experience?", "What backend technologies does Tsinjo use?", "What is Tsinjo's professional experience?"] });

for (const pillar of experience.expertisePillars) {
  add({ type: "skill", slug: slugify(pillar.title), title: pillar.title, section: "Expertise", url: "/#expertise", content: `${pillar.plainDescription} Technical focus: ${pillar.technicalDetail}.`, suggestedQuestions: ["Which projects demonstrate this expertise?", "What is Tsinjo's production experience?"] });
}

for (const item of experience.experienceItems) {
  const common = { type: "experience", slug: item.id, title: `${item.title} at ${item.company}`, url: "/#experience" };
  add({ ...common, section: "Role overview", content: joinSentences(item.period, item.location, item.plainSummary, item.technicalSummary), suggestedQuestions: item.id === "h4h" ? projectQuestions["multi-tenant-rag"] : ["Which projects demonstrate this experience?", "What automation tools does Tsinjo use?"] });
  add({ ...common, section: "Engineering contributions", content: sentenceList(item.highlights), suggestedQuestions: ["What technical decisions did Tsinjo make?", "Which technologies supported this work?"] });
  const proof = (item.proof || []).map((entry) => `${entry.value} ${entry.label}`).join(", ");
  add({ ...common, section: "Stack and public evidence", content: joinSentences(`Technologies: ${sentenceList(item.stack || [])}`, proof && `Public portfolio evidence: ${proof}`) });
}

add({ type: "education", slug: "education", title: "Education", section: "Degrees", url: "/#background", content: experience.educationItems.map((item) => `${item.title}, ${item.detail || ""}, ${item.institution}, ${item.period || "period not displayed"}`).join(". "), suggestedQuestions: ["What AI certifications does Tsinjo have?", "What are his strongest engineering skills?"] });
add({ type: "skill", slug: "languages", title: "Languages", section: "Professional languages", url: "/#background", content: experience.languages.map((item) => `${item.name}: ${item.level}`).join(". ") });

for (const group of experience.skillGroups) {
  add({ type: "skill", slug: slugify(group.title), title: group.title, section: "Technical skills", url: "/#background", content: `Publicly listed skills: ${sentenceList(group.skills)}.`, suggestedQuestions: ["Which projects use these technologies?", "What production experience supports these skills?"] });
}

add({ type: "certification", slug: "featured-certifications", title: "Featured certifications", section: "Credentials", url: "/#background", content: experience.featuredCertifications.map((item) => `${item.title} by ${item.issuer}`).join(". "), suggestedQuestions: ["What is Tsinjo's education?", "Which projects demonstrate his AI engineering skills?"] });
add({ type: "certification", slug: "additional-certifications", title: "Additional certifications", section: "Credentials", url: "/#background", content: experience.allCertifications.slice(experience.featuredCertifications.length).map((item) => `${item.title} by ${item.issuer}`).join(". ") });

for (const project of projects.featuredProjects) {
  const route = project.caseStudyLink;
  const links = [
    { label: `View ${project.title} case study`, url: route },
    ...(project.githubLink ? [{ label: "View GitHub repository", url: project.githubLink }] : []),
    ...(project.demoLink ? [{ label: "Open live demo", url: project.demoLink }] : []),
  ];
  const common = { type: "project", slug: project.slug, title: project.title, url: route, links, suggestedQuestions: projectQuestions[project.slug] || [] };
  add({ ...common, section: "Overview", content: `${project.plainSummary} ${project.description} ${project.overview || ""}` });
  add({ ...common, section: "Problem and solution", content: `${project.problem || ""} ${project.solution || ""} ${sentenceList(project.highlights)}` });
  add({ ...common, section: "Architecture", content: joinSentences(sentenceList(project.architecture || []), project.howItWorks && `Flow: ${sentenceList(project.howItWorks)}`) });
  add({ ...common, section: "Engineering decisions", content: joinSentences(sentenceList(project.decisions || []), project.decisionHighlight && `${project.decisionHighlight.title}: ${project.decisionHighlight.body}`) });
  const proof = (project.proof || []).map((entry) => `${entry.value} ${entry.label}${entry.hint ? ` (${entry.hint})` : ""}`).join(", ");
  add({ ...common, section: "Controls, evidence and stack", content: joinSentences(sentenceList(project.security || []), project.hitl, `Technologies: ${sentenceList(project.stack)}`, proof && `Public evidence: ${proof}`) });
  if (project.scoring) add({ ...common, section: "Deterministic lead scoring", content: `${project.scoring.summary} Factors: ${sentenceList(project.scoring.factors)}. Range: ${project.scoring.range}. Classes: ${sentenceList(project.scoring.classes)}.` });
  if (project.automation) add({ ...common, section: "n8n workflow automation", content: `${project.automation.summary} Workflows: ${sentenceList(project.automation.workflows)}.` });
}

for (const project of projects.secondaryProjects) {
  const links = [...(project.githubLink ? [{ label: "View GitHub repository", url: project.githubLink }] : []), ...(project.demoLink ? [{ label: "Open live demo", url: project.demoLink }] : [])];
  add({ type: "project", slug: project.id, title: project.title, section: "Project overview", url: project.githubLink || "/#work", content: `${project.description} Category: ${project.category}. Technologies: ${sentenceList(project.stack)}.`, links, suggestedQuestions: ["Which flagship project uses related technologies?", "What are Tsinjo's strongest engineering projects?"] });
}

add({ type: "contact", slug: "contact", title: "Contact and public profiles", section: "Public links", url: "/#contact", content: `Email: ${experience.EMAIL}. GitHub: ${experience.GITHUB_URL}. LinkedIn: ${experience.LINKEDIN_URL}. CV: ${experience.CV_PATH}.`, links: [{ label: "Contact Tsinjo", url: "/#contact" }, { label: "View GitHub", url: experience.GITHUB_URL }, { label: "View LinkedIn", url: experience.LINKEDIN_URL }], suggestedQuestions: ["Which projects should I review first?", "What is Tsinjo's professional experience?"] });

const knownRoutes = new Set(["/#work", "/#expertise", "/#experience", "/#background", "/#contact", ...projects.featuredProjects.map((project) => project.caseStudyLink)]);
for (const document of documents) {
  if (document.url.startsWith("/") && !knownRoutes.has(document.url)) throw new Error(`Unknown internal source route: ${document.url}`);
  for (const link of document.links) if (link.url.startsWith("/") && !knownRoutes.has(link.url)) throw new Error(`Unknown internal CTA route: ${link.url}`);
}

fs.writeFileSync(outputFile, `${JSON.stringify(documents, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ source_modules: ["src/data/projects.ts", "src/data/experience.ts"], documents: documents.length, output: path.relative(repoRoot, outputFile) }, null, 2));
