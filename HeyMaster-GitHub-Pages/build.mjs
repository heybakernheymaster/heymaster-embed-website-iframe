import { mkdir, readFile, writeFile } from "node:fs/promises";
import { readReviews, render } from "./render.mjs";

const settings = JSON.parse(await readFile(new URL("./reviews-settings.json", import.meta.url), "utf8"));
const reviews = await Promise.all(settings.courses.map(async (course) => {
  const url = new URL(course.categoryUrl);
  if (url.origin !== "https://heyheymaster.com" || !/^\/posts\/categories\/[\w-]+\/?$/.test(url.pathname)) {
    throw new Error("Invalid HeyMaster category: " + url.href);
  }
  const response = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: "manual" });
  if (!response.ok) throw new Error(`Unable to load ${url.href} (HTTP ${response.status})`);
  const cards = readReviews(await response.text(), url.href).slice(0, 4);
  if (!cards.length) throw new Error("No review cards found at " + url.href);
  return cards;
}));

const output = new URL("./dist/", import.meta.url);
await mkdir(output, { recursive: true });
await writeFile(new URL("index.html", output), render(reviews, settings));
