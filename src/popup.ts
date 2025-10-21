import type { AreaKey } from "./utils/areas";

const btnContainer = document.querySelector(".btnCollection") as HTMLElement;
const btnTargets = btnContainer.querySelectorAll("button");
let specificArea: AreaKey = "north";

if (!btnContainer) {
  console.log("按鈕容器失效");
}

//將時間格式化
function formatTime(time: string) {
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

const data = await browser.runtime.sendMessage({
  type: "FETCH_AREA",
  data: specificArea,
});

//將資料渲染到html上
async function renderRadar(area: AreaKey) {
  const container = document.getElementById("ladar");
  const wrapper = document.querySelector(".wrapperImg");
  const header = document.querySelector(".headers");

  if (!container || !wrapper || !header) {
    console.log("有元素消失了");
    return;
  }

  try {
    const radarImg = data;

    btnTargets.forEach((e) => {
      e.classList.remove("default");
      if (e.getAttribute("title") === area) e.classList.add("default");
    });

    let timeEl = document.querySelector(".lastTime");

    if (!timeEl) {
      timeEl = document.createElement("p");
      timeEl.classList.add("lastTime");
    }

    header.prepend(timeEl);
    timeEl.textContent =
      "最近一次更新時間: " +
      formatTime(radarImg.apiLatestTime ?? radarImg.dateTime).replace(
        /:\d{2}$/,
        ""
      ) +
      "分";

    wrapper.innerHTML = `
        <img src='${radarImg.radarUrl}' alt='雷達回波圖' />
    `;
  } catch (error) {
    console.error(error);
    container.textContent = `取得資料失敗: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}
renderRadar(specificArea);

//點擊事件更新api
btnContainer?.addEventListener("click", async (e: MouseEvent) => {
  const target = e.target as HTMLButtonElement;

  if (target && target.tagName === "BUTTON") {
    btnTargets.forEach((b) => b.classList.remove("selected"));
  }

  target.classList.add("selected");

  specificArea = target.getAttribute("title") as AreaKey;
  await renderRadar(specificArea);
});
