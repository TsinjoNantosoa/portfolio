from app.schemas import KnowledgeChunk


def build_response_metadata(chunks: list[KnowledgeChunk]) -> tuple[list[dict], list[dict], list[str]]:
    """Return deterministic sources, CTAs and follow-ups from trusted metadata only."""
    sources: list[dict] = []
    links: list[dict] = []
    questions: list[str] = []
    source_slugs: set[str] = set()
    link_urls: set[str] = set()

    for chunk in chunks:
        if chunk.slug not in source_slugs and len(sources) < 3:
            source_slugs.add(chunk.slug)
            sources.append({"title": chunk.title, "url": chunk.url, "section": chunk.section})
        for link in chunk.links:
            if link.url not in link_urls and len(links) < 3:
                link_urls.add(link.url)
                links.append(link.model_dump())
        for question in chunk.suggested_questions:
            if question not in questions and len(questions) < 3:
                questions.append(question)

    if not links:
        links = [{"label": f"View {source['title']}", "url": source["url"]} for source in sources[:2]]
    return sources, links, questions
