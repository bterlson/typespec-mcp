import "typespec-mcp";
using MCP;

alias LearnArea = "MCP";

/**
 * Teach the agent how to use typespec.
 * An area can be specified to learn about a specific work stream with typespec(e.g. MCP, Rest API, etc.)
 **/
@tool op learnTypeSpec(area?: LearnArea): string;

/**
 * Init a typespec project in the given directory.
 * 
 * @param outDir - The absolute path to the directory to create the typespec project in.
 */
@tool op `init`(outDir: string, template: string): string;
