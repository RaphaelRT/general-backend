"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intervuPrisma = exports.portfolioPrisma = void 0;
// Conservé pour compatibilité éventuelle; chaque module expose désormais son client
var db_1 = require("../modules/portfolio/db");
Object.defineProperty(exports, "portfolioPrisma", { enumerable: true, get: function () { return db_1.portfolioPrisma; } });
var db_2 = require("../modules/intervu/db");
Object.defineProperty(exports, "intervuPrisma", { enumerable: true, get: function () { return db_2.intervuPrisma; } });
