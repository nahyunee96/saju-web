(() => {
  document.addEventListener('DOMContentLoaded', () => {

    fetch("/inc/header.html")
      .then(res => res.text())
      .then(html => document.getElementById("header").innerHTML = html);

    fetch("/inc/footer.html")
      .then(res => res.text())
      .then(html => document.getElementById("footer").innerHTML = html);

    const noteSource = document.getElementById("note-source");
    if (noteSource) {
      fetch("/inc/note-source.html")
        .then(res => res.text())
        .then(html => noteSource.innerHTML = html);
    }

    const noteNotice = document.getElementById("note-notice");
    if (noteNotice) {
      fetch("/inc/note-notice.html")
        .then(res => res.text())
        .then(html => noteNotice.innerHTML = html);
    }

  });
})();
