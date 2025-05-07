import { setToolHandler } from "../tsp-output/typespec-mcp-server-js/tools.js";
import { server } from "../tsp-output/typespec-mcp-server-js/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { parseTemplate } from "url-template";

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
