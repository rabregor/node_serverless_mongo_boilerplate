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

async function generateResolvers() {
  const resolversDir = join(__dirname, "../graph-ql/resolvers");
  const allFiles = await gatherFiles(resolversDir);

  const imports = [];
  const exports = {
    Query: [],
    Mutation: [],
  };

  for (const file of allFiles) {
    const relativePath = `./${file.substring(resolversDir.length + 1)}`;
    const pathParts = file.split("/");
    const moduleName = pathParts.slice(-2).join("_").replace(".js", ""); // Uses the last two parts of the path for uniqueness

    imports.push(`import * as ${moduleName} from '${relativePath}';`);

    if (file.includes("queries")) {
      exports.Query.push(`...${moduleName}.default`);
    } else if (file.includes("mutations")) {
      exports.Mutation.push(`...${moduleName}.default`);
    }
  }

  const content = `
${imports.join("\n")}

export const resolvers = {
  Query: {
    ${exports.Query.join(",\n    ")}
  },
  Mutation: {
    ${exports.Mutation.join(",\n    ")}
  }
};
  `;

  await fs.writeFile(join(resolversDir, "index.js"), content);
  console.log("Resolvers index generated!");
}

generateResolvers().catch((err) => {
  console.error(err);
  process.exit(1);
});
