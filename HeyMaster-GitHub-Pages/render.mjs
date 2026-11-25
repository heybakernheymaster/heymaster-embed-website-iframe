import { escape } from "./text.mjs";

const safeText = value => escape(value).replace(/&amp;((?:#\d{1,7}|#x[\da-f]{1,6}|amp|quot|lt|gt|apos|nbsp);)/gi, "&$1");

export function readReviews(html, categoryUrl) {
  const reviews = [];
  const seen = new Set();
  const cards = html.split(/<div\s+class="[^"]*\bpost-card\b[^"]*"/i).slice(1);
  for (const card of cards) {
    const path = card.match(/href="(\/posts\/[\w-]+)"/i)?.[1];
    const image = card.match(/https:\/\/s\.teachifycdn\.com\/image\/[^"'\s&]+\/post\/cover_photo\/[\w./-]+/i)?.[0];
    const title = card.match(/<h2\b[^>]*>[\s\S]*?<a\b[^>]*>([^<]+)<\/a>/i)?.[1]?.trim();
    const name = card.match(/<p\b[^>]*class="[^"]*subtitle[^"]*"[^>]*>([^<]+)<\/p>/i)?.[1]?.trim();
    if (!path || !image || !title || !name || seen.has(path)) continue;
    seen.add(path);
    reviews.push({
      url: new URL(path, categoryUrl).href,
      image: image.replace(/\/image\/[^/]+\//, "/image/width=768,quality=82,format=webp/"),
      title,
      name,
    });
    if (reviews.length === 8) break;
  }
  return reviews;
}

const style = `
*{box-sizing:border-box}
body{margin:0;color:#50443c;background:#fff;font-family:system-ui,sans-serif}
main{max-width:1320px;margin:auto;padding:12px 20px 8px}
header{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:10px}
h2{font-size:clamp(17px,2vw,22px);line-height:1.25;margin:0}
a{color:inherit}
.course-cta{display:inline-flex;align-items:center;gap:6px;color:#80501f;font-weight:700;font-size:.875rem;line-height:1.25;text-align:right;text-decoration:none}
.course-cta > span{color:#da5b4e}
.course-cta:hover{text-decoration:underline}
.chevron{display:block;flex:none;width:14px;height:14px}
.groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:34px;row-gap:28px}
.group{min-width:0}
.carousel{position:relative}
.track{
  display:grid;grid-auto-flow:column;grid-auto-columns:calc((100% - 12px)/2);gap:12px;
  overflow-x:auto;overflow-y:hidden;scrollbar-width:none;
  scroll-snap-type:x mandatory;scroll-behavior:smooth
}
.track::-webkit-scrollbar{display:none}
.card{display:grid;grid-template-rows:minmax(0,1fr) auto;height:302px;overflow:hidden;border:1px solid #e9dece;border-radius:14px;background:#fff;text-decoration:none;scroll-snap-align:start}
.card img{width:100%;height:100%;object-fit:contain;background:#f4f2e6;display:block}
.copy{min-width:0;padding:10px 13px;display:grid;gap:6px;align-content:start}
.copy p{
  min-width:0;height:2.8em;margin:0;font-size:1rem;line-height:1.4;font-weight:650;
  display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;
  overflow:hidden;overflow-wrap:anywhere
}
.reviewer{display:flex;align-items:center;min-width:0;gap:6px;font-size:.875rem;color:#716052}
.reviewer-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.reviewer-icon{
  display:grid;place-items:center;flex:none;width:20px;height:20px;border-radius:50%;
  background:#eedbac;color:#fff
}
.reviewer-icon svg{display:block;width:20px;height:20px}
.tag{
  justify-self:start;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  border-radius:20px;background:#eedbac;color:#6d5742;font-weight:700;padding:3px 9px;font-size:.8rem;line-height:1.25
}
.side-button{
  position:absolute;top:50%;transform:translateY(-50%);z-index:1;
  display:grid;place-items:center;width:36px;height:36px;padding:0;
  border:1px solid #e9dece;border-radius:50%;background:rgba(255,255,255,.96);
  color:#654822;box-shadow:0 2px 8px rgba(80,68,60,.12);cursor:pointer
}
.side-button:hover:not(:disabled){background:#f9f2e9}
.side-button:disabled{opacity:.6;color:#8c8075;cursor:default}
.side-button[data-dir="-1"]{left:-15px}
.side-button[data-dir="1"]{right:-15px}
.side-button[data-dir="-1"] .chevron{transform:rotate(90deg)}
.side-button[data-dir="1"] .chevron{transform:rotate(-90deg)}
.carousel:not([data-scrollable]) .side-button{visibility:hidden}
.scroll-indicator{
  position:relative;height:5px;margin:8px 0 0;overflow:hidden;
  border-radius:99px;background:rgba(113,89,75,.09)
}
.scroll-indicator span{
  position:absolute;top:0;bottom:0;border-radius:inherit;background:rgba(113,89,75,.33)
}
.carousel:not([data-scrollable]) + .scroll-indicator{visibility:hidden}
:focus-visible{outline:2px solid #815020;outline-offset:-2px}
@media (max-width: 720px) {
  main{padding:9px 16px 8px}
  .groups{grid-template-columns:1fr;gap:15px}
  .groups > .group:nth-child(n+3){display:none}
  .track{grid-auto-columns:76%}
  .card{height:235px}
  .copy{padding:7px 10px}
  .side-button[data-dir="-1"]{left:-11px}
  .side-button[data-dir="1"]{right:-11px}
}
@media(prefers-reduced-motion:reduce){.track{scroll-behavior:auto}}
.course-cta{color:#da5b4e;font-size:1rem}
.card{height:auto;grid-template-rows:auto 1fr}
.card img{height:auto;aspect-ratio:1 / 1;object-fit:cover}
body { background: #fff; }
.group h2 { color: #50443c; letter-spacing: 0.01em; }
.tag {
  background: #edf0f3;
  color: #565656;
  font-weight: 400;
  padding: 6px 12px;
  line-height: 1.4;
  margin-top: 5px;
}
.tag-hash { color: #835e4b; }
.course-cta,
.course-cta > span {
  color: #e9c981;
}

.card {
  border: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .08);
}

.track {
  margin: -6px -8px -6px;
  padding: 6px 8px 14px;
  scroll-padding-inline: 8px;
}
`;

const chevron = '<svg class="chevron" viewBox="0 0 16 16" aria-hidden="true" fill="none"><path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const reviewerIcon = '<span class="reviewer-icon" aria-hidden="true"><svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="7.25" r="3.2"/><path d="M7.5 10.65a4.35 4.35 0 0 0 5 0c1.9.9 3.3 2.9 3.3 4.4 0 .6-.45.9-1.15.9h-9.3c-.7 0-1.15-.3-1.15-.9 0-1.5 1.4-3.5 3.3-4.4z"/></svg></span>';

function group(reviews, course, workTitles) {
  const label = escape(course.name);
  const heading = `<header><h2>${label}</h2><a class="course-cta" href="${escape(course.courseUrl)}" target="_blank" rel="noopener"><span>${escape(course.buttonText)}</span>${chevron}</a></header>`;
  if (!reviews.length) return `<section class="group">${heading}<p>暫時無法載入心得。<a href="${escape(course.categoryUrl)}" target="_blank" rel="noopener">查看原文列表</a></p></section>`;
  return `<section class="group" aria-label="${label}">
    ${heading}<div class="carousel"><div class="track" tabindex="0">
    ${reviews.map(r => {
      const work = workTitles[new URL(r.url).pathname];
      const studentName = r.name.replace(/^學員(?:\s|&nbsp;|&#0*160;|&#x0*a0;)*/i, "");
      return `<a class="card" href="${escape(r.url)}" target="_blank" rel="noopener"><img src="${escape(r.image)}" alt="" decoding="async"><div class="copy"><small class="reviewer">${reviewerIcon}<span class="reviewer-name">學員 ${safeText(studentName)}</span></small><p>${safeText(r.title)}</p><span class="tag"><span class="tag-hash">#</span> ${work ? escape(work) : label}</span></div></a>`;
    }).join("")}
    </div>
    <button class="side-button" type="button" data-dir="-1" aria-label="${label}，上一張">${chevron}</button>
    <button class="side-button" type="button" data-dir="1" aria-label="${label}，下一張">${chevron}</button>
    </div><div class="scroll-indicator" aria-hidden="true"><span></span></div>
  </section>`;
}

export function render(reviews, settings) {
  return `<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>學員好評｜HeyMaster</title><style>${style}</style>
  <main><div class="groups">${settings.courses.map((course, index) => group(reviews[index], course, settings.coverWorks)).join("")}</div>
  </main><script>
  for (const carousel of document.querySelectorAll('.carousel')) {
    const track = carousel.querySelector('.track');
    const [prev, next] = carousel.querySelectorAll('button');
    const indicator = carousel.nextElementSibling.firstElementChild;
    const update = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const position = Math.min(maxScroll, Math.max(0, track.scrollLeft));
      const hasOverflow = maxScroll > 1;
      carousel.toggleAttribute('data-scrollable', hasOverflow);
      prev.disabled = !hasOverflow || position < 2;
      next.disabled = !hasOverflow || maxScroll - position < 2;
      if (hasOverflow) {
        indicator.style.width = (track.clientWidth / track.scrollWidth * 100) + '%';
        indicator.style.left = (position / track.scrollWidth * 100) + '%';
      }
    };
    for (const button of [prev, next]) {
      button.addEventListener('click', () => {
        const gap = parseFloat(getComputedStyle(track).columnGap);
        const step = track.firstElementChild.getBoundingClientRect().width + gap;
        track.scrollBy({left: Number(button.dataset.dir) * step});
      });
    }
    track.addEventListener('scroll', update, {passive:true});
    new ResizeObserver(update).observe(track);
    update();
  }
  </script></html>`;
}
