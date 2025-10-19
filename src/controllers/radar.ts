import type { RadarData, CwaOpenData } from "../utils/interfaceInstance";
import { fetchCwaData } from "./weather";

function designDataType(props: CwaOpenData): RadarData {
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
  };
}

class RadarDataObject implements RadarData {
  constructor(public dateTime: string, public radarUrl: string) {}

  info(): string {
    return `雷達圖時間：${this.dateTime}`;
  }
}

//最終輸出的邏輯 代表封裝好的資料（尚未做快取處理）
export async function getRadarData() {
  const rawData = await fetchCwaData();
  if (!rawData) throw new Error("沒有雷達回波圖");

  const extractDta = designDataType(rawData);

  return new RadarDataObject(extractDta.dateTime, extractDta.radarUrl);
}

//封裝裡加上快取邏輯
class RadarService {
  private cache: RadarDataObject | null = null;
  private lastFetchTime = 0;
  private readonly cacheDuration = 5 * 60 * 1000;
  private lastUpdateTime: string | null = null;

  //進行快取處理
  async getCacheRadar() {
    const now = Date.now();
    const isCacheLate = now - this.lastFetchTime > this.cacheDuration;

    if (!this.cache || isCacheLate) {
      console.log("更新cache資料");
      this.cache = await getRadarData();
      this.lastFetchTime = now;
    } else {
      console.log("使用原有的cache資料");
    }

    this.updateNewTime();

    return {
      ...this.cache,
      apiNewTime: this.lastUpdateTime ?? this.cache?.dateTime,
    };
  }

  //同步更新最新資料
  async updateNewTime() {
    try {
      const rawData = await fetchCwaData();
      if (!rawData) throw new Error("看來不會有最新時間");

      const {
        cwaopendata: {
          dataset: { DateTime },
        },
      } = rawData;

      this.lastUpdateTime = DateTime;
    } catch (error) {
      console.log(error);
    }
  }
}

export const radarDataCache = new RadarService();

////////////////////////////////////////////////////////////////////////////////////////////////////////
