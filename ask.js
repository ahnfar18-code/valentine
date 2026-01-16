(() => {
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const statusText = document.getElementById('statusText');
  const row = document.getElementById('buttonRow');
  if (!yesBtn || !noBtn || !statusText || !row) return;

  let level = 0;
  const lines = [
    "No? Are you sure?",
    "My heart says try again...",
    "Okay, but the YES is getting stronger...",
    "Distance can't stop us.",
    "Last chance to be cute and click YES.",
    "I will keep asking until you smile.",
    "I love you. Click YES, baby.",
  ];

  function rand(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function moveNo(){
    const pad = 18;
    const w = window.innerWidth;
    const h = window.innerHeight;

    noBtn.style.position = 'fixed';
    noBtn.style.zIndex = '2';

    const x = rand(pad, Math.max(pad, w - noBtn.offsetWidth - pad));
    const y = rand(pad, Math.max(pad, h - noBtn.offsetHeight - pad));

    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
  }

  function growYes(){
    level += 1;
    const scale = Math.min(2.4, 1 + level * 0.18);
    yesBtn.style.transform = `scale(${scale})`;
    yesBtn.style.boxShadow = `0 18px 42px rgba(255,45,85,${Math.min(.55, .25 + level*0.05)})`;
    yesBtn.classList.add('pulse');

    statusText.textContent = lines[Math.min(lines.length - 1, level - 1)];

    // tiny heart burst
    burstHearts(yesBtn.getBoundingClientRect());
  }

  function burstHearts(rect){
    const count = 10;
    for (let i=0;i<count;i++){
      const el = document.createElement('div');
      el.textContent = '❤';
      el.style.position = 'fixed';
      el.style.left = (rect.left + rect.width/2) + 'px';
      el.style.top = (rect.top + rect.height/2) + 'px';
      el.style.fontSize = rand(14, 22) + 'px';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '3';
      el.style.opacity = '0.95';
      el.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(el);

      const dx = rand(-140, 140);
      const dy = rand(-220, -60);
      const rot = rand(-35, 35);
      const dur = rand(700, 1100);

      el.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: .95 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot}deg) scale(.9)`, opacity: 0 }
      ], { duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });

      setTimeout(() => el.remove(), dur + 60);
    }
  }

  noBtn.addEventListener('click', () => {
    growYes();
    moveNo();
  });

  // Make hovering also cheeky (desktop)
  noBtn.addEventListener('mouseenter', () => {
    if (window.matchMedia('(pointer:fine)').matches) {
      if (level < 2) growYes();
      moveNo();
    }
  });

  yesBtn.addEventListener('click', () => {
    localStorage.setItem('valentineAccepted', 'yes');
    window.location.href = 'letter.html';
  });

  // Initial micro-animation
  setTimeout(() => {
    yesBtn.classList.add('pulse');
  }, 400);
})();
