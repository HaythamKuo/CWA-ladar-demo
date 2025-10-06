//import axios from 'axios'

const API_URL =
  "https://opendata.cwa.gov.tw/historyapi/v1/getMetadata/O-A0059-001?Authorization=CWA-646D38A3-133E-424C-A849-8C5E38C23DD0";

let cache: { [key: string]: any } = {};
const cacheTime = 5 * 60 * 1000;
let lastFetchTime = 0;

/**
 * 處理rsponse以及捕捉錯誤
 * @param data
 * @param status
 * @returns
 */

function jsonRes(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
function errRes(message: string, status = 500) {
  return jsonRes({ err: message }, status);
}

export async function handleLadarApi(): Promise<Response> {
  const now = Date.now();

  if (cache.data && now - lastFetchTime < cacheTime) {
    return jsonRes(cache.data);
  }

  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      return errRes(`API要求失敗 status: ${res.status}`, res.status);
    }

    const data = await res.json();

    cache.data = data;
    lastFetchTime = now;

    return jsonRes(data);
  } catch (error: any) {
    return errRes(error.message || "未知錯誤");
  }
}
