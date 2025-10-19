import { serve } from "bun";
import { radarDataCache } from "./controllers/radar";

serve({
  port: 3005,
  routes: {
    "/": () => new Response("hello,world"),
    "/api/cwajson": async () => {
      try {
        const data = await radarDataCache.getCacheRadar();

        return Response.json(data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": '"GET, POST, OPTIONS"',
            "Last-Modified": new Date(data.dateTime).toUTCString(),
            "Cache-control": "max-age=60",
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        console.error("❌ API Error:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
      }
    },
  },
});
