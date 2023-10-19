import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { defaultFieldResolver } from "graphql";
import { flattenObject } from "../../utils/functions.js";

const flatten = (schema, directiveName) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (directive) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async (_, args, context, info) => {
          if (args.search) {
            args.search = flattenObject(args.search);
          }
          return await resolve.apply(this, [_, args, context, info]);
        };
      }
    },
  });
};

export default flatten;
