// src/prisma/client.ts
import dotenv from "dotenv";
import { join } from "path";

// Load .env relative to this file
dotenv.config({ path: join(__dirname, "../../.env") });

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
