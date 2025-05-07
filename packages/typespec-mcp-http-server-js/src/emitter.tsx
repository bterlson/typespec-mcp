import { EmitContext } from "@typespec/compiler";
import { writeOutput } from "@typespec/emitter-framework";
import { McpServer } from "typespec-mcp-server-js/components";

export async function $onEmit(context: EmitContext) {
  writeOutput(context.program, <McpServer program={context.program} />, context.emitterOutputDir);
}
