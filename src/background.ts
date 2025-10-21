import type { RadarRes } from "./utils/interfaceInstance";
import type { AreaKey } from "./utils/areas";

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

//負責從後端抓資料
async function fetchLadar(area: AreaKey): Promise<RadarRes> {
  try {
    const res = await fetch(`http://localhost:3005/api/cwajson/${area}`);
    if (!res.ok) {
      throw new Error(`無法請求資料: ${res.status}`);
    }

    const data = await res.json();

    if (isRadarRes(data)) throw new Error("後端格式錯誤");

    return data;
  } catch (error: unknown) {
    console.error("❌ fetchLadar error:", error);

    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

browser.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === "FETCH_AREA") {
    try {
      const data = await fetchLadar(msg.data);
      return data;
    } catch (error) {
      return { error: "無法取得地區資料" };
    }
  }
});
