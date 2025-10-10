"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const graphql_1 = require("graphql");
const client_1 = require("../db/client");
const portfolio_client_1 = require("@prisma/portfolio-client");
const intervu_client_1 = require("@prisma/intervu-client");
const DateTime = new graphql_1.GraphQLScalarType({
    name: "DateTime",
    serialize: v => new Date(v).toISOString(),
    parseValue: v => new Date(v),
    parseLiteral: ast => (ast.kind === graphql_1.Kind.STRING ? new Date(ast.value) : null)
});
exports.resolvers = {
    DateTime,
    Query: {
        health: () => "ok",
        portfolioProjects: async (_, args) => {
            const where = args.search
                ? { OR: [
                        { name: { contains: args.search, mode: portfolio_client_1.Prisma.QueryMode.insensitive } },
                        { description: { contains: args.search, mode: portfolio_client_1.Prisma.QueryMode.insensitive } }
                    ] }
                : undefined;
            return client_1.portfolioPrisma.project.findMany({ where, skip: args.skip, take: args.take, orderBy: { createdAt: "desc" } });
        },
        portfolioProject: (_, { id }) => client_1.portfolioPrisma.project.findUnique({ where: { id } }),
        portfolioExperiences: async (_, args) => {
            const where = args.search
                ? { OR: [
                        { name: { contains: args.search, mode: portfolio_client_1.Prisma.QueryMode.insensitive } },
                        { description: { contains: args.search, mode: portfolio_client_1.Prisma.QueryMode.insensitive } }
                    ] }
                : undefined;
            return client_1.portfolioPrisma.experience.findMany({ where, skip: args.skip, take: args.take, orderBy: { createdAt: "desc" } });
        },
        portfolioExperience: (_, { id }) => client_1.portfolioPrisma.experience.findUnique({ where: { id } }),
        portfolioFormations: async (_, args) => {
            const where = args.search
                ? { OR: [
                        { name: { contains: args.search, mode: portfolio_client_1.Prisma.QueryMode.insensitive } },
                        { description: { contains: args.search, mode: portfolio_client_1.Prisma.QueryMode.insensitive } }
                    ] }
                : undefined;
            return client_1.portfolioPrisma.formation.findMany({ where, skip: args.skip, take: args.take, orderBy: { createdAt: "desc" } });
        },
        portfolioFormation: (_, { id }) => client_1.portfolioPrisma.formation.findUnique({ where: { id } }),
        intervuCategories: () => client_1.intervuPrisma.category.findMany({ orderBy: { name: "asc" } }),
        intervuQuestions: async (_, args) => {
            const where = args.search
                ? { OR: [{ title: { contains: args.search, mode: intervu_client_1.Prisma.QueryMode.insensitive } }] }
                : undefined;
            return client_1.intervuPrisma.question.findMany({ where, skip: args.skip, take: args.take, orderBy: { createdAt: "desc" } });
        },
        intervuQuestion: (_, { id }) => client_1.intervuPrisma.question.findUnique({ where: { id } }),
        intervuAnswers: (_, { questionId }) => client_1.intervuPrisma.answer.findMany({ where: { questionId }, orderBy: { createdAt: "desc" } })
    },
    Mutation: {
        createPortfolioProject: (_, { data }) => client_1.portfolioPrisma.project.create({ data }),
        updatePortfolioProject: (_, { id, data }) => client_1.portfolioPrisma.project.update({ where: { id }, data }),
        deletePortfolioProject: async (_, { id }) => { await client_1.portfolioPrisma.project.delete({ where: { id } }); return true; },
        createPortfolioExperience: (_, { data }) => client_1.portfolioPrisma.experience.create({ data }),
        updatePortfolioExperience: (_, { id, data }) => client_1.portfolioPrisma.experience.update({ where: { id }, data }),
        deletePortfolioExperience: async (_, { id }) => { await client_1.portfolioPrisma.experience.delete({ where: { id } }); return true; },
        createPortfolioFormation: (_, { data }) => client_1.portfolioPrisma.formation.create({ data }),
        updatePortfolioFormation: (_, { id, data }) => client_1.portfolioPrisma.formation.update({ where: { id }, data }),
        deletePortfolioFormation: async (_, { id }) => { await client_1.portfolioPrisma.formation.delete({ where: { id } }); return true; },
        createIntervuCategory: (_, { data }) => client_1.intervuPrisma.category.create({ data }),
        createIntervuQuestion: (_, { data }) => client_1.intervuPrisma.question.create({ data }),
        updateIntervuQuestion: (_, { id, data }) => client_1.intervuPrisma.question.update({ where: { id }, data }),
        deleteIntervuQuestion: async (_, { id }) => { await client_1.intervuPrisma.question.delete({ where: { id } }); return true; },
        createIntervuAnswer: (_, { data }) => client_1.intervuPrisma.answer.create({ data }),
        updateIntervuAnswer: (_, { id, data }) => client_1.intervuPrisma.answer.update({ where: { id }, data }),
        deleteIntervuAnswer: async (_, { id }) => { await client_1.intervuPrisma.answer.delete({ where: { id } }); return true; }
    },
    Category: { questions: (p) => client_1.intervuPrisma.question.findMany({ where: { categoryId: p.id } }) },
    Question: { category: (p) => (p.categoryId ? client_1.intervuPrisma.category.findUnique({ where: { id: p.categoryId } }) : null), answers: (p) => client_1.intervuPrisma.answer.findMany({ where: { questionId: p.id } }) },
    Answer: { question: (p) => client_1.intervuPrisma.question.findUnique({ where: { id: p.questionId } }) }
};
