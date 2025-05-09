import { For, refkey, StatementList } from "@alloy-js/core";
import { SwitchStatement, VarDeclaration } from "@alloy-js/typescript";
import { useMCPServerContext } from "../context/McpServer.js";
import { mcpSdk } from "../externals/mcp-sdk.js";
import { CallToolHandler } from "./CallToolHandler.jsx";
import { RequestHandler } from "./RequestHandler.jsx";

export interface CallToolHandlersProps {}

/**
 * Generates the handler which handles tool calls.
 */
export function CallToolHandlers(props: CallToolHandlersProps) {
  const { tools } = useMCPServerContext();
  const nameKey = refkey();
  const argsKey = refkey();

  return (
    <RequestHandler name="callTool" schema={mcpSdk["./types.js"].CallToolRequestSchema}>
      {(request) => {
        return (
          <StatementList>
            <VarDeclaration name="name" refkey={nameKey}>
              {request}.params.name
            </VarDeclaration>
            <VarDeclaration name="args" refkey={argsKey}>
              {request}.params.arguments
            </VarDeclaration>
            <SwitchStatement expression={nameKey}>
              <For each={tools} doubleHardline>
                {(tool) => <CallToolHandler tool={tool} args={argsKey} />}
              </For>
            </SwitchStatement>
            <>
              return {"{"} content: [{"{"} type: "text", text: "Unknown tool" {"}"}] {"}"}
            </>
          </StatementList>
        );
      }}
    </RequestHandler>
  );
}
