import { setToolHandler } from "../tsp-output/typespec-mcp-server-js/tools.js";
import { server } from "../tsp-output/typespec-mcp-server-js/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFile } from "fs/promises";
import { join, resolve } from "path";

const projectRoot = resolve(import.meta.dirname, "..", "..");
const instructions = (
  await readFile(join(projectRoot, "assets", "instructions", "mcp.md"))
).toString();

setToolHandler({
  learnTypeSpec(area) {
    console.log("Value", area);
    return instructions;
  },
  init() {
    console.log("Init");
    return instructions;
  },
});

const transport = new StdioServerTransport();
await server.connect(transport);
