import fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let models = {};

((dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const path = join(dir, file);
    import(path).then((module) => {
      const model = module.default;
      if (model) {
        models[model.modelName] = model;
      }
    });
  });
})(__dirname);

export default models;
