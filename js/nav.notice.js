(() => {
  document.addEventListener('DOMContentLoaded', () => {

    fetch("/inc/header.html")
      .then(res => res.text())
      .then(html => document.getElementById("header").innerHTML = html);

    fetch("/inc/footer.html")
      .then(res => res.text())
      .then(html => document.getElementById("footer").innerHTML = html);

  });
})();
