import type { LabCapability } from "@/types/lab";

export const labCapabilities: LabCapability[] = [
  {
    id: "rag",
    number: "01",
    title: { en: "RAG Engineering", fr: "Ingénierie RAG" },
    summary: {
      en: "Evidence-first retrieval systems that preserve document lifecycle, access scope, citations, and measurable refusal behavior.",
      fr: "Des systèmes de recherche centrés sur les preuves qui préservent le cycle de vie documentaire, les droits d’accès, les citations et un comportement de refus mesurable.",
    },
    details: [
      {
        en: "Validated ingestion with deterministic chunking, metadata, duplicate detection, and re-indexing boundaries.",
        fr: "Ingestion validée avec découpage déterministe, métadonnées, détection des doublons et limites de réindexation.",
      },
      {
        en: "Dense and lexical retrieval, RRF fusion, reranking, relevance thresholds, and tenant-aware filtering where implemented.",
        fr: "Recherche dense et lexicale, fusion RRF, reranking, seuils de pertinence et filtrage par organisation lorsqu’ils sont implémentés.",
      },
      {
        en: "Structured sources before generation, inspectable citations, deterministic evaluation sets, and explicit no-answer paths.",
        fr: "Sources structurées avant génération, citations vérifiables, jeux d’évaluation déterministes et parcours explicites sans réponse.",
      },
    ],
    workflow: [
      { en: "Validate & ingest", fr: "Valider et ingérer" },
      { en: "Chunk & annotate", fr: "Découper et annoter" },
      { en: "Retrieve & filter", fr: "Rechercher et filtrer" },
      { en: "Fuse & rerank", fr: "Fusionner et reranker" },
      { en: "Answer with sources", fr: "Répondre avec sources" },
    ],
    technologies: ["Qdrant", "BM25", "RRF", "FastEmbed", "PostgreSQL", "OpenAI"],
    maturity: "Production",
    references: [
      { slug: "multi-tenant-rag", label: "Multi-Tenant RAG" },
      { slug: "sihia", label: "SIHIA" },
      { slug: "ai-business-os", label: "AI BOS" },
    ],
  },
  {
    id: "agentic",
    number: "02",
    title: { en: "Agentic AI", fr: "IA agentique" },
    summary: {
      en: "Governed agents where models propose typed operations while application policy retains authority over permissions and execution.",
      fr: "Des agents gouvernés où les modèles proposent des opérations typées tandis que les règles applicatives conservent l’autorité sur les permissions et l’exécution.",
    },
    details: [
      {
        en: "LangGraph state orchestration for bounded account intelligence and explicit stop conditions.",
        fr: "Orchestration d’état LangGraph pour une intelligence de compte bornée avec des conditions d’arrêt explicites.",
      },
      {
        en: "Finite tool registries, structured outputs, deterministic policy checks, and role- and tenant-scoped context.",
        fr: "Registres d’outils finis, sorties structurées, règles déterministes et contexte limité au rôle et à l’organisation.",
      },
      {
        en: "Human approval for sensitive actions with policy re-checks, stale-data protection, audit records, and idempotent execution.",
        fr: "Validation humaine des actions sensibles avec nouvelle vérification des règles, protection contre les données obsolètes, audit et exécution idempotente.",
      },
    ],
    workflow: [
      { en: "Authorize context", fr: "Autoriser le contexte" },
      { en: "Reason over evidence", fr: "Raisonner sur les preuves" },
      { en: "Propose typed action", fr: "Proposer une action typée" },
      { en: "Check policy", fr: "Vérifier les règles" },
      { en: "Approve & audit", fr: "Valider et auditer" },
    ],
    technologies: ["LangGraph", "Pydantic", "Tool Calling", "RBAC", "Audit Logs"],
    maturity: "Prototype",
    references: [
      { slug: "arcwell-agentic-crm", label: "Arcwell" },
      { slug: "ai-business-os", label: "AI BOS" },
      { slug: "ai-sales-assistant", label: "AI Sales Assistant" },
    ],
  },
  {
    id: "automation",
    number: "03",
    title: { en: "AI Automation", fr: "Automatisation IA" },
    summary: {
      en: "Business workflows that connect AI decisions to APIs and operators through controlled, observable automation.",
      fr: "Des workflows métier qui relient les décisions IA aux API et aux opérateurs au moyen d’automatisations contrôlées et observables.",
    },
    details: [
      {
        en: "n8n orchestration for intake, classification, routing, reminders, delivery, and operator handoffs.",
        fr: "Orchestration n8n pour l’entrée, la classification, le routage, les rappels, la livraison et les transferts aux opérateurs.",
      },
      {
        en: "Signed webhooks, schema validation, deduplication, retries, outbox processing, and dead-letter handling where supported.",
        fr: "Webhooks signés, validation de schéma, déduplication, reprises, traitement outbox et gestion des échecs lorsque disponibles.",
      },
      {
        en: "Business rules remain deterministic; AI assists extraction and drafting without silently owning high-impact decisions.",
        fr: "Les règles métier restent déterministes ; l’IA aide à extraire et rédiger sans prendre silencieusement les décisions à fort impact.",
      },
    ],
    workflow: [
      { en: "Receive webhook", fr: "Recevoir le webhook" },
      { en: "Validate payload", fr: "Valider les données" },
      { en: "Apply business rules", fr: "Appliquer les règles" },
      { en: "Run workflow", fr: "Exécuter le workflow" },
      { en: "Monitor & recover", fr: "Surveiller et reprendre" },
    ],
    technologies: ["n8n", "Webhooks", "FastAPI", "Celery", "Redis", "PostgreSQL"],
    maturity: "Prototype",
    references: [
      { slug: "offshore-fares", label: "Offshore Fares" },
      { slug: "ai-sales-assistant", label: "AI Sales Assistant" },
      { slug: "arcwell-agentic-crm", label: "Arcwell" },
    ],
  },
  {
    id: "production",
    number: "04",
    title: { en: "Production Engineering", fr: "Ingénierie de production" },
    summary: {
      en: "The infrastructure around the model: reliable APIs, persistent state, background work, observability, security boundaries, and repeatable delivery.",
      fr: "L’infrastructure autour du modèle : API fiables, état persistant, tâches asynchrones, observabilité, frontières de sécurité et livraison reproductible.",
    },
    details: [
      {
        en: "FastAPI service boundaries with typed contracts, SQL migrations, health endpoints, and structured error handling.",
        fr: "Services FastAPI avec contrats typés, migrations SQL, endpoints de santé et gestion structurée des erreurs.",
      },
      {
        en: "PostgreSQL as system of record, Qdrant for filtered vector search, and Redis/Celery for rate limits and background processing.",
        fr: "PostgreSQL comme source de vérité, Qdrant pour la recherche vectorielle filtrée et Redis/Celery pour les limites et traitements asynchrones.",
      },
      {
        en: "Docker-based environments, CI quality gates, logs, metrics, explicit configuration, and documented degradation paths.",
        fr: "Environnements Docker, contrôles qualité CI, logs, métriques, configuration explicite et modes dégradés documentés.",
      },
    ],
    workflow: [
      { en: "Define contracts", fr: "Définir les contrats" },
      { en: "Persist safely", fr: "Persister sûrement" },
      { en: "Process asynchronously", fr: "Traiter en arrière-plan" },
      { en: "Observe behavior", fr: "Observer le système" },
      { en: "Deploy repeatably", fr: "Déployer de façon reproductible" },
    ],
    technologies: ["FastAPI", "PostgreSQL", "Qdrant", "Redis", "Celery", "Docker"],
    maturity: "Production",
    references: [
      { slug: "multi-tenant-rag", label: "Multi-Tenant RAG" },
      { slug: "sihia", label: "SIHIA" },
      { slug: "arcwell-agentic-crm", label: "Arcwell" },
    ],
  },
  {
    id: "assisted-development",
    number: "05",
    title: { en: "AI-Assisted Development", fr: "Développement assisté par IA" },
    summary: {
      en: "A reviewable engineering workflow that uses AI tools to accelerate repository analysis and implementation without replacing tests, source review, or human accountability.",
      fr: "Un processus d’ingénierie vérifiable qui utilise les outils IA pour accélérer l’analyse et l’implémentation sans remplacer les tests, la revue des sources ni la responsabilité humaine.",
    },
    details: [
      {
        en: "Claude Code, Codex, and Cursor support bounded exploration, change planning, implementation, and review.",
        fr: "Claude Code, Codex et Cursor soutiennent l’exploration bornée, la planification, l’implémentation et la revue.",
      },
      {
        en: "Claims are checked against repository code and documentation before they become public portfolio content.",
        fr: "Les affirmations sont vérifiées dans le code et la documentation avant de devenir du contenu public du portfolio.",
      },
      {
        en: "Git diffs, static analysis, automated tests, production builds, and visual checks remain the acceptance gates.",
        fr: "Les diffs Git, l’analyse statique, les tests automatisés, les builds de production et les contrôles visuels restent les critères d’acceptation.",
      },
    ],
    workflow: [
      { en: "Inspect evidence", fr: "Inspecter les preuves" },
      { en: "Plan bounded change", fr: "Planifier un changement borné" },
      { en: "Implement", fr: "Implémenter" },
      { en: "Test & review", fr: "Tester et revoir" },
      { en: "Document limits", fr: "Documenter les limites" },
    ],
    technologies: ["Claude Code", "Codex", "Cursor", "Git", "CI", "Automated Tests"],
    maturity: "Prototype",
    references: [
      { slug: "arcwell-agentic-crm", label: "Arcwell" },
      { slug: "sihia", label: "SIHIA" },
      { slug: "ai-business-os", label: "AI BOS" },
    ],
  },
];
