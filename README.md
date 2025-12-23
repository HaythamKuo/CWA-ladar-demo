# Taiwan Weather Radar Extension (Firefox)

This is a Firefox extension built with **TypeScript** and **Bun**.
It allows users to view real-time radar images from the Central Weather Administration (CWA) by selecting different regions.

## ⚠️ Note to Mozilla Reviewers

This project uses **Bun** as the package manager and bundler.
Please ensure you have Bun installed or use an environment that supports it to build the source code.

The extension relies on a backend server (deployed on Zeabur) to handle API keys securely. The extension itself **does not** contain any API keys.

## Prerequisites

- **Bun** (v1.0.0 or later)
- Node.js (optional, but Bun is the primary tool used)

## Build Instructions

Please follow these steps to build the extension from the source code:

### 1. Install Dependencies

Run the following command in the root directory to install all required packages:

```bash
bun install
```

### 2. Run the project

If you want to examine the environment, run the scripts:

```bash
bun run dev
```

> This script will erect the popup.

```bash
bun run server
```

> This script will erect the local server.

### 3. Build the project

```bash
bun run build

or

bun run build:all
```

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
