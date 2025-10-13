import { GraphQLScalarType, Kind } from "graphql";

export const baseResolvers = {
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    serialize: v => new Date(v as any).toISOString(),
    parseValue: v => new Date(v as any),
    parseLiteral: ast => (ast.kind === Kind.STRING ? new Date(ast.value) : null)
  }),
  Query: {
    health: () => "ok"
  }
};



