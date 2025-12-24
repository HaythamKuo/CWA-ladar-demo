import type { RadarRes } from "../server/utils/interfaceInstance";
import type { AreaKey } from "../server/utils/areas";

/**
 * 類型保護函式：驗證輸入資料是否符合預期的 `RadarRes` 格式。
 *
 * @param {any} data - 待驗證的任意資料。
 * @returns {data is RadarRes} 如果資料符合結構，返回 true。
 */
function isRadarRes(data: any): data is RadarRes {
  return (
    data &&
    typeof data.dateTime === "string" &&
    typeof data.radarUrl === "string" &&
    (data.apiLatestTime === undefined || typeof data.apiLatestTime === "string")
  );
}

/**
 * 從指定的本地端後端 API 抓取特定區域的雷達資料。
 *
 * @param {AreaKey} area - 要抓取資料的區域鍵 (AreaKey)。
 * @returns {Promise<RadarRes>} 成功獲取並驗證後的雷達回應資料物件。
 * @throws {Error} 如果網路請求失敗、響應碼非 2xx，或資料格式不正確。
 */
async function fetchLadar(area: AreaKey): Promise<RadarRes> {
  try {
    // const res = await fetch(`${Bun.env.CWA_SERVER}/api/cwajson/${area}`);
    const res = await fetch(`https://cwa-radar.zeabur.app/api/cwajson/${area}`);
    if (!res.ok) {
      throw new Error(`無法請求資料: ${res.status}`);
    }

    const data = await res.json();

    // if (isRadarRes(data)) throw new Error("後端格式錯誤");
    if (!isRadarRes(data)) throw new Error("後端格式錯誤");

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
