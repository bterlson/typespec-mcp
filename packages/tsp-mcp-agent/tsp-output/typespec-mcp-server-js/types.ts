import { z } from "zod";



export const learnTypeSpecParameters = z.object({
  area: z.literal("MCP").optional(),
});

export const learnTypeSpecReturnType = z.string();

export const initParameters = z.object({
  outDir: z.string()
    .describe("The absolute path to the directory to create the typespec project in."),
  template: z.string(),
});

export const initReturnType = z.string();