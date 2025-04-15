import "typespec-mcp";
using MCP;

alias LearnArea = "mcp";

union BuiltInTemplateNames {
  "rest",
  "mcp",
  "library-ts",
  "emitter-ts",
}

union TemplateOption {
  BuiltInTemplateNames,
  url,
}
/**
 * Teach the agent how to use typespec.
 * An area can be specified to learn about a specific work stream with typespec(e.g. MCP, Rest API, etc.)
 **/
@tool op learnTypeSpec(area?: LearnArea): string;

/**
 * Init a typespec project in the given directory.
 *
 * @param outDir - The absolute path to the directory to create the typespec project in.
 * @param template - The template to use for the typespec project.
 */
@tool op `init`(outDir: string, template?: TemplateOption): string;
