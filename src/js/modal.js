// modal.js

// 인포모달 세팅
export function setupInfoModal() {
  const modal       = document.getElementById('infoModal5');
  const hideForever = document.getElementById('lognTimeX');
  const closeBtn    = document.getElementById('closeX');

  if (!modal || !hideForever || !closeBtn) return;
  const hidden = localStorage.getItem('infoModalHidden5');
  modal.style.display = hidden === 'true' ? 'none' : 'block';
  modal.style.zIndex  = hidden === 'true' ? -1 : 1005;

  hideForever.addEventListener('click', () => {
    localStorage.setItem('infoModalHidden5', 'true');
    modal.style.display = 'none';
    modal.style.zIndex = -1;
  });
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    modal.style.zIndex = -1;
  });
}

// --- 4. 설정 모달 show/hide 바인딩 ---
export function setupSettingModal() {
  const setBtn      = document.getElementById('setBtn');
  const setModal    = document.getElementById('setModal');
  const setcloseBtn = setModal ? setModal.querySelector('.close_btn') : null;
  if (!setBtn || !setModal || !setcloseBtn) return;
  setBtn.addEventListener('click', () => {
    setModal.style.display = 'block';
  });
  setcloseBtn.addEventListener('click', () => {
    setModal.style.display = 'none';
  });
}