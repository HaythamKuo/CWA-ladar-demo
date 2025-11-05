import { serve } from "bun";

import { getCacheRadar } from "./controllers/radar";
import type { AreaKey } from "./utils/areas";

const PORT = Bun.env.PORT ?? 3005;

serve({
  port: PORT,
  routes: {
    "/": () => new Response("hello,world"),
    "/api/cwajson/:area": async (req) => {
      const { area } = req.params as { area: AreaKey };

      try {
        const data = await getCacheRadar(area);

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
console.log(`Listening on http://localhost:${PORT}`);
