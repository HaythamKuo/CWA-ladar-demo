本專案為一個簡單的 Firefox 瀏覽器插件，用於顯示台灣指定地區的雷達回波圖。

## 簡介

使用者可透過插件介面點擊地區按鈕（如：北部、中部、南部，即時從中央氣象署開放資料 API 取得對應地區的雷達回波圖。

## 環境建置

- 到[中央氣象署](https://www.cwa.gov.tw/V8/C/)申請授權金鑰。
- 安裝 Bun（[https://bun.sh/）。](https://bun.sh/）。)
- Node.js 版本最低應為 18 以上。
- Firefox（開發者版或一般版皆可），用 `about:debugging` 載入暫時擴充。
- 安裝 Typescript(如果沒有安裝的話) [網址](https://www.typescriptlang.org/)。

## 設定（本機開發）

1.  建立.env，將申請的金鑰建立環境變數

```env
CWA_AUTHORIZED_KEY=你的金鑰
```

2. Server 端 ↓

```bash
bun run server
```

3. Client 端 ↓

```bash
bun run dev
```

或是

```bash
bun run dev:typecheck
```

## 疑問

若是有任何疑問，歡迎寄信給我或是留下訊息。

E-mail：qaz7954200@gmail.com
