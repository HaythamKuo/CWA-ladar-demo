export interface RadarData {
  dateTime: string;
  radarUrl: string;
  area?: string;
}

export interface CwaOpenData {
  cwaopendata: {
    identifier: string;
    sender: string;
    sent: string;
    status: string;
    msgType: string;
    scope: string;
    dataid: string;
    source: string;
    dataset: {
      datasetInfo: {
        datasetDescription: string;
        parameterSet: {
          StationLongitude: string;
          StationLatitude: string;
          parameter: {
            parameterName: string;
            parameterValue: string;
          };
          ImageDimension: string;
        };
      };
      resource: {
        resourceDesc: String;
        mimeType: string;
        ProductURL: string;
      };
      DateTime: string;
    };
  };
}

export interface RadarRes extends RadarData {
  apiLatestTime?: string;
}
