import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, "../src");

let violations = 0;
let scannedFiles = 0;
let maxLines = 0;
let maxLineFile = "";

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".next" || entry.name === "node_modules" || entry.name === "dist") {
        continue;
      }
      scanDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
      checkFile(fullPath, entry.name);
    }
  }
}

function checkFile(filePath, fileName) {
  scannedFiles++;
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/).length;

  if (lines > maxLines) {
    maxLines = lines;
    maxLineFile = path.relative(path.resolve(__dirname, ".."), filePath);
  }

  const isPageOrLayout = fileName === "page.tsx" || fileName === "layout.tsx";
  const limit = isPageOrLayout ? 220 : 300;

  if (lines > limit) {
    console.error(
      `[LINE LIMIT VIOLATION] ${path.relative(path.resolve(__dirname, ".."), filePath)}: ${lines} lines (limit: ${limit})`
    );
    violations++;
  }
}

scanDirectory(srcDir);

console.log(`Source size check complete. Scanned ${scannedFiles} files.`);
console.log(`Largest file: ${maxLineFile || "none"} (${maxLines} lines)`);

if (violations > 0) {
  console.error(`FAILED: ${violations} file(s) exceeded physical line limits.`);
  process.exit(1);
} else {
  console.log("PASSED: All maintained source files satisfy line limits.");
  process.exit(0);
}
