import fs from "fs";
import path from "path";

export function loadStaticHtml(route: string): { head: string; body: string } {
  const relative = route === "/" ? "index.html" : `${route}.html`;
  const filePath = path.join(process.cwd(), "static-source", relative);
  const html = fs.readFileSync(filePath, "utf-8");

  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headRaw = headMatch ? headMatch[1] : "";

  const styles = (headRaw.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).join("");
  const links = (headRaw.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || []).join("");

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;

  return { head: styles + links, body };
}
