import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const required = [
  "index.html",
  "assets/main.js",
  "assets/main.css",
  "assets/tailwind.generated.css",
  "assets/images/favicon.svg",
  "assets/images/og-default.png",
  "README.md",
];

for (const relative of required) {
  const info = await stat(path.join(root, relative));
  if (!info.isFile() || info.size === 0) {
    throw new Error(`Required file is empty: ${relative}`);
  }
}

const html = await readFile(path.join(root, "index.html"), "utf8");
const localReferences = [
  ...html.matchAll(/\b(?:src|href)=["']([^"'#]+)["']/g),
]
  .map((match) => match[1])
  .filter((value) => !/^(?:https?:|data:|mailto:|tel:)/i.test(value))
  .map((value) => value.replace(/^\.\//, "").split(/[?#]/, 1)[0])
  .filter((value) => value && !value.startsWith("/"));

for (const relative of new Set(localReferences)) {
  await stat(path.join(root, relative));
}

const packageJson = JSON.parse(
  await readFile(path.join(root, "package.json"), "utf8"),
);
if (packageJson.license !== "UNLICENSED") {
  throw new Error("The package must not imply a license grant without a LICENSE file.");
}

for (const file of ["index.html", "assets/main.js"]) {
  const text = await readFile(path.join(root, file), "utf8");
  if (/AKIA[0-9A-Z]{16}|github_pat_|ghp_|sb_secret_/i.test(text)) {
    throw new Error(`Potential credential pattern found in ${file}`);
  }
}

console.log(
  JSON.stringify({
    ok: true,
    requiredFiles: required.length,
    localReferences: new Set(localReferences).size,
  }),
);
