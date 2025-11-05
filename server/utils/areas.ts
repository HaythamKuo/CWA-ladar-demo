export const areas = {
  north: `https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0084-001?Authorization=${process.env.CWA_AUTHORIZED_KEY}&downloadType=WEB&format=JSON`,
  center: `https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0084-002?Authorization=${process.env.CWA_AUTHORIZED_KEY}&downloadType=WEB&format=JSON`,
  south: `https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0084-003?Authorization=${process.env.CWA_AUTHORIZED_KEY}&downloadType=WEB&format=JSON`,
} as const;

export type AreaKey = keyof typeof areas;
