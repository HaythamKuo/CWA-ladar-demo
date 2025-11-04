import type { RadarData, CwaOpenData } from "../utils/interfaceInstance";
import type { AreaKey } from "../utils/areas";
import { fetchCwaData } from "./weather";

/**
 * 從中央氣象局 (CWA) 開放資料中解構並轉換出標準化的雷達資料物件。
 *
 * @param {object} props - 包含 CWA 開放資料結構的物件。
 * @param {string} props.cwaopendata.dataset.DateTime - 資料時間。
 * @param {string} props.cwaopendata.dataset.resource.ProductURL - 雷達產品的 URL。
 * @param {string} area - 資料對應的區域鍵。
 * @returns {{dateTime: string, radarUrl: string, area: string}} 標準化的雷達資料物件。
 */
function designDataType(props: CwaOpenData, area: AreaKey): RadarData {
  const {
    cwaopendata: {
      dataset: {
        DateTime,
        resource: { ProductURL },
      },
    },
  } = props;

  return {
    dateTime: DateTime,
    radarUrl: ProductURL,
    area,
  };
}

/**
 * 從中央氣象局 API 獲取原始資料並轉換為標準化雷達資料物件。
 *
 *  會調用 `fetchCwaData` 進行網路請求。
 *
 * @param {AreaKey} area - 指定的區域鍵。
 * @returns {Promise<RadarData>} 標準化後的雷達資料。
 * @throws {Error} 如果 API 呼叫失敗或無資料回傳。
 */
export async function getRadarData(area: AreaKey) {
  // const rawData = await fetchCwaData("center");
  const rawData = await fetchCwaData(area);
  if (!rawData) throw new Error("沒有雷達回波圖");

  //const extractDta = designDataType(rawData);
  const plainData: RadarData = designDataType(rawData, area);

  return plainData;
}

// 雷達資料的快取儲存庫及定義
const cache = new Map<AreaKey, { data: RadarData; lastUpdateTime: number }>();
const cacheDuration = 5 * 60 * 1000;

/**
 * 獲取雷達資料，優先使用快取。
 *
 * 如果快取資料在 ${cacheDuration / 60000} 分鐘內有效，則直接返回快取資料；
 * 否則，調用 `getRadarData` 獲取新資料並更新快取。
 *
 * @param {AreaKey} area - 指定的區域鍵。
 * @returns {Promise<RadarData>} 快取中或新獲取的雷達資料。
 */
export async function getCacheRadar(area: AreaKey): Promise<RadarData> {
  const now = Date.now();
  const cached = cache.get(area);

  if (cached && now - cached.lastUpdateTime < cacheDuration) {
    return cached.data;
  }

  const data = await getRadarData(area);

  cache.set(area, { data, lastUpdateTime: now });
  return data;
}
