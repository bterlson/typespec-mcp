(globalThis as any).enableCompilerInternalsExport = true;
import { setToolHandler } from "../tsp-output/typespec-mcp-server-js/tools.js";
import { server } from "../tsp-output/typespec-mcp-server-js/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFile } from "fs/promises";
import { basename, join } from "path";
import { NodeHost } from "@typespec/compiler";
import { WorkflowConfig, workflows } from "./workflows.js";
import { projectRoot } from "./utils.js";
import { execa } from "execa";

const instructions = (
  await readFile(join(projectRoot, "assets", "instructions", "mcp.md"))
).toString();

setToolHandler({
  learnTypeSpec(area) {
    return instructions;
  },
  async init({ outDir, workflow: workflowName, name, additionalEmitters }) {
    name ??= basename(outDir);
    const workflow = workflowName && workflows[workflowName];
    if (workflow === undefined) {
      throw new Error(
        `Workflow ${workflowName} not found. Available templates: ${Object.keys(
          workflows
        )
          .map((x) => ` - ${x}`)
          .join("\n")}`
      );
    }

    const { makeScaffoldingConfig, scaffoldNewProject } = await import(
      "@typespec/compiler/internals"
    );
    await scaffoldNewProject(
      NodeHost,
      makeScaffoldingConfig(workflow.template, {
        directory: outDir,
        baseUri: workflow.baseDir,
        name,
        emitters: resolveEmitters(workflow, additionalEmitters),
      })
    );
    await execa("npm", ["install"], { cwd: outDir });
    return `Project created in ${outDir}`;
  },
});

function resolveEmitters(
  workflow: WorkflowConfig,
  userAdditionalEmitters: string[] | undefined
) {
  const additionalEmitters = new Set([
    ...Object.entries(workflow.template.emitters)
      .filter(([_, v]: [string, any]) => v.selected)
      .map(([key]) => key),
    ...(workflow.emitters ?? []),
    ...(userAdditionalEmitters ?? []),
  ]);

  const emitters: Record<string, any> = {};
  for (const emitter of additionalEmitters) {
    if (emitter in workflow.template.emitters) {
      emitters[emitter] = workflow.template.emitters[emitter];
    } else {
      emitters[emitter] = {
        options: {},
      };
    }
  }

  return emitters;
}
const transport = new StdioServerTransport();
await server.connect(transport);
