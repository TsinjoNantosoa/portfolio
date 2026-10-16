class PlaygroundUnavailableError(RuntimeError):
    """A known provider or retrieval outage safe to expose as HTTP 503."""

