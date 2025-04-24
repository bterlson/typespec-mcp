import { setToolHandler } from "../tsp-output/typespec-mcp-server-js/tools.js";
import { server } from "../tsp-output/typespec-mcp-server-js/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TodoStore } from "./store.js";

const store = new TodoStore();

setToolHandler({
  addTodo: (text) => {
    store.add({ text, status: "todo" });
    return `Added todo: ${text}`;
  },
  listTodos: () => {
    return store.list().filter((x) => x.status === "todo");
  },
});

const transport = new StdioServerTransport();
await server.connect(transport);
