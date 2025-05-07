import { List } from "@alloy-js/core";
import { FunctionDeclaration, SourceFile, VarDeclaration } from "@alloy-js/typescript";
import { EmitContext } from "@typespec/compiler";
import { writeOutput, Output } from "@typespec/emitter-framework";
import { ToolsInterface } from "./components/ToolsInterface.jsx";
import { mcpSdk } from "./externals/mcp-sdk.js";
import { zod } from "typespec-zod";
import { ZodTypes } from "./components/ZodTypes.jsx";
import { ListToolsHandler } from "./components/ListToolsHandler.jsx";
import { zodToJsonSchema } from "./externals/zodToJsonSchema.js";
import { CallToolHandlers } from "./components/CallToolHandlers.jsx";
import { createMCPServerContext, MCPServerContext } from "./context/McpServer.js";
import { ServerDeclaration } from "./components/ServerDeclaration.jsx";
import { ToolHandlerAccessors } from "./components/ToolHandlerAccessors.jsx";
import { zodValidationError } from "./externals/zod-validation-error.js";
import { TsTypes } from "./components/TsTypes.jsx";

export async function $onEmit(context: EmitContext) {
  const mcpServerContext: MCPServerContext = createMCPServerContext(context.program);

  const libs = [mcpSdk, zod, zodToJsonSchema, zodValidationError];
}
