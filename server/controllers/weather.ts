import type { CwaOpenData } from "../utils/interfaceInstance";
import { areas } from "../utils/areas";
import type { AreaKey } from "../utils/areas";

export async function fetchCwaData(area: AreaKey): Promise<CwaOpenData> {
  try {
    const url = areas[area];

    if (!url) throw new Error("找不到指定的區域:" + area);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`發生錯誤, status為${res.status}`);
    const data: CwaOpenData = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
