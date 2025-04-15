import "typespec-mcp";
using MCP;

alias LearnArea = "MCP";

/**
 * Teach the agent how to use typespec.
 * An area can be specified to learn about a specific work stream with typespec(e.g. MCP, Rest API, etc.)
 **/
@tool op learnTypeSpec(area?: LearnArea): string;

/**
 * Init a typespec project
 */
@tool op `init`(): string;
