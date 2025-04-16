export type Workflow = "mcp" | "rest api" | "rest api with js server" | "rest api with csharp server";

type KnownEmitters = "@typespec/openapi3" | "@typespec/http-client-csharp" | "@typespec/http-client-js" | "@typespec/http-client-python" | "@typespec/http-client-java" | "@typespec/http-client-go" | "typespec-mcp";

interface InitOptions {
  "outDir": string;
  "name"?: string;
  "workflow"?: Workflow;
  "additionalEmitters"?: Array<KnownEmitters | string>;
}

interface Tools {
  /**
   * Teach the agent how to use typespec.
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