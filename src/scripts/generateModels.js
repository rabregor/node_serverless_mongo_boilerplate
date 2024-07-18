import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function gatherFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = entries
    .filter((entry) => entry.isFile() && !entry.name.endsWith("index.js"))
    .map((entry) => join(dir, entry.name));

  const folders = entries.filter((entry) => entry.isDirectory());

  for (const folder of folders) {
    files.push(...(await gatherFiles(join(dir, folder.name))));
  }

  return files;
}

async function generateModelIndex() {
  const modelsDir = join(__dirname, "../models");
  const allFiles = await gatherFiles(modelsDir);

  const imports = [];
  const exports = {};

  for (const file of allFiles) {
    const relativePath = `./${file
      .substring(modelsDir.length + 1)
      .replace(/\\/g, "/")}`;
    const pathParts = file.split("/");
    const modelName = pathParts.slice(-1)[0].replace(".js", "");
    const modelNameCapitalized =
      modelName.charAt(0).toUpperCase() + modelName.slice(1);

    imports.push(`import ${modelName} from '${relativePath}';`);
    exports[modelNameCapitalized] = modelName;
  }

  const exportStrings = Object.entries(exports)
    .map(([capitalizedName, modelName]) => `${capitalizedName}: ${modelName}`)
    .join(",\n  ");

  const content = `
${imports.join("\n")}

export default {
  ${exportStrings}
};
  `;

  await fs.writeFile(join(modelsDir, "index.js"), content);
  console.log("Models index generated!");
}

generateModelIndex().catch((err) => {
  console.error(err);
  process.exit(1);
});
