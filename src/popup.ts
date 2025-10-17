import type { RadarData } from "./utils/interfaceInstance";
async function fetchLadar(): Promise<RadarData> {
  try {
    const res = await fetch("http://localhost:3005/api/cwajson");
    if (!res.ok) {
      throw new Error(`無法請求資料: ${res.status}`);
    }
    const data: RadarData = await res.json();

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
      <p>時間：${radarImg.dateTime}</p>
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
