import { gql } from "graphql-tag";
import { Prisma as PortfolioPrisma } from "@prisma/portfolio-client";
import { portfolioPrisma } from "./db";

export const portfolioTypeDefs = gql`
  type Project { id: ID!, name: String!, description: String, createdAt: DateTime! }
  type Experience { id: ID!, name: String!, description: String, createdAt: DateTime! }
  type Formation { id: ID!, name: String!, description: String, createdAt: DateTime! }

  extend type Query {
    portfolioProjects(search: String, skip: Int, take: Int): [Project!]!
    portfolioProject(id: ID!): Project
    portfolioExperiences(search: String, skip: Int, take: Int): [Experience!]!
    portfolioExperience(id: ID!): Experience
    portfolioFormations(search: String, skip: Int, take: Int): [Formation!]!
    portfolioFormation(id: ID!): Formation
  }

  input ProjectCreateInput { name: String!, description: String }
  input ProjectUpdateInput { name: String, description: String }
  input ExperienceCreateInput { name: String!, description: String }
  input ExperienceUpdateInput { name: String, description: String }
  input FormationCreateInput { name: String!, description: String }
  input FormationUpdateInput { name: String, description: String }

  extend type Mutation {
    createPortfolioProject(data: ProjectCreateInput!): Project!
    updatePortfolioProject(id: ID!, data: ProjectUpdateInput!): Project!
    deletePortfolioProject(id: ID!): Boolean!
    createPortfolioExperience(data: ExperienceCreateInput!): Experience!
    updatePortfolioExperience(id: ID!, data: ExperienceUpdateInput!): Experience!
    deletePortfolioExperience(id: ID!): Boolean!
    createPortfolioFormation(data: FormationCreateInput!): Formation!
    updatePortfolioFormation(id: ID!, data: FormationUpdateInput!): Formation!
    deletePortfolioFormation(id: ID!): Boolean!
  }
`;

export const portfolioResolvers = {
  Query: {
    portfolioProjects: async (_: any, args: any) => {
      const where: PortfolioPrisma.ProjectWhereInput | undefined = args.search
        ? { OR: [
            { name: { contains: args.search, mode: PortfolioPrisma.QueryMode.insensitive } },
            { description: { contains: args.search, mode: PortfolioPrisma.QueryMode.insensitive } }
          ] }
        : undefined;
      return portfolioPrisma.project.findMany({ where, skip: args.skip, take: args.take, orderBy: { createdAt: "desc" } });
    },
    portfolioProject: (_: any, { id }: { id: string }) => portfolioPrisma.project.findUnique({ where: { id } }),
    portfolioExperiences: async (_: any, args: any) => {
      const where: PortfolioPrisma.ExperienceWhereInput | undefined = args.search
        ? { OR: [
            { name: { contains: args.search, mode: PortfolioPrisma.QueryMode.insensitive } },
            { description: { contains: args.search, mode: PortfolioPrisma.QueryMode.insensitive } }
          ] }
        : undefined;
      return portfolioPrisma.experience.findMany({ where, skip: args.skip, take: args.take, orderBy: { createdAt: "desc" } });
    },
    portfolioExperience: (_: any, { id }: { id: string }) => portfolioPrisma.experience.findUnique({ where: { id } }),
    portfolioFormations: async (_: any, args: any) => {
      const where: PortfolioPrisma.FormationWhereInput | undefined = args.search
        ? { OR: [
            { name: { contains: args.search, mode: PortfolioPrisma.QueryMode.insensitive } },
            { description: { contains: args.search, mode: PortfolioPrisma.QueryMode.insensitive } }
          ] }
        : undefined;
      return portfolioPrisma.formation.findMany({ where, skip: args.skip, take: args.take, orderBy: { createdAt: "desc" } });
    },
    portfolioFormation: (_: any, { id }: { id: string }) => portfolioPrisma.formation.findUnique({ where: { id } })
  },
  Mutation: {
    createPortfolioProject: (_: any, { data }: any) => portfolioPrisma.project.create({ data }),
    updatePortfolioProject: (_: any, { id, data }: any) => portfolioPrisma.project.update({ where: { id }, data }),
    deletePortfolioProject: async (_: any, { id }: any) => { await portfolioPrisma.project.delete({ where: { id } }); return true; },
    createPortfolioExperience: (_: any, { data }: any) => portfolioPrisma.experience.create({ data }),
    updatePortfolioExperience: (_: any, { id, data }: any) => portfolioPrisma.experience.update({ where: { id }, data }),
    deletePortfolioExperience: async (_: any, { id }: any) => { await portfolioPrisma.experience.delete({ where: { id } }); return true; },
    createPortfolioFormation: (_: any, { data }: any) => portfolioPrisma.formation.create({ data }),
    updatePortfolioFormation: (_: any, { id, data }: any) => portfolioPrisma.formation.update({ where: { id }, data }),
    deletePortfolioFormation: async (_: any, { id }: any) => { await portfolioPrisma.formation.delete({ where: { id } }); return true; }
  }
};


