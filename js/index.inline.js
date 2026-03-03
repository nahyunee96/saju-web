﻿(() => {
  function pushAdsSafe() {
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log(e);
    }
  }

  function pushAllAds() {
    const adCount = document.querySelectorAll('ins.adsbygoogle').length;
    for (let i = 0; i < adCount; i += 1) {
      pushAdsSafe();
    }
  }

  window.clearAllMyoStorage = function clearAllMyoStorage() {
    if (confirm('모든 저장된 명식을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.\n또한 모든 설정이 초기화 됩니다.')) {
      localStorage.clear();
      alert('모든 로컬 스토리지 데이터가 삭제되었습니다. 페이지를 새로고침합니다.');
      location.reload();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const setBtn = document.getElementById('setBtn');
    const setModal = document.getElementById('setModal');
    const setcloseBtn = setModal ? setModal.querySelector('.close_btn') : null;

    if (setBtn && setModal && setcloseBtn) {
      setBtn.addEventListener('click', () => {
        setModal.style.display = 'block';
      });

      setcloseBtn.addEventListener('click', () => {
        setModal.style.display = 'none';
      });
    }

    const jijangganCheckbox = document.getElementById('jijangganDisplay');
    const hanguelCheckbox = document.getElementById('hanguelDisplay');
    const body = document.body;

    if (jijangganCheckbox && hanguelCheckbox) {
      const jijangganSuffixes = ['Jj1', 'Jj2'];
      const hanguelSuffix = 'Hanguel';
      const jijangganKey = 'showJijanggan';
      const hanguelKey = 'showHanguel';

      function toggleBySuffix(suffixes, show) {
        suffixes.forEach(suffix => {
          document.querySelectorAll(`[id$="${suffix}"]`).forEach(el => {
            el.style.display = show ? 'block' : 'none';
          });
        });
      }

      const savedJjState = localStorage.getItem(jijangganKey);
      const jjShouldShow = savedJjState === null ? true : savedJjState === 'true';
      jijangganCheckbox.checked = jjShouldShow;
      toggleBySuffix(jijangganSuffixes, jjShouldShow);

      const savedHgState = localStorage.getItem(hanguelKey);
      const hgShouldShow = savedHgState === null ? true : savedHgState === 'true';
      hanguelCheckbox.checked = hgShouldShow;
      toggleBySuffix([hanguelSuffix], hgShouldShow);
      if (!hgShouldShow) {
        body.classList.add('no_hanguel');
      }

      jijangganCheckbox.addEventListener('change', () => {
        const isChecked = jijangganCheckbox.checked;
        toggleBySuffix(jijangganSuffixes, isChecked);
        localStorage.setItem(jijangganKey, isChecked.toString());
      });

      hanguelCheckbox.addEventListener('change', () => {
        const isChecked = hanguelCheckbox.checked;
        toggleBySuffix([hanguelSuffix], isChecked);
        localStorage.setItem(hanguelKey, isChecked.toString());

        if (isChecked) {
          body.classList.remove('no_hanguel');
        } else {
          body.classList.add('no_hanguel');
        }
      });
    }

    const eumyangCheckbox = document.getElementById('eumyangDisplay');
    const eumyangElems = document.querySelectorAll('.eum_yang');
    if (eumyangCheckbox) {
      const saved = localStorage.getItem('eumyangDisplay');
      if (saved !== null) {
        eumyangCheckbox.checked = saved === 'true';
      }

      function toggleEumYang() {
        eumyangElems.forEach(el => {
          el.style.display = eumyangCheckbox.checked ? '' : 'none';
        });
      }

      toggleEumYang();

      eumyangCheckbox.addEventListener('change', () => {
        localStorage.setItem('eumyangDisplay', eumyangCheckbox.checked);
        toggleEumYang();
      });
    }

    const wolwoonCheckbox = document.getElementById('wolwoonDisplay');
    const targetBox = document.getElementById('wongookLM');
    const wolwoonBox = document.querySelector('.lucky.wolwoon');
    const wolwoonKey = 'showWolwoon';

    if (wolwoonCheckbox && targetBox) {
      function toggleWolwoonDisplay(show) {
        if (show) {
          targetBox.classList.remove('no_wolwoon');
          if (wolwoonBox) wolwoonBox.style.display = 'block';
        } else {
          targetBox.classList.add('no_wolwoon');
          if (wolwoonBox) wolwoonBox.style.display = 'none';
        }
      }

      const saved = localStorage.getItem(wolwoonKey);
      const shouldShow = saved === null ? true : saved === 'true';
      wolwoonCheckbox.checked = shouldShow;
      toggleWolwoonDisplay(shouldShow);

      wolwoonCheckbox.addEventListener('change', () => {
        const show = wolwoonCheckbox.checked;
        localStorage.setItem(wolwoonKey, show);
        toggleWolwoonDisplay(show);
      });
    }

    const ganzhiWhiteCheckbox = document.getElementById('ganzhiWhiteDisplay');
    const ganzhiWhiteKey = 'ganzhiWhiteDisplay';
    if (ganzhiWhiteCheckbox) {
      const saved = localStorage.getItem(ganzhiWhiteKey);
      const shouldEnable = saved === 'true';
      ganzhiWhiteCheckbox.checked = shouldEnable;
      if (shouldEnable) {
        body.classList.add('ganzhi_white');
      }

      ganzhiWhiteCheckbox.addEventListener('change', () => {
        const enable = ganzhiWhiteCheckbox.checked;
        localStorage.setItem(ganzhiWhiteKey, enable);
        if (enable) {
          body.classList.add('ganzhi_white');
        } else {
          body.classList.remove('ganzhi_white');
        }
      });
    }

    const noticeModal = document.getElementById('noticeModal');
    if (noticeModal) {
      const noticeTitle = noticeModal.querySelector('.notice-modal-content h4');
      const noticeBody = noticeModal.querySelector('.notice-modal-content p');

      if (noticeTitle) {
        noticeTitle.textContent = '[공지사항]';
      }
      if (noticeBody) {
        const host = window.location.host || 'myowoon96.com';
        noticeBody.innerHTML =
          '이 홈페이지는 도메인(홈페이지 주소) 만료로 3월 14일에 종료될 예정입니다.<br>' +
          '리뉴얼된 홈페이지로 운영되며, <a href="https://hwarim.me/" target="_blank" rel="noopener noreferrer">https://hwarim.me/</a> ' +
          '리뉴얼된 홈페이지 주소로 접속하셔서 명식 이관 버튼을 누르시면 그대로 이관됩니다. ' +
          '(기존에 접속하셨던 브라우저[크롬, 엣지 등]로 접속하셔야 합니다.) ' +
          '새 사이트는 로그인 기능이 있으며, 가급적 로그인을 하시고 이용 하시기를 권장합니다.';
      }

      const closeTodayBtn = document.getElementById('noticeCloseToday');
      const closeForeverBtn = document.getElementById('noticeCloseForever');
      
      const NOTICE_DISMISS_VERSION = '2026-03-03-v2';
      const NOTICE_VERSION_KEY = 'noticeDismissVersion';

      // Force-reset previous dismiss history once for this notice revision.
      if (localStorage.getItem(NOTICE_VERSION_KEY) !== NOTICE_DISMISS_VERSION) {
        localStorage.removeItem('noticeHideDate');
        localStorage.removeItem('noticeHideForever');
        localStorage.setItem(NOTICE_VERSION_KEY, NOTICE_DISMISS_VERSION);
      }

      const hideDateKey = `noticeHideDate:${NOTICE_DISMISS_VERSION}`;
      const hideForeverKey = `noticeHideForever:${NOTICE_DISMISS_VERSION}`;
      const todayStr = new Date().toISOString().split('T')[0];
      const hideDate = localStorage.getItem(hideDateKey);
      const hideForever = localStorage.getItem(hideForeverKey);

      // '더 이상 보지 않기'가 아니고, '오늘 하루 보지 않기' 날짜가 오늘이 아니면 표시
      if (hideForever !== 'true' && hideDate !== todayStr) {
        noticeModal.style.display = 'flex';
      }

      if (closeTodayBtn) {
        closeTodayBtn.addEventListener('click', () => {
          localStorage.setItem(hideDateKey, todayStr);
          noticeModal.style.display = 'none';
        });
      }

      if (closeForeverBtn) {
        closeForeverBtn.addEventListener('click', () => {
          localStorage.setItem(hideForeverKey, 'true');
          noticeModal.style.display = 'none';
        });
      }
    }

    pushAllAds();
  });

  window.addEventListener('load', () => {
    setTimeout(() => {
      pushAllAds();
    }, 800);
  });
})();

(() => {
  const TIMEOUT_MS = 3 * 60 * 60 * 1000; // 1시간

  const now = Date.now();
  const lastVisit = localStorage.getItem('lastVisitTime');

  if (lastVisit) {
    const diff = now - Number(lastVisit);
    if (diff > TIMEOUT_MS) {
      location.reload();
    }
  }
  localStorage.setItem('lastVisitTime', now);

  setTimeout(() => location.reload(), TIMEOUT_MS);

  let hiddenTime = Date.now();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      hiddenTime = Date.now();
    } else if (document.visibilityState === 'visible') {
      const nowTime = Date.now();
      if (nowTime - hiddenTime > TIMEOUT_MS) {
        location.reload();
      }
    }
  });
})();
