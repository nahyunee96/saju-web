(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const comingSoonLinks = document.querySelectorAll(
      'nav.nav a[href="/blog/saju.html"], nav.nav a[href="/blog/c_note.html"], nav.nav a[href="/blog/nh_head_inner.html"]'
    );

    comingSoonLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        alert('준비중이에요!');
      });
    });
  });
})();
