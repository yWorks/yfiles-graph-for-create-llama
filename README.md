![image](/recources/image.png)

This is a [LlamaIndex](https://www.llamaindex.ai/) project bootstrapped with [`create-llama`](https://github.com/run-llama/LlamaIndexTS/tree/main/packages/create-llama).

## yFiles Integration for Knowledge Graph Exploration


This integration with yFiles then allows you to visualize the specific nodes involved in generating answers within a knowledge graph. You can easily identify which nodes contribute to an answer and further explore the graph by expanding neighboring nodes for a broader context.

### Understand How LlamaIndex Constructs Answers

With this tool, you can gain deeper insights into how LlamaIndex processes information. It showcases the data from source nodes used to create a final answer. By visualizing the flow from source nodes to answers, you can better understand the logic behind the results and interactively explore the connections in the knowledge graph.



## Getting Started

Before beginning the project, ensure you add your agent specifications to a .env file located in the backend folder.


First, startup the backend as described in the [backend README](./backend/README.md).

Second, run the development server of the frontend as described in the [frontend README](./frontend/README.md).

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To view a graph, submit a question related to the files you have uploaded.
To expand a node, simply double-click on it. A node will only expand if there are hidden neighboring nodes available to reveal.

## Learn More

To learn more about LlamaIndex, take a look at the following resources:

- [LlamaIndex Documentation](https://docs.llamaindex.ai) - learn about LlamaIndex (Python features).
- [LlamaIndexTS Documentation](https://ts.llamaindex.ai) - learn about LlamaIndex (Typescript features).

You can check out [the LlamaIndexTS GitHub repository](https://github.com/run-llama/LlamaIndexTS) - your feedback and contributions are welcome!
