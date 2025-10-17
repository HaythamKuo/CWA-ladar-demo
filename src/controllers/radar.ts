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

export async function getRadarData() {
  const rawData = await fetchCwaData();
  if (!rawData) throw new Error("沒有雷達回波圖");

  const extractDta = designDataType(rawData);

  return new RadarDataObject(extractDta.dateTime, extractDta.radarUrl);
}
