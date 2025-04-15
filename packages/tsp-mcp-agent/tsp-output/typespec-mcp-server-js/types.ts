import { z } from "zod";

export const BuiltInTemplateNames = z.union([
  z.literal("rest"),
  z.literal("mcp"),
  z.literal("library-ts"),
  z.literal("emitter-ts")
]);

export const TemplateOption = z.union([BuiltInTemplateNames, z.string().url()]);

export const learnTypeSpecParameters = z.object({
  area: z.literal("MCP").optional(),
});

export const learnTypeSpecReturnType = z.string();

export const initParameters = z.object({
  outDir: z.string()
    .describe("The absolute path to the directory to create the typespec project in."),
  template: TemplateOption.optional()
    .describe("The template to use for the typespec project."),
});

export const initReturnType = z.string();