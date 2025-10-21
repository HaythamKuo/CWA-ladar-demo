import type { RadarData, CwaOpenData } from "../utils/interfaceInstance";
import type { AreaKey } from "../utils/areas";
import { fetchCwaData } from "./weather";

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

//最終輸出的邏輯 代表封裝好的資料（尚未做快取處理）
export async function getRadarData(area: AreaKey) {
  // const rawData = await fetchCwaData("center");
  const rawData = await fetchCwaData(area);
  if (!rawData) throw new Error("沒有雷達回波圖");

  //const extractDta = designDataType(rawData);
  const plainData: RadarData = designDataType(rawData, area);

  return plainData;
}

const cache = new Map<AreaKey, { data: RadarData; lastUpdateTime: number }>();
const cacheDuration = 5 * 60 * 1000;

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
