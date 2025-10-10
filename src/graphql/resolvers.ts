import { GraphQLScalarType, Kind } from "graphql";
import { portfolioPrisma, intervuPrisma } from "../db/client";
import { Prisma as PortfolioPrisma } from "@prisma/portfolio-client";
import { Prisma as IntervuPrisma } from "@prisma/intervu-client";

const DateTime = new GraphQLScalarType({
  name: "DateTime",
  serialize: v => new Date(v as any).toISOString(),
  parseValue: v => new Date(v as any),
  parseLiteral: ast => (ast.kind === Kind.STRING ? new Date(ast.value) : null)
});

export const resolvers = {
  DateTime,
  Query: {
    health: () => "ok",
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
    portfolioFormation: (_: any, { id }: { id: string }) => portfolioPrisma.formation.findUnique({ where: { id } }),
    intervuCategories: () => intervuPrisma.category.findMany({ orderBy: { name: "asc" } }),
    intervuQuestions: async (_: any, args: any) => {
      const where: IntervuPrisma.QuestionWhereInput | undefined = args.search
        ? { OR: [ { title: { contains: args.search, mode: IntervuPrisma.QueryMode.insensitive } } ] }
        : undefined;
      return intervuPrisma.question.findMany({ where, skip: args.skip, take: args.take, orderBy: { createdAt: "desc" } });
    },
    intervuQuestion: (_: any, { id }: { id: string }) => intervuPrisma.question.findUnique({ where: { id } }),
    intervuAnswers: (_: any, { questionId }: { questionId: string }) => intervuPrisma.answer.findMany({ where: { questionId }, orderBy: { createdAt: "desc" } })
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
    deletePortfolioFormation: async (_: any, { id }: any) => { await portfolioPrisma.formation.delete({ where: { id } }); return true; },
    createIntervuCategory: (_: any, { data }: any) => intervuPrisma.category.create({ data }),
    createIntervuQuestion: (_: any, { data }: any) => intervuPrisma.question.create({ data }),
    updateIntervuQuestion: (_: any, { id, data }: any) => intervuPrisma.question.update({ where: { id }, data }),
    deleteIntervuQuestion: async (_: any, { id }: any) => { await intervuPrisma.question.delete({ where: { id } }); return true; },
    createIntervuAnswer: (_: any, { data }: any) => intervuPrisma.answer.create({ data }),
    updateIntervuAnswer: (_: any, { id, data }: any) => intervuPrisma.answer.update({ where: { id }, data }),
    deleteIntervuAnswer: async (_: any, { id }: any) => { await intervuPrisma.answer.delete({ where: { id } }); return true; }
  },
  Category: { questions: (p: any) => intervuPrisma.question.findMany({ where: { categoryId: p.id } }) },
  Question: { category: (p: any) => (p.categoryId ? intervuPrisma.category.findUnique({ where: { id: p.categoryId } }) : null), answers: (p: any) => intervuPrisma.answer.findMany({ where: { questionId: p.id } }) },
  Answer: { question: (p: any) => intervuPrisma.question.findUnique({ where: { id: p.questionId } }) }
};



