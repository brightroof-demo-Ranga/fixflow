// Runs Prettier on every file the Cursor agent edits.
// Cursor sends details of the edit as JSON on stdin; we only need file_path.
import { readFile, writeFile } from "node:fs/promises";
import * as prettier from "prettier";

let input = "";
for await (const chunk of process.stdin) input += chunk;

try {
  const { file_path } = JSON.parse(input || "{}");
  if (file_path) {
    const info = await prettier.getFileInfo(file_path, {
      ignorePath: ".prettierignore",
    });
    if (!info.ignored && info.inferredParser) {
      const source = await readFile(file_path, "utf8");
      const options = (await prettier.resolveConfig(file_path)) ?? {};
      const formatted = await prettier.format(source, {
        ...options,
        filepath: file_path,
      });
      if (formatted !== source) await writeFile(file_path, formatted);
    }
  }
} catch {
  // Never block the agent just because formatting failed.
}
process.exit(0);
