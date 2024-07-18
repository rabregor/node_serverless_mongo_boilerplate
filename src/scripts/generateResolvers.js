import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function gatherFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = entries
    .filter((entry) => entry.isFile() && !entry.name.endsWith("index.js"))
    .map((entry) => join(dir, entry.name).replace(/\//g, "\\")); // Cambios aqui

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

  const typeResolvers = {};

  for (const file of allFiles) {
    const relativePath = `./${file
      .substring(resolversDir.length + 1)
      .replace(/\\/g, "/")}`; // Cambios aqui
    const pathParts = file.split("\\"); // Cambios aqui
    const moduleName = pathParts.slice(-2).join("_").replace(".js", "");

    imports.push(`import ${moduleName} from '${relativePath}';`);

    if (file.includes("queries")) {
      exports.Query.push(`...${moduleName}`);
    } else if (file.includes("mutations")) {
      exports.Mutation.push(`...${moduleName}`);
    } else if (file.endsWith("fields.js")) {
      const typeName = pathParts[pathParts.length - 2];
      if (!typeResolvers[typeName]) {
        typeResolvers[typeName] = [];
      }
      typeResolvers[typeName].push(`...${moduleName}`);
    }
  }

  const typesExport = Object.entries(typeResolvers)
    .map(
      ([typeName, resolvers]) =>
        `${typeName}: {\n    ${resolvers.join(",\n    ")}\n  }`,
    )
    .join(",\n  ");

  const content = `
${imports.join("\n")}

export const resolvers = {
  ${typesExport ? `${typesExport},\n  ` : ""}
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
