import {
  FilteredGraphWrapper,
  GraphComponent,
  GraphItemTypes,
  GraphViewerInputMode,
  INode,
  Rect,
} from "@yfiles/yfiles";
import { useEffect } from "react";
import { LayoutSupport } from "./LayoutSupport";

export function useInputMode(
  graphComponent: GraphComponent,
  visibleNodeList: string[],
  layoutSupport: LayoutSupport,
) {
  useEffect(() => {
    const mode = new GraphViewerInputMode({
      clickableItems: GraphItemTypes.NODE,
    });

    mode.addEventListener("item-left-double-clicked", (args) => {
      const filteredGraph = args.context.graph as FilteredGraphWrapper;
      const completeGraph = filteredGraph.wrappedGraph!;

      const node = args.item;

      const newNeighbors: INode[] = [];
      if (node instanceof INode) {
        const neighbors = completeGraph.neighbors(node).toArray();
        for (const neighbor of neighbors) {
          const label = neighbor.tag.label;
          if (!visibleNodeList.includes(label)) {
            visibleNodeList.push(label);
            completeGraph!.setNodeLayout(
              neighbor,
              new Rect(node.layout.center, node.layout.size),
            );
            newNeighbors.push(neighbor);
          }
        }
        filteredGraph.nodePredicateChanged();
      }

      layoutSupport.scheduleLayout(newNeighbors);
      args.handled = true;
    });

    graphComponent.inputMode = mode;
  }, [graphComponent, layoutSupport]);
}
