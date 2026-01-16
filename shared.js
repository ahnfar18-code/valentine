/* Shared background: floating hearts + soft sparkles (canvas) */
(() => {
  const canvas = document.getElementById('bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const hearts = [];
  const sparkles = [];

  function resize(){
    canvas.width = Math.floor(window.innerWidth * DPR);
    canvas.height = Math.floor(window.innerHeight * DPR);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(min,max){return Math.random()*(max-min)+min;}

  function heartPath(x,y,size){
    const s = size;
    ctx.beginPath();
    ctx.moveTo(x, y + s*0.25);
    ctx.bezierCurveTo(x, y, x - s*0.5, y, x - s*0.5, y + s*0.25);
    ctx.bezierCurveTo(x - s*0.5, y + s*0.6, x, y + s*0.75, x, y + s);
    ctx.bezierCurveTo(x, y + s*0.75, x + s*0.5, y + s*0.6, x + s*0.5, y + s*0.25);
    ctx.bezierCurveTo(x + s*0.5, y, x, y, x, y + s*0.25);
    ctx.closePath();
  }

  function spawn(){
    if (hearts.length < 40 && Math.random() < 0.65){
      hearts.push({
        x: rand(0, canvas.width),
        y: canvas.height + rand(20, 200),
        vy: rand(0.25, 0.95) * DPR,
        vx: rand(-0.35, 0.35) * DPR,
        size: rand(10, 24) * DPR,
        a: rand(0.08, 0.18),
        w: rand(0, Math.PI*2),
        hue: rand(330, 360)
      });
    }
    if (sparkles.length < 120 && Math.random() < 0.9){
      sparkles.push({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        r: rand(0.5, 1.4) * DPR,
        a: rand(0.04, 0.11),
        tw: rand(0, Math.PI*2)
      });
    }
  }

  function tick(){
    spawn();
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // sparkles
    for (let i = sparkles.length-1; i >= 0; i--){
      const p = sparkles[i];
      p.tw += 0.02;
      const alpha = p.a * (0.65 + 0.35*Math.sin(p.tw));
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
      if (Math.random() < 0.004) sparkles.splice(i,1);
    }

    // hearts
    for (let i = hearts.length-1; i >= 0; i--){
      const h = hearts[i];
      h.w += 0.015;
      h.x += (h.vx + Math.sin(h.w)*0.15*DPR);
      h.y -= h.vy;

      const grad = ctx.createLinearGradient(h.x, h.y, h.x, h.y + h.size);
      grad.addColorStop(0, `hsla(${h.hue}, 90%, 65%, ${h.a})`);
      grad.addColorStop(1, `hsla(${h.hue-15}, 95%, 55%, ${h.a})`);
      ctx.fillStyle = grad;
      heartPath(h.x, h.y, h.size);
      ctx.fill();

      if (h.y + h.size < -80 || h.x < -120 || h.x > canvas.width + 120) hearts.splice(i,1);
    }

    requestAnimationFrame(tick);
  }

  // start
  requestAnimationFrame(tick);
})();
