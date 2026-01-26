(() => {
  const buildLink = (text, href, disabled) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = text;
    a.href = href || "#";

    if (disabled) {
      a.classList.add("is-disabled");
      a.setAttribute("aria-disabled", "true");
      a.setAttribute("tabindex", "-1");
    }

    li.appendChild(a);
    return li;
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".link_move[data-link-move=\"true\"]").forEach(list => {
      const prevText = list.dataset.prevText || "이전글";
      const prevHref = list.dataset.prevHref || "#";
      const prevDisabled = list.dataset.prevDisabled === "true";

      const nextText = list.dataset.nextText || "다음글";
      const nextHref = list.dataset.nextHref || "#";
      const nextDisabled = list.dataset.nextDisabled === "true";

      list.innerHTML = "";
      list.appendChild(buildLink(prevText, prevHref, prevDisabled));
      list.appendChild(buildLink(nextText, nextHref, nextDisabled));
    });
  });
})();
