import { zodToJsonSchema } from "zod-to-json-schema";
import { fromZodError } from "zod-validation-error";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { toolHandler } from "./tools.js";
import { getRepositoryParameters, getRepositoryReturnType } from "./zod-types.js";

export const server = new Server(
  {
    name: "VectorMCP",
    version: "1.0.0",
    instructions: "Use this MCP server to perform vector operations in 3D space.",
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

server.setRequestHandler(
  ListToolsRequestSchema,
  async function listTools(request) {
    return {
      tools: [
        {
          name: "getRepository",
          description: "Get a GitHub repository by owner and repository name.",
          inputSchema: zodToJsonSchema(
            getRepositoryParameters,
            {
              $refStrategy: "none",
            }
          ),
        }
      ],
    };
  }
)

server.setRequestHandler(
  CallToolRequestSchema,
  async function callTool(request) {
    const name = request.params.name;
    const args = request.params.arguments;
    switch (name) {
      case "getRepository": {
        const parsed = getRepositoryParameters.safeParse(args);
        if (!parsed.success) {
          throw fromZodError(parsed.error, { prefix: "Request validation error" });
        }
        const rawResult = await toolHandler.getRepository(
          parsed.data.owner,
          parsed.data.repo
        );
        const maybeResult = getRepositoryReturnType.safeParse(rawResult);
        if (!maybeResult.success) {
          throw fromZodError(maybeResult.error, { prefix: "Response validation error"});
        };
        const result = maybeResult.data;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            }
          ],
        };
      }
    };
    return { content: [{ type: "text", text: "Unknown tool" }] };
  }
)