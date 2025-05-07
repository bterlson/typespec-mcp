import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { parseTemplate } from "url-template";
import { server } from "../tsp-output/typespec-mcp-server-js/index.js";
import { setToolHandler } from "../tsp-output/typespec-mcp-server-js/tools.js";

setToolHandler({
  async getRepository(owner, repo) {
    const template = parseTemplate("https://api.github.com/repos/{owner}/{repo}");
    const url = template.expand({ owner, repo });
    const res = await fetch(url);
    return res.json();
  },
});

const transport = new StdioServerTransport();
await server.connect(transport);
