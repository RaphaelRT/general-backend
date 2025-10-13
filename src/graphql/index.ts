import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { baseTypeDefs } from "./typeDefs";
import { baseResolvers } from "./resolvers";
import { portfolioTypeDefs, portfolioResolvers } from "../modules/portfolio/schema";
import { intervuTypeDefs, intervuResolvers } from "../modules/intervu/schema";

export const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  portfolioTypeDefs,
  intervuTypeDefs
]);

export const resolvers = mergeResolvers([
  baseResolvers,
  portfolioResolvers,
  intervuResolvers
]);


