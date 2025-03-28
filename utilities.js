export function pad(num) {
  return num.toString().padStart(2, '0');
}

export function setText(id, text) {
  const elem = document.getElementById(id);
  if (elem) elem.innerText = text;
}