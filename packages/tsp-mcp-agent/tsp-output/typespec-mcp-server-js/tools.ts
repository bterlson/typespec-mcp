import { InitOptions } from "./ts-types.js";

interface Tools {
  /**
   * Teach the agent how to use typespec.
   * **Call this tool before trying to generate TypeSpec code.**
   * An area can be specified to learn about a specific work stream with typespec(e.g. MCP, Rest API, etc.)
   **/
  learnTypeSpec(area?: "mcp"): string;

  /**
   * Init a typespec project in the given directory.
   **/
  init(options: InitOptions): Promise<string>;
}

export let toolHandler: Tools = undefined as any;

export function setToolHandler(handler: Tools) {
  toolHandler = handler;
}