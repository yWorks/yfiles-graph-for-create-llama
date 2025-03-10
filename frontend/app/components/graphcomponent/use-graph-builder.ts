import {
  FilteredGraphWrapper,
  GraphBuilder,
  GraphComponent,
  IGraph,
} from "@yfiles/yfiles";
import { useEffect, useMemo } from "react";
import { LayoutSupport } from "./LayoutSupport";

function createGraphBuilder(graph: IGraph, data: any) {
  const graphBuilder = new GraphBuilder(graph);
  const nodesSource = graphBuilder.createNodesSource({
    // Stores the nodes of the graph
    data: data.nodes as any,
    id: "id",
  });
  const edgesSource = graphBuilder.createEdgesSource({
    // Stores the edges of the graph
    data: data.edges as any,
    sourceId: "start",
    targetId: "end",
  });

  nodesSource.nodeCreator.createLabelBinding((nodeData: any) => nodeData.label);
  edgesSource.edgeCreator.createLabelBinding((edgeData: any) => edgeData.label);

  return { graphBuilder, nodesSource, edgesSource };
}

export function useGraphBuilder(
  graphComponent: GraphComponent,
  data: any,
  layoutSupport: LayoutSupport,
) {
  const { graphBuilder, nodesSource, edgesSource } = useMemo(() => {
    return createGraphBuilder(
      (graphComponent.graph as FilteredGraphWrapper).wrappedGraph!,
      data,
    );
  }, [graphComponent]);

  useEffect(() => {
    graphBuilder.setData(nodesSource, data.nodes);
    graphBuilder.setData(edgesSource, data.edges);
    graphBuilder.updateGraph();
    layoutSupport.scheduleLayout();
  }, [graphComponent, graphBuilder, nodesSource, edgesSource, layoutSupport]);
}
