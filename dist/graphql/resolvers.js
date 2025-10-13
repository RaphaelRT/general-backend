"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseResolvers = void 0;
const graphql_1 = require("graphql");
exports.baseResolvers = {
    DateTime: new graphql_1.GraphQLScalarType({
        name: "DateTime",
        serialize: v => new Date(v).toISOString(),
        parseValue: v => new Date(v),
        parseLiteral: ast => (ast.kind === graphql_1.Kind.STRING ? new Date(ast.value) : null)
    }),
    Query: {
        health: () => "ok"
    }
};
