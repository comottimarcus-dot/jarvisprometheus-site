"use strict";

const byId = (id) => document.getElementById(id);
const shortDigest = (value) => `${value.slice(0, 18)}…${value.slice(-8)}`;

function eventRow(number, text, status) {
  const item = document.createElement("li");
  const index = document.createElement("span");
  const copy = document.createElement("p");
  const result = document.createElement("b");
  index.textContent = number;
  copy.textContent = text;
  result.textContent = status;
  item.append(index, copy, result);
  return item;
}

function failClosed(elementId) {
  const element = byId(elementId);
  element.textContent = "EVIDENCE FAILED · FAIL CLOSED";
  element.style.color = "var(--danger)";
}

async function loadPublicRepositoryBinding() {
  try {
    const response = await fetch("evidence/public-repository-binding-v1.json", {
      cache: "no-store",
      credentials: "omit",
    });
    if (!response.ok) throw new Error("public repository binding unavailable");
    const evidence = await response.json();
    if (
      evidence.schema_version !== "prometheus-playground-public-repository-binding-v1" ||
      evidence.result !== "GREEN" ||
      evidence.binding_status !== "IMMUTABLY_BOUND" ||
      evidence.execution_state !== "NOT_EXECUTED" ||
      evidence.authority.execution_authorized !== false ||
      evidence.authority.adoption_authorized !== false
    ) {
      throw new Error("unexpected public repository binding state");
    }

    byId("source-binding-result").textContent = "PUBLIC SOURCE · BOUND";
    byId("source-binding-commit").textContent = shortDigest(evidence.repository.commit_sha);
    byId("source-binding-digest").textContent = shortDigest(evidence.repository.source_sha256);
    byId("source-binding-files").textContent = String(evidence.repository.source_file_count);
    byId("source-binding-execution").textContent = evidence.execution_state.replace("_", " ");
  } catch (_error) {
    failClosed("source-binding-result");
  }
}

async function loadPurposeBoundEvidence() {
  try {
    const response = await fetch("evidence/purpose-bound-experiment-public-v1.json", {
      cache: "no-store",
      credentials: "omit",
    });
    if (!response.ok) throw new Error("purpose-bound evidence unavailable");
    const evidence = await response.json();
    if (
      evidence.schema_version !== "prometheus-playground-public-purpose-bound-evidence-v1" ||
      evidence.result !== "GREEN" ||
      evidence.governance.adoption_state !== "NOT_ADOPTED"
    ) {
      throw new Error("unexpected purpose-bound evidence state");
    }

    byId("purpose-evidence-result").textContent = "PURPOSE-BOUND EVIDENCE · GREEN";
    byId("purpose-image").textContent = shortDigest(evidence.experiment.immutable_image_digest);
    byId("purpose-network").textContent = evidence.containment.network.toUpperCase();
    byId("purpose-exit-code").textContent = String(evidence.experiment.exit_code);
    byId("purpose-processes").textContent = String(evidence.lifecycle.running_containers_after_execution);
    byId("purpose-evidence-hash").textContent = evidence.evidence.source_record_sha256;
    byId("purpose-event-stream").replaceChildren(
      eventRow("01", "Candidate repository capability inspected", "DISCOVERED"),
      eventRow("02", "Purpose, source and immutable image hash-bound", "BOUND"),
      eventRow("03", "Exact one-shot human authorization consumed", "ONCE"),
      eventRow("04", "Repository code ran inside the isolated container", "EXIT 0"),
      eventRow("05", "Semantic result matched broker bytes and digest", "VERIFIED"),
      eventRow("06", "Evaluation completed without capability adoption", "NOT ADOPTED"),
    );
  } catch (_error) {
    failClosed("purpose-evidence-result");
  }
}

async function loadBaselineEvidence() {
  try {
    const response = await fetch("evidence/sandbox-canary-public-v1.json", {
      cache: "no-store",
      credentials: "omit",
    });
    if (!response.ok) throw new Error("baseline evidence unavailable");
    const evidence = await response.json();
    if (
      evidence.schema_version !== "prometheus-playground-public-sandbox-canary-v1" ||
      evidence.result !== "GREEN"
    ) {
      throw new Error("unexpected baseline evidence state");
    }

    byId("baseline-evidence-result").textContent = "BROKER BASELINE · GREEN";
    byId("baseline-image").textContent = shortDigest(evidence.immutable_image_digest);
    byId("baseline-network").textContent = evidence.containment.network.toUpperCase();
    byId("baseline-exit-code").textContent = String(evidence.execution.exit_code);
    byId("baseline-processes").textContent = String(evidence.post_execution.canary_process_count);
    byId("baseline-evidence-hash").textContent = evidence.source_manifest_sha256;
    byId("baseline-event-stream").replaceChildren(
      eventRow("01", "Pinned BusyBox image resolved", "PASS"),
      eventRow("02", "One-shot Ed25519 authorization verified", "PASS"),
      eventRow("03", "Health-only container canary completed", "EXIT 0"),
      eventRow("04", "Identical baseline authorization replay attempted", "DENIED"),
      eventRow("05", "Post-run audit found no lingering process", "ZERO"),
    );
  } catch (_error) {
    failClosed("baseline-evidence-result");
  }
}

Promise.all([
  loadPublicRepositoryBinding(),
  loadPurposeBoundEvidence(),
  loadBaselineEvidence(),
]);
