// Bridge exporter for migrating localStorage profiles to opener window.
(function bridgeExport() {
  "use strict";

  const BRIDGE_QUERY_KEY = "bridge";
  const BRIDGE_QUERY_VALUE = "myeongsik-export";
  const BRIDGE_HASH_KEY = "bridge-export-v1";
  const MESSAGE_TYPE = "MYOWOON_EXPORT_MYEONGSIK_V1";
  const STORAGE_KEYS = ["myeongsikList", "savedMyeongSikList"];

  const params = new URLSearchParams(window.location.search);
  const shouldRun =
    params.get(BRIDGE_QUERY_KEY) === BRIDGE_QUERY_VALUE ||
    window.location.hash.indexOf(BRIDGE_HASH_KEY) >= 0;

  if (!shouldRun) return;

  function toArray(parsed) {
    if (Array.isArray(parsed)) return parsed;
    if (!parsed || typeof parsed !== "object") return [];

    const obj = parsed;
    const listLike = [obj.myeongsikList, obj.savedMyeongSikList, obj.list, obj.items];

    for (let i = 0; i < listLike.length; i += 1) {
      const value = listLike[i];
      if (Array.isArray(value)) return value;
      if (typeof value === "string") {
        try {
          const nested = JSON.parse(value);
          if (Array.isArray(nested)) return nested;
        } catch (_) {
          // ignore nested parse error
        }
      }
    }
    return [];
  }

  function readLegacyList() {
    for (let i = 0; i < STORAGE_KEYS.length; i += 1) {
      const raw = window.localStorage.getItem(STORAGE_KEYS[i]);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        const list = toArray(parsed);
        if (Array.isArray(list) && list.length > 0) return list;
      } catch (_) {
        // ignore parse error and move next key
      }
    }
    return [];
  }

  function resolveTargetOrigin() {
    const raw = params.get("target");
    if (!raw) return "*";
    try {
      return new URL(raw).origin;
    } catch (_) {
      return "*";
    }
  }

  function renderStatus(posted, count) {
    const container = document.createElement("div");
    container.style.cssText =
      "position:fixed;inset:auto 12px 12px 12px;z-index:99999;padding:10px 12px;border-radius:10px;background:#0f172acc;color:#f8fafc;font-size:13px;line-height:1.4;";
    container.textContent = posted
      ? "Transfer complete. This window will close shortly."
      : "Could not find opener window. Please close this popup manually.";
    if (count === 0) {
      container.textContent = "No profiles found to export. Please close this popup manually.";
    }
    document.body.appendChild(container);
  }

  function postToOpener(list, targetOrigin) {
    if (!window.opener || window.opener.closed) return false;

    const payload = {
      type: MESSAGE_TYPE,
      list: list,
      items: list,
      payload: list,
      count: list.length,
      exportedAt: new Date().toISOString(),
    };

    // Send multiple times because opener listener may attach after popup opens.
    const tries = 12;
    const intervalMs = 250;
    for (let i = 0; i < tries; i += 1) {
      window.setTimeout(function sendAttempt() {
        try {
          window.opener.postMessage(payload, targetOrigin);
        } catch (_) {
          // ignore postMessage error
        }
      }, i * intervalMs);
    }

    window.setTimeout(function closeLater() {
      window.close();
    }, tries * intervalMs + 500);

    return true;
  }

  const targetOrigin = resolveTargetOrigin();
  const list = readLegacyList();
  const posted = postToOpener(list, targetOrigin);

  renderStatus(posted, list.length);
})();
