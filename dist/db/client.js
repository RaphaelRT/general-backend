"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intervuPrisma = exports.portfolioPrisma = void 0;
const portfolio_client_1 = require("@prisma/portfolio-client");
const intervu_client_1 = require("@prisma/intervu-client");
exports.portfolioPrisma = new portfolio_client_1.PrismaClient();
exports.intervuPrisma = new intervu_client_1.PrismaClient();
