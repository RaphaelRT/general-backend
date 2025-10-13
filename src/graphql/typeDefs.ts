import { gql } from "graphql-tag";

export const baseTypeDefs = gql`
  scalar DateTime

  type Query {
    health: String!
  }

  type Mutation {
    _empty: String
  }
`;



