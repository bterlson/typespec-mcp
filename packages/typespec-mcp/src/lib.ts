import { createTypeSpecLibrary } from "@typespec/compiler";

export const $lib = createTypeSpecLibrary({
  name: "typespec-mcp",
  diagnostics: {},
  state: {
    tool: { description: "An MCP tool" },
    serializeAsText: {
      description: "Holds the type which is serialized to text",
    },
  },
} as const);

// Optional but convenient, these are meant to be used locally in your library.
export const { reportDiagnostic, createDiagnostic, stateKeys } = $lib;
