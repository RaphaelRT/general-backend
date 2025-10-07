import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime

  type Project { id: ID!, name: String!, description: String, createdAt: DateTime! }
  type Experience { id: ID!, name: String!, description: String, createdAt: DateTime! }

  type Category { id: ID!, name: String!, questions: [Question!]! }
  type Question { id: ID!, title: String!, createdAt: DateTime!, category: Category, answers: [Answer!]! }
  type Answer { id: ID!, content: String!, createdAt: DateTime!, question: Question! }

  type Query {
    health: String!
    portfolioProjects(search: String, skip: Int, take: Int): [Project!]!
    portfolioProject(id: ID!): Project
    portfolioExperiences(search: String, skip: Int, take: Int): [Experience!]!
    portfolioExperience(id: ID!): Experience
    intervuCategories: [Category!]!
    intervuQuestions(search: String, skip: Int, take: Int): [Question!]!
    intervuQuestion(id: ID!): Question
    intervuAnswers(questionId: ID!): [Answer!]!
  }

  input ProjectCreateInput { name: String!, description: String }
  input ProjectUpdateInput { name: String, description: String }
  input ExperienceCreateInput { name: String!, description: String }
  input ExperienceUpdateInput { name: String, description: String }
  input CategoryCreateInput { name: String! }
  input QuestionCreateInput { title: String!, categoryId: ID }
  input QuestionUpdateInput { title: String, categoryId: ID }
  input AnswerCreateInput { questionId: ID!, content: String! }
  input AnswerUpdateInput { content: String }

  type Mutation {
    createPortfolioProject(data: ProjectCreateInput!): Project!
    updatePortfolioProject(id: ID!, data: ProjectUpdateInput!): Project!
    deletePortfolioProject(id: ID!): Boolean!
    createPortfolioExperience(data: ExperienceCreateInput!): Experience!
    updatePortfolioExperience(id: ID!, data: ExperienceUpdateInput!): Experience!
    deletePortfolioExperience(id: ID!): Boolean!

    createIntervuCategory(data: CategoryCreateInput!): Category!
    createIntervuQuestion(data: QuestionCreateInput!): Question!
    updateIntervuQuestion(id: ID!, data: QuestionUpdateInput!): Question!
    deleteIntervuQuestion(id: ID!): Boolean!
    createIntervuAnswer(data: AnswerCreateInput!): Answer!
    updateIntervuAnswer(id: ID!, data: AnswerUpdateInput!): Answer!
    deleteIntervuAnswer(id: ID!): Boolean!
  }
`;



