import type { Language } from "./I18nProvider";

const french: Record<string, string> = {
  "2025 – September 2026": "2025 – Septembre 2026",
  "Featured Professional Project · Production + Pilot": "Projet professionnel phare · Production + pilote",
  "Multi-tenant RAG": "RAG multi-tenant",
  "Commercial agent": "Agent commercial",
  "Tenant knowledge": "Connaissances par tenant",
  "Pilot": "Pilote",
  "Isolated": "Isolé",
  "AI Engineer — Generative AI, RAG & AI Agents":
    "Ingénieur IA — IA générative, RAG et agents IA",
  "Developed and deployed a multi-tenant conversational AI platform combining RAG, hybrid search, custom assistants, and LLM Tool Calling. Designed a commercial agent extension with business-tool orchestration, CRM integrations, and safety controls.":
    "Développement et déploiement d’une plateforme d’IA conversationnelle multi-tenant intégrant RAG, recherche hybride, assistants personnalisés et LLM Tool Calling. Conception d’une extension agentique commerciale avec orchestration d’outils métier, intégrations CRM et contrôles de sécurité.",
  "Built a reusable RAG platform deployed for multiple organizations, with tenant-isolated knowledge and configuration":
    "Construction d’une plateforme RAG réutilisable, déployée pour plusieurs organisations, avec isolation des connaissances et configurations par tenant",
  "Evolved the deterministic RAG assistant into a pilot commercial agent that selects approved business tools in a controlled execution loop":
    "Évolution de l’assistant RAG déterministe vers un agent commercial pilote sélectionnant des outils métier approuvés dans une boucle d’exécution contrôlée",
  "Integrated HubSpot, Microsoft Teams, and SMTP workflows with server-side validation and explicit consent before sensitive actions":
    "Intégration de workflows HubSpot, Microsoft Teams et SMTP avec validation côté serveur et consentement explicite avant les actions sensibles",
  "A multi-tenant conversational AI platform combining grounded knowledge assistants with a controlled commercial agent that can select and use approved business tools.":
    "Une plateforme d’IA conversationnelle multi-tenant combinant des assistants fondés sur les connaissances et un agent commercial contrôlé capable de sélectionner et d’utiliser des outils métier approuvés.",
  "Reusable RAG platform deployed for multiple organizations with isolated knowledge and configuration":
    "Plateforme RAG réutilisable déployée pour plusieurs organisations avec connaissances et configurations isolées",
  "Hybrid semantic and BM25 retrieval with source-grounded answers":
    "Recherche hybride sémantique et BM25 avec réponses fondées sur des sources",
  "Pilot commercial agent using controlled LLM Tool Calling and business integrations":
    "Agent commercial pilote utilisant le LLM Tool Calling contrôlé et des intégrations métier",
  "Production RAG platform · Agent extension evaluated as a pilot":
    "Plateforme RAG en production · Extension agentique évaluée en pilote",
  "Built at Humans4Help Madagascar as a professional platform for several organizations. It combines a production RAG foundation with a distinct commercial-agent extension, keeping deterministic retrieval and action-oriented agent behavior clearly separated.":
    "Conçue chez Humans4Help Madagascar comme plateforme professionnelle pour plusieurs organisations. Elle combine une base RAG en production et une extension d’agent commercial distincte, en séparant clairement la recherche déterministe du comportement agentique orienté action.",
  "Organizations needed reliable assistants grounded in their own content, with isolated data and configuration. The platform also needed to move beyond question answering and support commercial workflows without giving the LLM unrestricted control over business actions.":
    "Les organisations avaient besoin d’assistants fiables, fondés sur leurs propres contenus, avec des données et configurations isolées. La plateforme devait aussi dépasser la simple réponse aux questions et soutenir des processus commerciaux sans donner au LLM un contrôle illimité sur les actions métier.",
  "Built an end-to-end platform spanning content ingestion, hybrid retrieval, tenant-aware APIs, conversational interfaces, LLM providers, and deployment. Added a separate agentic extension in which the model can select approved tools while server-side code validates parameters, consent, iteration limits, and execution outcomes.":
    "Construction d’une plateforme de bout en bout couvrant ingestion, recherche hybride, API tenant-aware, interfaces conversationnelles, fournisseurs LLM et déploiement. Ajout d’une extension agentique distincte où le modèle sélectionne des outils approuvés tandis que le serveur valide paramètres, consentement, limites d’itération et résultats d’exécution.",
  "React and TypeScript widget embedded in client websites, including WordPress integrations":
    "Widget React et TypeScript intégré aux sites clients, notamment WordPress",
  "FastAPI services for tenant configuration, sessions, retrieval, responses, and server-side controls":
    "Services FastAPI pour la configuration des tenants, les sessions, la recherche, les réponses et les contrôles côté serveur",
  "RAG path: ingestion, extraction, chunking, embeddings, Qdrant vector search, BM25, and source-grounded context":
    "Chemin RAG : ingestion, extraction, segmentation, embeddings, recherche vectorielle Qdrant, BM25 et contexte fondé sur les sources",
  "Agent path: LangChain bind_tools(), tool_calls, ToolMessage results, controlled execution loops, and conversational state":
    "Chemin agentique : bind_tools() LangChain, tool_calls, résultats ToolMessage, boucles d’exécution contrôlées et état conversationnel",
  "Configurable OpenAI and Azure OpenAI providers integrated through the backend":
    "Fournisseurs OpenAI et Azure OpenAI configurables, intégrés via le backend",
  "PostgreSQL for application data, Redis for transient state, and Docker-based delivery":
    "PostgreSQL pour les données applicatives, Redis pour l’état transitoire et livraison basée sur Docker",
  "Content from approved websites and documents is extracted, segmented, embedded, and indexed for the correct organization.":
    "Le contenu des sites et documents approuvés est extrait, segmenté, vectorisé et indexé pour la bonne organisation.",
  "A visitor asks a question through the branded React widget; FastAPI resolves the tenant and conversation context.":
    "Un visiteur pose une question via le widget React personnalisé ; FastAPI résout le tenant et le contexte conversationnel.",
  "The RAG path retrieves tenant-scoped semantic and lexical evidence, then supplies grounded context and sources to the LLM.":
    "Le chemin RAG récupère des preuves sémantiques et lexicales limitées au tenant, puis fournit au LLM un contexte et des sources fiables.",
  "For eligible commercial requests, the separate agent path lets the LLM select from a restricted set of business tools.":
    "Pour les demandes commerciales éligibles, le chemin agentique distinct permet au LLM de choisir parmi un ensemble restreint d’outils métier.",
  "The server validates tool parameters, consent, access rules, and iteration limits before executing any action.":
    "Le serveur valide les paramètres des outils, le consentement, les règles d’accès et les limites d’itération avant toute action.",
  "Tool results return to the agent as structured messages, which are used to prepare the final response or a human handoff.":
    "Les résultats des outils reviennent à l’agent sous forme de messages structurés pour préparer la réponse finale ou un transfert humain.",
  "Kept deterministic RAG retrieval separate from the agentic execution loop":
    "Séparation de la recherche RAG déterministe et de la boucle d’exécution agentique",
  "Scoped knowledge, prompts, branding, and configuration to each organization":
    "Connaissances, prompts, identité visuelle et configuration limités à chaque organisation",
  "Allowed the agent to choose only registered tools; authorization and execution remain server-controlled":
    "L’agent ne choisit que parmi des outils enregistrés ; l’autorisation et l’exécution restent contrôlées par le serveur",
  "Required explicit consent before contact collection or other sensitive commercial actions":
    "Consentement explicite requis avant la collecte de contact ou toute autre action commerciale sensible",
  "Organization website and commercial-offer search": "Recherche sur les sites des organisations et dans les offres commerciales",
  "Visitor-needs qualification and contact-request preparation": "Qualification des besoins visiteurs et préparation des demandes de contact",
  "Human handoff": "Transfert vers un interlocuteur humain",
  "SMTP messaging": "Messagerie SMTP",
  "Tenant isolation for knowledge, sessions, and configuration": "Isolation par tenant des connaissances, sessions et configurations",
  "Server-side input and tool-parameter validation": "Validation côté serveur des entrées et paramètres des outils",
  "Explicit consent gates and access controls before sensitive actions": "Consentement explicite et contrôles d’accès avant les actions sensibles",
  "Iteration limits, error handling, logging, and application guardrails around LLM behavior": "Limites d’itération, gestion des erreurs, journalisation et garde-fous applicatifs autour du LLM",
  "Automated tests and CI/CD checks for platform reliability": "Tests automatisés et contrôles CI/CD pour la fiabilité de la plateforme",
  "Docker-based deployment and platform maintenance through Plesk": "Déploiement basé sur Docker et maintenance de la plateforme via Plesk",
  "A reusable RAG platform deployed for multiple organizations": "Une plateforme RAG réutilisable déployée pour plusieurs organisations",
  "Customizable assistants with organization-specific knowledge and visual identity": "Des assistants personnalisables avec connaissances et identité visuelle propres à chaque organisation",
  "One integrated system spanning backend, retrieval, conversational frontend, LLMs, data stores, and deployment": "Un système intégré couvrant backend, recherche, frontend conversationnel, LLM, stockage et déploiement",
  "A controlled evolution from a deterministic RAG chatbot to a commercial Tool Calling agent": "Une évolution contrôlée d’un chatbot RAG déterministe vers un agent commercial avec Tool Calling",
  "An agentic extension developed and evaluated in a pilot environment": "Une extension agentique développée et évaluée en environnement pilote",
  "Designing tenant-aware AI systems from ingestion through retrieval and response generation": "Conception de systèmes IA tenant-aware, de l’ingestion à la recherche et à la génération de réponses",
  "Separating probabilistic reasoning from deterministic authorization and business execution": "Séparation du raisonnement probabiliste, de l’autorisation déterministe et de l’exécution métier",
  "Building reliable agent loops with validation, consent, failure handling, and observability": "Construction de boucles agentiques fiables avec validation, consentement, gestion des échecs et observabilité",
  "Delivering maintainable full-stack AI features across backend, frontend, data, testing, and deployment": "Livraison de fonctionnalités IA full-stack maintenables couvrant backend, frontend, données, tests et déploiement",
  "Generative AI & Agentic Systems": "IA générative et systèmes agentiques",
  "Backend Engineering": "Ingénierie backend",
  "Data & Vector Databases": "Données et bases vectorielles",
  "Frontend Engineering": "Ingénierie frontend",
  "AI Automation & Integration": "Automatisation IA et intégration",
  "DevOps & Infrastructure": "DevOps et infrastructure",
  "Data Engineering & Machine Learning": "Data engineering et machine learning",
  "Master 2": "Master 2",
  "A shared AI platform for independent assistants, with each organization's data, knowledge, branding, and configuration kept isolated.":
    "Une plateforme IA partagée pour des assistants indépendants, avec une isolation stricte des données, connaissances, marques et configurations de chaque organisation.",
  "Each organization only retrieves knowledge it is authorized to access":
    "Chaque organisation récupère uniquement les connaissances auxquelles elle est autorisée à accéder",
  "Automated website ingestion into searchable knowledge bases":
    "Ingestion automatisée de sites web dans des bases de connaissances interrogeables",
  "Admin APIs for configuration, branding, and assistant operations":
    "API d’administration pour la configuration, l’identité visuelle et les opérations des assistants",
  "An AI layer that helps CRM teams automate work while keeping sensitive actions under business rules and human approval.":
    "Une couche IA qui aide les équipes CRM à automatiser leur travail tout en soumettant les actions sensibles aux règles métier et à une validation humaine.",
  "Agents propose actions instead of executing blindly":
    "Les agents proposent des actions au lieu de les exécuter aveuglément",
  "Sensitive AI actions must pass business rules before execution":
    "Les actions IA sensibles doivent respecter les règles métier avant exécution",
  "Human approval before high-impact CRM changes":
    "Validation humaine avant toute modification CRM à fort impact",
  "An AI-first business platform where agents can retrieve context, help with business tasks, and propose controlled actions.":
    "Une plateforme métier centrée sur l’IA où les agents retrouvent le contexte, assistent les tâches métier et proposent des actions contrôlées.",
  "Agents help with business tasks using authorized tools":
    "Les agents assistent les tâches métier avec des outils autorisés",
  "Human approval before sensitive operations":
    "Validation humaine avant les opérations sensibles",
  "Shared platform with organization-level access control":
    "Plateforme partagée avec contrôle d’accès au niveau de l’organisation",
  "A healthcare operations platform combining hospital workflows, predictive analytics, and an AI assistant grounded in trusted knowledge.":
    "Une plateforme d’opérations de santé combinant processus hospitaliers, analyse prédictive et assistant IA fondé sur des connaissances fiables.",
  "Combines semantic and keyword search for more reliable evidence":
    "Combine recherche sémantique et recherche par mots-clés pour des preuves plus fiables",
  "Reranks evidence before the model answers":
    "Reclasse les preuves avant la réponse du modèle",
  "Answers include citations and can refuse when evidence is weak":
    "Les réponses incluent des citations et peuvent refuser lorsque les preuves sont insuffisantes",
  "An AI-assisted sales platform that qualifies leads, gathers structured information, and automates follow-up workflows while keeping business scoring deterministic and sensitive decisions under human control.":
    "Une plateforme commerciale assistée par IA qui qualifie les prospects, collecte des informations structurées et automatise les relances, avec un scoring déterministe et des décisions sensibles sous contrôle humain.",
  "Conversational AI qualification with structured lead-data extraction":
    "Qualification conversationnelle avec extraction structurée des données prospect",
  "Deterministic 0–100 lead scoring kept outside the LLM":
    "Scoring déterministe de 0 à 100 réalisé hors du LLM",
  "Human handoff before sensitive or high-value next steps":
    "Transmission à un humain avant les étapes sensibles ou à forte valeur",
  "Built a shared AI assistant platform allowing multiple organizations to operate independent assistants while keeping their knowledge and configuration isolated.":
    "Conception d’une plateforme partagée permettant à plusieurs organisations d’exploiter des assistants indépendants avec des connaissances et configurations isolées.",
  "Built business automation workflows connecting APIs, CRM tools, and AI services with reliability-first orchestration.":
    "Conception de workflows d’automatisation reliant API, CRM et services IA avec une orchestration axée sur la fiabilité.",
  "Implemented CRM and operational automation covering quotes, orders, planning, delivery, and invoicing.":
    "Mise en œuvre d’automatisations CRM et opérationnelles couvrant devis, commandes, planification, livraison et facturation.",
  "AI Engineer — Conversational AI & RAG Systems":
    "Ingénieur IA — IA conversationnelle et systèmes RAG",
  "AI Automation Consultant": "Consultant en automatisation IA",
  "CRM & Business Automation — Odoo 18":
    "CRM et automatisation métier — Odoo 18",
  "Delivered tenant-isolated conversational AI backends":
    "Livraison de backends d’IA conversationnelle avec isolation par tenant",
  "Operated production RAG with knowledge isolation and retrieval controls":
    "Exploitation d’un RAG en production avec isolation des connaissances et contrôle de la recherche",
  "Strengthened deployment, reliability, auditing, and security workflows":
    "Renforcement du déploiement, de la fiabilité, de l’audit et des processus de sécurité",
  "Designed modular workflows with retries, idempotency, and error handling":
    "Conception de workflows modulaires avec reprises, idempotence et gestion des erreurs",
  "Extended automation with Python/FastAPI when orchestration alone was insufficient":
    "Extension des automatisations avec Python/FastAPI lorsque l’orchestration seule ne suffisait pas",
  "Customized CRM and operational processes in Odoo 18":
    "Personnalisation des processus CRM et opérationnels dans Odoo 18",
  "Supported Docker-based delivery and CI/CD-oriented development practices":
    "Accompagnement du déploiement Docker et des pratiques de développement orientées CI/CD",
  "World Bank open-data questions answered with cited sources.":
    "Questions sur les données ouvertes de la Banque mondiale avec réponses sourcées.",
  "Ask questions about World Bank open data and get sourced answers.":
    "Interrogez les données ouvertes de la Banque mondiale et obtenez des réponses sourcées.",
  "Real-time IoT streaming pipeline prepared for analytics ingestion.":
    "Pipeline IoT temps réel préparé pour l’ingestion analytique.",
  "Scheduled weather data extraction and transformation for analytics.":
    "Extraction et transformation planifiées de données météo pour l’analyse.",
  "Portfolio quality and banking risk indicators in one dashboard.":
    "Qualité du portefeuille et indicateurs de risque bancaire réunis dans un tableau de bord.",
  "Master’s Degree": "Master",
  "Bachelor’s Degree": "Licence",
  "Applied Mathematics, Computer Science & Statistics (MISA)":
    "Mathématiques appliquées, informatique et statistique (MISA)",
};

export function localizePortfolioText(
  text: string | undefined,
  language: Language,
) {
  if (!text || language === "en") return text;
  return french[text] || text;
}
