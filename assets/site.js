// Hlavička: průhledná nad hero, plná po odscrollování
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('solid', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobilní menu
const menuBtn = document.querySelector('.menu-btn');
menuBtn?.addEventListener('click', () => {
  const open = header.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});

// Lightbox pro galerie
const links = [...document.querySelectorAll('.gallery a')];
if (links.length) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = '<img alt=""><button class="lb-close" aria-label="Zavřít">×</button><button class="lb-prev" aria-label="Předchozí">‹</button><button class="lb-next" aria-label="Další">›</button>';
  document.body.append(lb);
  const img = lb.querySelector('img');
  let i = 0;
  const show = (n) => {
    i = (n + links.length) % links.length;
    img.src = links[i].href;
    img.alt = links[i].querySelector('img').alt;
    lb.classList.add('on');
  };
  const close = () => lb.classList.remove('on');
  links.forEach((a, n) => a.addEventListener('click', (e) => { e.preventDefault(); show(n); }));
  lb.querySelector('.lb-close').onclick = close;
  lb.querySelector('.lb-prev').onclick = () => show(i - 1);
  lb.querySelector('.lb-next').onclick = () => show(i + 1);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
}

// Poptávkový formulář.
// Dočasně: složí e-mail z vyplněných polí a otevře poštovního klienta.
// Po nasazení na Wix se nahradí odesláním do Wix Forms.
document.querySelectorAll('form.inquiry').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [];
    for (const [key, value] of data) {
      if (!value) continue;
      const label = form.querySelector(`[name="${key}"]`)?.dataset.label || key;
      lines.push(`${label}: ${value}`);
    }
    const subject = `Poptávka: ${data.get('typ') || 'focení'} – ${data.get('jmeno') || ''}`;
    window.location.href = `mailto:klekar.kam95@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    const status = form.querySelector('.form-status');
    if (status) status.textContent = 'Děkuji, poptávka je připravená v e-mailu. Stačí ji odeslat a brzy se vám ozvu.';
  });
});

// Předvolení typu focení přes odkaz kontakt.html?typ=...
const typ = new URLSearchParams(location.search).get('typ');
if (typ) {
  const radio = document.querySelector(`input[name="typ"][value="${typ}"]`);
  if (radio) radio.checked = true;
}
