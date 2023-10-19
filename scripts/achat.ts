import readline from "readline/promises";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import { RunnableSequence } from "langchain/schema/runnable";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

console.log("achat");

const tools = [new Calculator(), new SerpAPI()];
const llm = new ChatOpenAI({
  modelName: "gpt-4-0613",
  temperature: 0.8,
});
const memory = new BufferMemory({
  returnMessages: true,
});
const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: "openai-functions",
  verbose: true,
});

const chain = RunnableSequence.from<{ input: string }, { output: string }>([
  {
    input: (initialInput) => initialInput.input,
    history: () => memory.loadMemoryVariables({}).history,
  },
  executor,
]);

const stdio = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
while (true) {
  const input = await stdio.question("😀> ");
  if (input.toLowerCase() === "quit" || input.toLowerCase() === "exit") {
    break;
  } else if (input.length) {
    const chainInput = { input };
    const output = await chain.invoke(chainInput);
    await memory.saveContext(chainInput, output);
    console.log(`🦫 ${typeof output}>`, output);
  }
}
stdio.close();
