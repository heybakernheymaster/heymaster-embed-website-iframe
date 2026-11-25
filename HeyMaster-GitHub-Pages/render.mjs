/* 匯入 HTML 文字轉義工具，讓名稱和評價可以安全放進網頁 */
import { escape } from "./text.mjs";

/* 保留來源文字裡已經存在的 HTML 字元編碼 */
const safeText = value => escape(value).replace(/&amp;((?:#\d{1,7}|#x[\da-f]{1,6}|amp|quot|lt|gt|apos|nbsp);)/gi, "&$1");

/* 從 Teachify 的文章分類頁擷取學員好評 */
export function readReviews(html, categoryUrl) {
  const reviews = [];
  const seen = new Set();
  const cards = html.split(/<div\s+class="[^"]*\bpost-card\b[^"]*"/i).slice(1);

  for (const card of cards) {
    /* 讀取每則評價的文章路徑、封面、標題和學員名稱 */
    const path = card.match(/href="(\/posts\/[\w-]+)"/i)?.[1];
    const image = card.match(/https:\/\/s\.teachifycdn\.com\/image\/[^"'\s&]+\/post\/cover_photo\/[\w./-]+/i)?.[0];
    const title = card.match(/<h2\b[^>]*>[\s\S]*?<a\b[^>]*>([^<]+)<\/a>/i)?.[1]?.trim();
    const name = card.match(/<p\b[^>]*class="[^"]*subtitle[^"]*"[^>]*>([^<]+)<\/p>/i)?.[1]?.trim();

    /* 略過資料不齊的評價和重複文章 */
    if (!path || !image || !title || !name || seen.has(path)) continue;
    seen.add(path);

    /* 組出完整連結，並以 WebP 載入縮放後的封面 */
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

/* 學員好評嵌入頁的 CSS。日常改配色和間距主要看這段 */
const style = `
/* 全頁字型、文字顏色、底色和外側留白 */
*{box-sizing:border-box}
body{margin:0;color:#50443c;background:#fff;font-family:system-ui,sans-serif}
main{max-width:1320px;margin:auto;padding:12px 20px 8px}
a{color:inherit}

/* 每組的課程標題，以及標題與右上連結的對齊 */
header{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:10px}
h2{font-size:clamp(17px,2vw,22px);line-height:1.25;margin:0}

/* 右上「一起做⋯⋯」的基本排版。實際顏色看下方的配色區 */
.course-cta{display:inline-flex;align-items:center;gap:6px;color:#80501f;font-weight:700;font-size:.875rem;line-height:1.25;text-align:right;text-decoration:none}
.course-cta > span{color:#da5b4e}
.course-cta:hover{text-decoration:underline}

/* 共用箭頭圖示的大小 */
.chevron{display:block;flex:none;width:14px;height:14px}

/* 桌機每排兩組課程，以及課程組之間的空隙 */
.groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:34px;row-gap:28px}
.group{min-width:0}

/* 可左右滑動的卡片列。設定卡片寬度、間距和平滑捲動 */
.carousel{position:relative}
.track{
  display:grid;grid-auto-flow:column;grid-auto-columns:calc((100% - 12px)/2);gap:12px;
  overflow-x:auto;overflow-y:hidden;scrollbar-width:none;
  scroll-snap-type:x mandatory;scroll-behavior:smooth
}
.track::-webkit-scrollbar{display:none}

/* 好評卡和圖片的基本樣式。滿版比例與陰影看下方的配色區 */
.card{display:grid;grid-template-rows:minmax(0,1fr) auto;height:302px;overflow:hidden;border:1px solid #e9dece;border-radius:14px;background:#fff;text-decoration:none;scroll-snap-align:start}
.card img{width:100%;height:100%;object-fit:contain;background:#f4f2e6;display:block}

/* 照片下方的文字區。評價最多顯示兩行 */
.copy{min-width:0;padding:10px 13px;display:grid;gap:6px;align-content:start}
.copy p{
  min-width:0;height:2.8em;margin:0;font-size:1rem;line-height:1.4;font-weight:650;
  display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;
  overflow:hidden;overflow-wrap:anywhere
}

/* 學員名稱、人物圖示和名稱過長時的省略號 */
.reviewer{display:flex;align-items:center;min-width:0;gap:6px;font-size:.875rem;color:#716052}
.reviewer-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.reviewer-icon{
  display:grid;place-items:center;flex:none;width:20px;height:20px;border-radius:50%;
  background:#eedbac;color:#fff
}
.reviewer-icon svg{display:block;width:20px;height:20px}

/* Hashtag 的基本排版。實際灰底與留白看下方的配色區 */
.tag{
  justify-self:start;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  border-radius:20px;background:#eedbac;color:#6d5742;font-weight:700;padding:3px 9px;font-size:.8rem;line-height:1.25
}

/* 輪播左右按鈕的位置、陰影和滑鼠移入效果 */
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

/* 輪播下方的進度條底色與滑塊 */
.scroll-indicator{
  position:relative;height:5px;margin:8px 0 0;overflow:hidden;
  border-radius:99px;background:rgba(113,89,75,.09)
}
.scroll-indicator span{
  position:absolute;top:0;bottom:0;border-radius:inherit;background:rgba(113,89,75,.33)
}
.carousel:not([data-scrollable]) + .scroll-indicator{visibility:hidden}

/* 用鍵盤操作時，標示目前選到的連結或按鈕 */
:focus-visible{outline:2px solid #815020;outline-offset:-2px}

/* 窄螢幕排成一欄，顯示前兩組課程，並調整卡片與箭頭位置 */
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

/* 尊重系統的減少動態效果設定 */
@media(prefers-reduced-motion:reduce){.track{scroll-behavior:auto}}

/* 目前使用的外觀。以下同名規則會覆蓋上方的基本樣式 */

/* 右上「一起做⋯⋯」字級 */
.course-cta{color:#da5b4e;font-size:1rem}

/* 照片維持 1:1 滿版，卡片高度跟著照片和內容伸縮 */
.card{height:auto;grid-template-rows:auto 1fr}
.card img{height:auto;aspect-ratio:1 / 1;object-fit:cover}

/* 學員好評區的白底，以及大標題的深咖啡色和字距 */
body { background: #fff; }
.group h2 { color: #50443c; letter-spacing: 0.01em; }

/* Hashtag 灰底、一般字重，以及與心得內文的距離 */
.tag {
  background: #edf0f3;
  color: #565656;
  font-weight: 400;
  padding: 6px 12px;
  line-height: 1.4;
  margin-top: 5px;
}

/* 只改 hashtag 裡的井字號顏色 */
.tag-hash { color: #835e4b; }

/* 右上「一起做」文字與箭頭顏色。換色只改這裡 */
.course-cta,
.course-cta > span {
  color: #8b5c46;
}

/* 好評卡去除外框，改用淡陰影 */
.card {
  border: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .08);
}

/* 輪播邊緣留出陰影空間，維持滑動時卡片的對齊 */
.track {
  margin: -6px -8px -6px;
  padding: 6px 8px 14px;
  scroll-padding-inline: 8px;
}
`;

/* 共用 SVG 箭頭會跟著外層的文字顏色變色 */
const chevron = '<svg class="chevron" viewBox="0 0 16 16" aria-hidden="true" fill="none"><path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* 學員名稱旁的人物圖示 */
const reviewerIcon = '<span class="reviewer-icon" aria-hidden="true"><svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="7.25" r="3.2"/><path d="M7.5 10.65a4.35 4.35 0 0 0 5 0c1.9.9 3.3 2.9 3.3 4.4 0 .6-.45.9-1.15.9h-9.3c-.7 0-1.15-.3-1.15-.9 0-1.5 1.4-3.5 3.3-4.4z"/></svg></span>';

/* 產生一組課程的標題、課程連結和好評輪播 */
function group(reviews, course, workTitles) {
  const label = escape(course.name);
  const heading = `<header><h2>${label}</h2><a class="course-cta" href="${escape(course.courseUrl)}" target="_blank" rel="noopener"><span>${escape(course.buttonText)}</span>${chevron}</a></header>`;

  /* 缺少心得時，提供可前往的文章列表連結 */
  if (!reviews.length) return `<section class="group">${heading}<p>暫時無法載入心得。<a href="${escape(course.categoryUrl)}" target="_blank" rel="noopener">查看原文列表</a></p></section>`;

  return `<section class="group" aria-label="${label}">
    ${heading}<div class="carousel"><div class="track" tabindex="0">
    ${reviews.map(r => {
      /* 以文章路徑對應 hashtag 的品項，並統一「學員」後的空格 */
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

/* 把所有課程組、CSS 和輪播操作程式組成完整網頁 */
export function render(reviews, settings) {
  return `<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>學員好評｜HeyMaster</title><style>${style}</style>
  <main><div class="groups">${settings.courses.map((course, index) => group(reviews[index], course, settings.coverWorks)).join("")}</div>
  </main><script>
  /* 每組好評各自控制自己的左右按鈕和進度條 */
 /* 右側往下滑提示。短線自行由上往下循環 */
const reviewScrollCue = document.createElement('div');
const reviewScrollMark = document.createElement('div');

reviewScrollCue.setAttribute('aria-hidden', 'true');
reviewScrollCue.style.cssText =
  'position:fixed;top:33%;right:clamp(3px,calc((100% - 1320px)/2 + 3px),44px);' +
  'width:2px;height:60px;border-radius:99px;background:#e4dbd5;' +
  'pointer-events:none;z-index:10';

reviewScrollMark.style.cssText =
  'position:absolute;top:0;left:50%;width:3px;height:18px;' +
  'border-radius:99px;background:#835e4b;transform:translateX(-50%)';

reviewScrollCue.append(reviewScrollMark);
document.body.append(reviewScrollCue);

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  reviewScrollMark.animate([
    { transform: 'translate(-50%, 0)', opacity: 0, offset: 0 },
    { transform: 'translate(-50%, 0)', opacity: 1, offset: .10 },
    { transform: 'translate(-50%, 0)', opacity: 1, offset: .30, easing: 'ease-in-out' },
    { transform: 'translate(-50%, 42px)', opacity: 1, offset: .86 },
    { transform: 'translate(-50%, 42px)', opacity: 0, offset: .96 },
    { transform: 'translate(-50%, 42px)', opacity: 0, offset: 1 }
  ], { duration: 1500, iterations: Infinity });
}
  for (const carousel of document.querySelectorAll('.carousel')) {
    const track = carousel.querySelector('.track');
    const [prev, next] = carousel.querySelectorAll('button');
    const indicator = carousel.nextElementSibling.firstElementChild;

    /* 依捲動位置更新按鈕能否點擊，以及進度條的大小和位置 */
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

    /* 點箭頭時移動一張卡片的寬度，再加上卡片間距 */
    for (const button of [prev, next]) {
      button.addEventListener('click', () => {
        const gap = parseFloat(getComputedStyle(track).columnGap);
        const step = track.firstElementChild.getBoundingClientRect().width + gap;
        track.scrollBy({left: Number(button.dataset.dir) * step});
      });
    }

    /* 滑動或縮放視窗後，重新對齊進度條與按鈕狀態 */
    track.addEventListener('scroll', update, {passive:true});
    new ResizeObserver(update).observe(track);
    update();
  }
  </script></html>`;
}
