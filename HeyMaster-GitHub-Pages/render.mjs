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
main{max-width:1320px;margin:auto;padding:12px 16px 8px}
header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
h2{font-size:clamp(17px,2vw,22px);margin:0}
a{color:inherit}
.course-cta{display:inline-flex;align-items:center;gap:7px;color:#80501f;font-weight:700;font-size:.875rem;text-decoration:none}
.course-cta:hover{text-decoration:underline}
.cta-arrow{position:relative;display:block;flex:none;width:12px;height:14px}
.cta-arrow::before,.cta-arrow::after{content:"";position:absolute}
.cta-arrow::before{top:2px;left:5.5px;height:9px;border-left:1px solid currentColor}
.cta-arrow::after{top:5px;left:3px;width:5px;height:5px;border:solid currentColor;border-width:0 1px 1px 0;transform:rotate(45deg)}
.groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}
.group{min-width:0}
.track{display:grid;grid-auto-flow:column;grid-auto-columns:calc((100% - 12px)/2);gap:12px;overflow:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth}
.card{display:grid;grid-template-rows:minmax(0,3fr) minmax(0,2fr);height:302px;overflow:hidden;border:1px solid #e9dece;border-radius:14px;background:#fff;text-decoration:none;scroll-snap-align:start}
.card img{width:100%;height:100%;object-fit:contain;background:#f3ebdf;display:block}
.copy{padding:11px 13px;display:flex;flex-direction:column;justify-content:space-between;gap:5px;min-height:0}
.copy p{margin:0;font-size:1rem;line-height:1.4;font-weight:650;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
.reviewer{display:flex;align-items:center;gap:6px;font-size:.875rem;color:#716052}
.reviewer-icon{position:relative;flex:none;width:20px;height:20px;border-radius:50%;background:#f5e9d2;color:#866337}
.reviewer-icon::before,.reviewer-icon::after{content:"";box-sizing:border-box;position:absolute;left:50%;transform:translateX(-50%);border:1px solid currentColor}
.reviewer-icon::before{top:3px;width:6px;height:6px;border-radius:50%}
.reviewer-icon::after{bottom:3px;width:10px;height:6px;border-radius:6px 6px 2px 2px}
.tag{align-self:flex-start;border-radius:20px;background:#f5eee4;color:#714d2d;padding:3px 9px;font-size:.8rem}
.track{overflow-y:hidden;scrollbar-width:none}
.track::-webkit-scrollbar{display:none}
nav{display:flex;justify-content:end;gap:8px;margin-top:5px}
button{width:32px;height:32px;border:1px solid #dccdb8;border-radius:50%;background:#fff;color:#654822;font-size:22px;cursor:pointer}
button:disabled{opacity:.35;cursor:default}
:focus-visible{outline:2px solid #815020;outline-offset:-2px}
@media(max-width:720px){main{padding:9px 12px}.groups{grid-template-columns:1fr;gap:10px}.track{grid-auto-columns:76%}.card{height:235px;grid-template-rows:minmax(0, 1.2fr) minmax(0,1fr)}.copy{padding:7px 10px}.copy p{-webkit-line-clamp:2}}
@media (min-width: 721px) {
  .groups {
    row-gap: 28px;
  }
}

@media (max-width: 720px) {
  .groups > .group:nth-child(n+3) {
    display: none;
  }
}
@media(prefers-reduced-motion:reduce){.track{scroll-behavior:auto}}
`;

function group(reviews, course, workTitles) {
  const label = escape(course.name);
  const heading = `<header><h2>${label}</h2><a class="course-cta" href="${escape(course.courseUrl)}" target="_blank" rel="noopener">${escape(course.buttonText)}<span class="cta-arrow" aria-hidden="true"></span></a></header>`;
  if (!reviews.length) return `<section class="group">${heading}<p>暫時無法載入心得。<a href="${escape(course.categoryUrl)}" target="_blank" rel="noopener">查看原文列表</a></p></section>`;
  return `<section class="group" aria-label="${label}">${heading}<div class="track" tabindex="0">
    ${reviews.map(r => {
      const work = workTitles[new URL(r.url).pathname];
      return `<a class="card" href="${escape(r.url)}" target="_blank" rel="noopener"><img src="${escape(r.image)}" alt="" decoding="async"><div class="copy"><small class="reviewer"><span class="reviewer-icon" aria-hidden="true"></span>${safeText(r.name)}</small><p>${safeText(r.title)}</p><span class="tag"># ${work ? escape(work) : label}</span></div></a>`;
    }).join("")}
    </div><nav aria-label="${label}切換"><button type="button" data-dir="-1" aria-label="上一張">‹</button><button type="button" data-dir="1" aria-label="下一張">›</button></nav></section>`;
}

export function render(reviews, settings) {
  return `<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>學員好評｜HeyMaster</title><style>${style}</style>
  <main><div class="groups">${settings.courses.map((course, index) => group(reviews[index], course, settings.coverWorks)).join("")}</div>
  </main><script>
  for (const group of document.querySelectorAll('.group')) {
    const track = group.querySelector('.track');
    if (!track) continue;
    const [prev, next] = group.querySelectorAll('button');
    const update = () => {
      prev.disabled = track.scrollLeft < 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    for (const button of [prev, next]) {
      button.addEventListener('click', () => {
        const step = track.firstElementChild.getBoundingClientRect().width + 12;
        track.scrollBy({left: Number(button.dataset.dir) * step});
      });
    }
    track.addEventListener('scroll', update, {passive:true});
    new ResizeObserver(update).observe(track);
    update();
  }
  </script></html>`;
}

