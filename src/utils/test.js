const cache = new Map();

cache.set("north", {
  data: {
    dateTime: "2025-10-21T09:00:00+08:00",
    radarUrl: "https://example.com/north.png",
    area: "north",
  },
  lastUpdateTime: 1697865600000,
});

console.log(cache.get("north"));
