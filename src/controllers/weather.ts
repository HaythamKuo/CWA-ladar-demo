import type { CwaOpenData } from "../utils/interfaceInstance";

const testUrl: string = `https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0084-001?Authorization=${process.env.CWA_AUTHORIZED_KEY}&downloadType=WEB&format=JSON`;

export async function fetchCwaData(): Promise<CwaOpenData> {
  try {
    const res = await fetch(testUrl);
    if (!res.ok) throw new Error(`發生錯誤, status為${res.status}`);
    const data: CwaOpenData = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
