import { serve } from "bun";
import { readFileSync, existsSync } from "fs";
import { join, extname } from "path";

const ROOT = import.meta.dir;
const PORT = 3000;

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "text/javascript; charset=utf-8",
  ".ico":  "image/x-icon",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".svg":  "image/svg+xml",
  ".webp": "image/webp",
};

serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;

    // Default to index.html for directory paths
    if (pathname.endsWith("/")) pathname += "index.html";

    let filePath = join(ROOT, pathname);

    // If no extension, try .html
    if (!extname(filePath) && !existsSync(filePath)) {
      filePath += ".html";
    }

    if (!existsSync(filePath)) {
      return new Response("404 Not Found", { status: 404 });
    }

    const ext = extname(filePath);
    const contentType = MIME[ext] ?? "application/octet-stream";
    const body = readFileSync(filePath);

    return new Response(body, {
      headers: { "Content-Type": contentType },
    });
  },
});

console.log(`ASRG dev server running at http://localhost:${PORT}`);
