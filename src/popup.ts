import type { AreaKey } from "../server/utils/areas";

//開啟options.html
const gear = document.querySelector<HTMLImageElement>(".header_setting");

gear?.addEventListener("click", () => {
  browser.runtime
    .openOptionsPage()
    .catch((err) => console.log("開啟options失敗", err));
});

//宣告spinner
const spinner = document.querySelector<HTMLElement>(".spin")!;

const btnContainer = document.querySelector<HTMLElement>(".btnCollection")!;
const btnTargets = btnContainer.querySelectorAll("button");
let specificArea: AreaKey = "north";

if (!btnContainer) {
  console.log("按鈕容器失效");
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
 * 負責將雷達資料渲染到網頁上。
 *
 * 1. 透過瀏覽器擴充功能訊息發送器 (`browser.runtime.sendMessage`) 請求特定區域資料。
 * 2. 根據請求的區域更新按鈕的 CSS 樣式 (`default` class)。
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

  try {
    spinner.style.display = "flex";
    toggleBtnStatus(true);
    await pause(2000);

    const radarImg = await browser.runtime.sendMessage({
      type: "FETCH_AREA",
      data: specificArea,
    });

    // btnTargets.forEach((e) => {
    //   e.classList.remove("default");
    //   if (e.getAttribute("title") === area) e.classList.add("default");
    // });

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
      spinner.style.display = "none"; // 圖片真的顯示出來了才關掉
      toggleBtnStatus(false);
    };

    //if 失敗
    imgs.onerror = () => {
      spinner.style.display = "none";
      toggleBtnStatus(false);
    };

    imgs.src = radarImg?.radarUrl;
  } catch (error) {
    spinner.style.display = "none";
    toggleBtnStatus(false);

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

  specificArea = area;

  updateBtnLogic(specificArea);

  await renderRadar(specificArea);
});
renderRadar(specificArea);

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//切換button status
function toggleBtnStatus(isLoading: boolean) {
  btnTargets.forEach((b) => (b.disabled = isLoading));
}

//測試 Loading 時間
function pause(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 集中按鈕點擊邏輯
function updateBtnLogic(area: AreaKey) {
  btnTargets.forEach((btn) => {
    const isActive = btn.getAttribute("title") === area;

    btn.classList.toggle("active", isActive);
  });
}
