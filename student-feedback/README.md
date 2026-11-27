# HeyMaster 學員好評

在 GitHub 開啟 `reviews-settings.json`，按鉛筆圖示編輯並提交到 `main`。

- `courses` 依序是左欄和右欄。每組可改 `name`（課程標題）、`categoryUrl`（文章分類網址）、`courseUrl`（課程頁網址）和 `buttonText`（按鈕文案）。
- `coverWorks` 的左邊放心得文章網址的路徑，例如 `/posts/global-vegan-dishes05`。右邊填作品名，例如 `泰式椒麻雞`。網站會加上 #。移除對應項目或把作品名留空，就會顯示課程標籤。
- 學員姓名、文章標題和封面來自 Teachify。提交設定後，GitHub Actions 會同步心得並重新部署。排程每小時也會同步一次。

首次部署時，在 GitHub 的 Settings → Pages → Source 選 GitHub Actions，然後從 Actions 手動執行 Publish GitHub Pages。等部署成功後，可把 Teachify 的 iframe 網址換成 GitHub Pages 網址。

本機可用 Node.js 24 執行 `node build.mjs`，產出的檔案是 `dist/index.html`。
