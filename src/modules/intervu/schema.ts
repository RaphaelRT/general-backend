import { gql } from "graphql-tag";
import { Prisma as IntervuPrisma } from "@prisma/intervu-client";
import { intervuPrisma } from "./db";

export const intervuTypeDefs = gql`
  type Category { id: ID!, name: String!, questions: [Question!]! }
  type Question { id: ID!, title: String!, createdAt: DateTime!, category: Category, answers: [Answer!]! }
  type Answer { id: ID!, content: String!, createdAt: DateTime!, question: Question! }

  extend type Query {
    intervuCategories: [Category!]!
    intervuQuestions(search: String, skip: Int, take: Int): [Question!]!
    intervuQuestion(id: ID!): Question
    intervuAnswers(questionId: ID!): [Answer!]!
  }

  input CategoryCreateInput { name: String! }
  input QuestionCreateInput { title: String!, categoryId: ID }
  input QuestionUpdateInput { title: String, categoryId: ID }
  input AnswerCreateInput { questionId: ID!, content: String! }
  input AnswerUpdateInput { content: String }

  extend type Mutation {
    createIntervuCategory(data: CategoryCreateInput!): Category!
    createIntervuQuestion(data: QuestionCreateInput!): Question!
    updateIntervuQuestion(id: ID!, data: QuestionUpdateInput!): Question!
    deleteIntervuQuestion(id: ID!): Boolean!
    createIntervuAnswer(data: AnswerCreateInput!): Answer!
    updateIntervuAnswer(id: ID!, data: AnswerUpdateInput!): Answer!
    deleteIntervuAnswer(id: ID!): Boolean!
  }
`;

export const intervuResolvers = {
  Query: {
    intervuCategories: () => intervuPrisma.category.findMany({ orderBy: { name: "asc" } }),
    intervuQuestions: async (_: any, args: any) => {
      const query: string | undefined = typeof args.search === "string" ? args.search.trim() : undefined;
      const where: IntervuPrisma.QuestionWhereInput | undefined = query && query.length > 0
        ? {
            OR: [
              { title: { contains: query, mode: IntervuPrisma.QueryMode.insensitive } },
              { category: { name: { contains: query, mode: IntervuPrisma.QueryMode.insensitive } } },
              { answers: { some: { content: { contains: query, mode: IntervuPrisma.QueryMode.insensitive } } } }
            ]
          }
        : undefined;
      return intervuPrisma.question.findMany({ where, skip: args.skip, take: args.take, orderBy: { createdAt: "desc" } });
    },
    intervuQuestion: (_: any, { id }: { id: string }) => intervuPrisma.question.findUnique({ where: { id } }),
    intervuAnswers: (_: any, { questionId }: { questionId: string }) => intervuPrisma.answer.findMany({ where: { questionId }, orderBy: { createdAt: "desc" } })
  },
  Mutation: {
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


