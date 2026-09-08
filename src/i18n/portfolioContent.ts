import type { Language } from "./I18nProvider";

const french: Record<string, string> = {
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
