import { serve } from "bun";
import { getRadarData } from "./controllers/radar";

serve({
  port: 3005,
  routes: {
    "/": () => new Response("hello,world"),
    "/api/cwajson": async () => {
      try {
        const data = await getRadarData();

        return Response.json(data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": '"GET, POST, OPTIONS"',
          },
        });
      } catch (err) {
        console.error("❌ API Error:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
      }
    },
  },
});
