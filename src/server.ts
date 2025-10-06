import { serve } from "bun";
import { handleLadarApi } from "./controllers/weather";

const port: number = 3005;

serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/ladar") {
      return await handleLadarApi();
    }

    return new Response("Not Found", { status: 404 });
  },
});
console.log(`Bun server running at http://localhost:${port}`);
