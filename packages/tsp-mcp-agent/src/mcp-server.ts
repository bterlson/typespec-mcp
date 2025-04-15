(globalThis as any).enableCompilerInternalsExport = true;
import { setToolHandler } from "../tsp-output/typespec-mcp-server-js/tools.js";
import { server } from "../tsp-output/typespec-mcp-server-js/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { NodeHost } from "@typespec/compiler";

const projectRoot = resolve(import.meta.dirname, "..", "..");

console.log("MCP templates", await getMcpTemplates());
console.log("Core templates", await getTypeSpecCoreTemplates());

const instructions = (
  await readFile(join(projectRoot, "assets", "instructions", "mcp.md"))
).toString();

setToolHandler({
  learnTypeSpec(area) {
    return instructions;
  },
  async init(outDir, templateName?) {
    const mcpTemplates = await getMcpTemplates();
    const coreTemplates = await getTypeSpecCoreTemplates();

    let baseUri;
    let template;
    if (templateName) {
      if (templateName in mcpTemplates.templates) {
        baseUri = mcpTemplates.baseUri;
        template = mcpTemplates.templates[templateName];
      } else {
        baseUri = coreTemplates.baseUri;
        template = coreTemplates.templates[templateName];
      }
    }
    if (template === undefined) {
      throw new Error(
        `Template ${templateName} not found. Available templates: ${[Object.keys(coreTemplates.templates), Object.keys(mcpTemplates.templates)].join(", ")}`
      );
    }

    const { makeScaffoldingConfig, scaffoldNewProject } = await import(
      "@typespec/compiler/internals"
    );
    await scaffoldNewProject(
      NodeHost,
      makeScaffoldingConfig(template, {
        directory: outDir,
        baseUri,
      })
    );
    return `Project created in ${outDir}`;
  },
});

const transport = new StdioServerTransport();
await server.connect(transport);

async function getTypeSpecCoreTemplates(): Promise<{
  readonly baseUri: string;
  readonly templates: Record<string, any>;
}> {
  return loadTemplates(
    join(projectRoot, "node_modules", "@typespec", "compiler", "templates")
  );
}

async function getMcpTemplates(): Promise<{
  readonly baseUri: string;
  readonly templates: Record<string, any>;
}> {
  return loadTemplates(join(projectRoot, "templates"));
}

async function loadTemplates(templatesDir: string): Promise<{
  readonly baseUri: string;
  readonly templates: Record<string, any>;
}> {
  const file = (
    await readFile(join(templatesDir, "scaffolding.json"))
  ).toString();
  const content = JSON.parse(file);
  return {
    baseUri: templatesDir,
    templates: content,
  };
}
