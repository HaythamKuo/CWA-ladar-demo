本專案示範一個簡單的 **Firefox 擴充（popup）** + **Bun 全端 proxy** 架構，用來顯示降雨雷達瓦片（tile）。主要目的：

- 後端負責向上游瓦片伺服器取圖（可放 API key、避免 CORS），並回傳給 extension。
- 前端 popup 使用 Leaflet 顯示地圖與瓦片。

## 檔案總覽

- `server.ts` — Bun server（proxy tiles）
- `.env.example` — 上游瓦片模板與設定範例
- `manifest.json` — Firefox 擴充設定（manifest v3）
- `popup.html` — Popup UI
- `popup.js` — Popup 前端邏輯
- `icons/` — (放置 icon 的位置，可自訂)

## 前置條件

- 安裝 Bun（[https://bun.sh/）。](https://bun.sh/）。)
- Firefox（開發者版或一般版皆可），用 `about:debugging` 載入暫時擴充。

## 設定（本機開發）

1. 複製 `.env.example` 為 `.env`，設定你的上游瓦片 URL template。例如（留空則會錯誤，請替換真實來源）：

   ```
   UPSTREAM_TILE_TEMPLATE=https://tiles.example.com/radar/{time}/{z}/{x}/{y}.png
   API_KEY=你的_api_key_or_empty
   PORT=3000
   ```

   - 模板內可用 `{z}`, `{x}`, `{y}`, `{time}` 四個占位符。

2. 啟動 Bun server：

   ```bash
   bun run server.ts
   ```

   或：

   ```bash
   bun server.ts
   ```

   （若你使用 TypeScript 設定，bun 可直接執行 `.ts`）
