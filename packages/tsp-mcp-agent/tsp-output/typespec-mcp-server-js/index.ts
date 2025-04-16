import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { learnTypeSpecParameters, initParameters, learnTypeSpecReturnType, initReturnType } from "./types.js";
import { fromZodError } from "zod-validation-error";
import { toolHandler } from "./tools.js";

export const server = new Server(
  {
    name: "My MCP Server",
    version: "1.0.0",
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
          name: "learnTypeSpec",
          description: "Teach the agent how to use typespec.\nAn area can be specified to learn about a specific work stream with typespec(e.g. MCP, Rest API, etc.)",
          inputSchema: zodToJsonSchema(
            learnTypeSpecParameters,
            {
              $refStrategy: "none",
            }
          ),
        },
        {
          name: "init",
          description: "Init a typespec project in the given directory.",
          inputSchema: zodToJsonSchema(
            initParameters,
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
      case "learnTypeSpec": {
        const parsed = learnTypeSpecParameters.safeParse(args);
        if (!parsed.success) {
          throw fromZodError(parsed.error, { prefix: "Request validation error" });
        }
        const rawResult = toolHandler.learnTypeSpec(parsed.data.area);
        const maybeResult = learnTypeSpecReturnType.safeParse(rawResult);
        if (!maybeResult.success) {
          throw fromZodError(maybeResult.error, { prefix: "Response validation error"});
        };
        const result = maybeResult.data;
        return {
          content: [
            {
              type: "text",
              text: result,
            }
          ],
        };
      }

      case "init": {
        const parsed = initParameters.safeParse(args);
        if (!parsed.success) {
          throw fromZodError(parsed.error, { prefix: "Request validation error" });
        }
        const rawResult = await toolHandler.init(parsed.data.options);
        const maybeResult = initReturnType.safeParse(rawResult);
        if (!maybeResult.success) {
          throw fromZodError(maybeResult.error, { prefix: "Response validation error"});
        };
        const result = maybeResult.data;
        return {
          content: [
            {
              type: "text",
              text: result,
            }
          ],
        };
      }
    };
    return { content: [{ type: "text", text: "Unknown tool" }] };
  }
)