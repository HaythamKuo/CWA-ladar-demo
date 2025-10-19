import type { RadarRes } from "./utils/interfaceInstance";

//驗證資料格式
function isRadarRes(data: any): data is RadarRes {
  return (
    data &&
    typeof data.dateTime === "string" &&
    typeof data.radarUrl === "string" &&
    (typeof data.apiLatestTime === undefined ||
      typeof data.apiLatestTime === "string")
  );
}
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

async function fetchLadar(): Promise<RadarRes> {
  try {
    const res = await fetch("http://localhost:3005/api/cwajson");
    if (!res.ok) {
      throw new Error(`無法請求資料: ${res.status}`);
    }

    const data = await res.json();

    if (isRadarRes(data)) throw new Error("後端格式錯誤");

    console.log(data);

    return data;
  } catch (error: unknown) {
    console.error("❌ fetchLadar error:", error);

    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

async function renderRadar() {
  const container = document.getElementById("ladar");
  if (!container) return;

  try {
    const radarImg = await fetchLadar();

    container.innerHTML = `
      <p>時間：${formatTime(radarImg.apiLatestTime ?? radarImg.dateTime)}</p>
      <img src=${radarImg.radarUrl} alt='雷達回波圖' />
`;
  } catch (error) {
    console.error(error);
    container.textContent = `取得資料失敗: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}
renderRadar();
