(function () {
  if (!window.matchMedia('(display-mode: standalone)').matches && !window.navigator.standalone) return;
  const body = document.body;
  const setOrientation = () => {
    if (window.innerWidth > window.innerHeight) {
      body.classList.add('standalone-portrait-lock');
    } else {
      body.classList.remove('standalone-portrait-lock');
    }
  };
  window.addEventListener('resize', setOrientation);
  window.addEventListener('orientationchange', setOrientation);
  setOrientation();
})();
