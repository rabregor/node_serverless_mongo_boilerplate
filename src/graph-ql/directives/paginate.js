import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { defaultFieldResolver } from "graphql";

const paginate = (schema, directiveName) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (directive) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async (_, args, context) => {
          const { results, count, params } = await resolve.apply(this, [
            _,
            args,
            context,
          ]);

          const { page, pageSize } = params;
          const pages = Math.ceil(count / pageSize);
          const prev = page > 1 ? page - 1 : null;
          const next = page < pages ? page + 1 : null;
          return {
            info: {
              count,
              pages,
              prev,
              next,
            },
            results,
          };
        };
      }
    },
  });
};

export default paginate;
