import type { CwaOpenData } from "../../server/utils/interfaceInstance";
import { areas } from "../../server/utils/areas";

import type { AreaKey } from "../../server/utils/areas";

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
