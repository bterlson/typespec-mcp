

interface Tools {
  /**
   * Teach the agent how to use typespec.
   * An area can be specified to learn about a specific work stream with typespec(e.g. MCP, Rest API, etc.)
   **/
  learnTypeSpec(area?: "MCP"): string;

  /**
   * Init a typespec project in the given directory.
   **/
  init(outDir: string, template: string): Promise<string>;
}

export let toolHandler: Tools = undefined as any;

export function setToolHandler(handler: Tools) {
  toolHandler = handler;
}