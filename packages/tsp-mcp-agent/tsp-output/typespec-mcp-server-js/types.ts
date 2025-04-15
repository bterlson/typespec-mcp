import { z } from "zod";



export const learnTypeSpecParameters = z.object({
  area: z.literal("MCP").optional(),
});

export const learnTypeSpecReturnType = z.string();

export const initParameters = z.object({});

export const initReturnType = z.string();