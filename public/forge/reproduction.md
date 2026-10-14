# Reproducing PROMETHEUS FORGE

This page is a recorded prototype showcase. It does not expose a live voice or industrial-control endpoint.

Download `source.zip`, unpack it and read `README.md`. The source records the FORGE contribution and its dependency on the pre-existing JARVIS Core/X6 and PROMETHEUS VOICE repositories. It is not a self-contained distribution of those entire systems.

The public fixtures and strict local contracts can be checked without AMD or hardware:

```bash
PYTHONPATH=src python3 -m unittest discover -s tests -p test_contracts.py
```

Live reproduction requires the configured Core runtime, existing Xiaozhi/AssemblyAI bridge, compatible ESP32-C3 display firmware, a private local TLS MQTT broker, and a separately authorized AMD endpoint. The firmware never calls the cloud model directly. Keep provisioning, tokens and private runtime files out of source control.

The actual demo used a physical bench emulator of pump P-204, Qwen/Qwen3-32B, the explicit amd-mi300x-reasoning route, and the amd-mi300x-vllm executor. The deployment was temporary. The published inventory identifies that recorded deployment, not a promise of current availability.

Status reads use local telemetry only. Explicit analysis uses the Core-owned X6 route. Signals are simulated and thresholds are demo rules. Every newer sample supersedes the admitted hash; the recorded model outputs are therefore historical. Current recommendations and physical actuation remain blocked.

The clip on this page is the synchronized full-take review, with a web-compatible audio encode. Its approved visual stream, framing, timing and duration are preserved. The higher-quality original review is retained separately.
