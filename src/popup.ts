import type { AreaKey } from "../server/utils/areas";

bindOption();
init();

// 宣告開啟的option.html的icon
const gear = document.querySelector<HTMLImageElement>(".header_setting");

//宣告spinner
const spinner = document.querySelector<HTMLElement>(".spin")!;

const btnContainer = document.querySelector<HTMLElement>(".btnCollection")!;
const btnTargets = btnContainer.querySelectorAll("button");

// let specificArea: AreaKey = "north";

if (!btnContainer) {
  console.log("按鈕容器失效");
}

/**
 * 負責將雷達資料渲染到網頁上。
 *
 * 1. 透過瀏覽器擴充功能訊息發送器 (`browser.runtime.sendMessage`) 請求特定區域資料。
 * 2. 根據請求的區域更新按鈕的 CSS 樣式 (active)。
 * 3. 格式化並顯示資料的最近更新時間 (`apiLatestTime` 或 `dateTime`)。
 * 4. 將雷達回波圖的 URL 嵌入到 `<img>` 標籤中進行顯示。
 * 5. 處理並顯示任何潛在的錯誤訊息。
 *
 * @async
 * @param {AreaKey} area - 指定要渲染的區域鍵。
 * @returns {Promise<void>}
 */
async function renderRadar(area: AreaKey) {
  //宣告雷達容器
  const container = document.getElementById("ladar");
  const wrapper = document.querySelector<HTMLElement>(".wrapperImg");
  const header = document.querySelector<HTMLElement>(".headers");

  if (!container || !wrapper || !header) {
    console.log("有元素消失了");
    return;
  }

  spinner.style.display = "flex";
  toggleBtnDisabled(true);
  await new Promise(requestAnimationFrame);
  try {
    // await pause(2000);

    const radarImg = await browser.runtime.sendMessage({
      type: "FETCH_AREA",
      data: area,
    });

    updateBtnLogic(area);

    let timeEl = header.querySelector<HTMLParagraphElement>(".lastTime");

    if (!timeEl) {
      timeEl = document.createElement("p");
      timeEl.classList.add("lastTime");
      header.prepend(timeEl);
    }

    const displayTime = formatTime(
      radarImg.apiLatestTime ?? radarImg.dateTime
    )!.replace(/:\d{2}$/, "");

    timeEl.textContent = `最近一次更新時間: ${displayTime}分`;

    //重構&渲染圖片
    let imgs = wrapper.querySelector<HTMLImageElement>("img");

    if (!imgs) {
      imgs = document.createElement("img");
      imgs.alt = "雷達回波圖";
      wrapper.replaceChildren(imgs);
    }
    // if 成功
    imgs.onload = () => {
      spinner.style.display = "none";
      toggleBtnDisabled(false);
    };

    //if 失敗
    imgs.onerror = () => {
      spinner.style.display = "none";
      toggleBtnDisabled(false);
    };

    imgs.src = radarImg?.radarUrl;
  } catch (error) {
    spinner.style.display = "none";
    toggleBtnDisabled(false);

    console.error(error);
    container.textContent = `取得資料失敗: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

/**
 * 監聽按鈕容器的點擊事件，用於切換顯示的雷達區域。
 *
 * - 移除所有按鈕的 `selected` 樣式。
 * - 將被點擊的按鈕標記為 `selected`。
 * - 更新 `specificArea` 變數。
 * - 呼叫 `renderRadar` 函式來更新網頁內容。
 */
btnContainer?.addEventListener("click", async (e: MouseEvent) => {
  const target = e.target as HTMLButtonElement;

  if (!target || target.tagName !== "BUTTON") return;

  const area = target.getAttribute("title") as AreaKey;

  updateBtnLogic(area);

  await renderRadar(area);
});

//點擊事件指向option page
gear?.addEventListener("click", () => {
  browser.runtime
    .openOptionsPage()
    .catch((err) => console.log("開啟options失敗", err));
});

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//切換button status
function toggleBtnDisabled(isLoading: boolean) {
  btnTargets.forEach((b) => (b.disabled = isLoading));
}

//測試 Loading 時間
// function pause(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// 集中按鈕點擊邏輯
function updateBtnLogic(area: AreaKey) {
  btnTargets.forEach((btn) => {
    const isActive = btn.getAttribute("title") === area;

    btn.classList.toggle("active", isActive);
  });
}

/**
 * 將給定的時間字串格式化為本地語系的年/月/日 時:分:秒 格式。
 *
 * @param {string} time - 待格式化的時間字串 (e.g., ISO 格式)。
 * @returns {string} 格式化後的本地時間字串 (例如：2025/11/04 11:13:01)。
 */
function formatTime(time?: string) {
  if (!time) return;

  const date = new Date(time);

  const formattedTime = new Intl.DateTimeFormat("zh-tw", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
  return formattedTime;
}

/**
 * 如果沒有設置area 預設為新北
 * 如果有 則依指定選項
 * 現在是透過全域函式跑參數
 * 我必須先 await 選項 如果有則讓他跑該參數否則維持原樣
 *
 */
function bindOption() {
  const saveBtn = document.querySelector<HTMLButtonElement>(".save");

  saveBtn?.addEventListener("click", async () => {
    const selectedArea = document.querySelector<HTMLInputElement>(
      'input[name="area"]:checked'
    );

    if (!selectedArea) return;

    const area = selectedArea.value as AreaKey;

    await browser.storage.sync.set({ area });

    await renderRadar(area);
  });
}

/**
 * 負責初始化 如果有option 就以option替代預設的area
 */
async function init() {
  const { area } = await browser.storage.sync.get("area");

  const areaToUse: AreaKey = (area as AreaKey) ?? "north";

  updateBtnLogic(areaToUse);

  await renderRadar(areaToUse);
}
