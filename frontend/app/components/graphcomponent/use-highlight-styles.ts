import { LayoutSupport } from "@/app/components/graphcomponent/LayoutSupport";
import { SourceNode } from "@/app/components/ui/chat";
import {
  Arrow,
  FilteredGraphWrapper,
  GraphComponent,
  PolylineEdgeStyle,
  ShapeNodeStyle,
} from "@yfiles/yfiles";
import { useEffect } from "react";

const relatedEdgeStyle = new PolylineEdgeStyle({
  smoothingLength: 25,
  stroke: "1px #3f3f3f",
  targetArrow: new Arrow({
    fill: "#3f3f3f",
    type: "triangle",
  }),
});

const unrelatedEdgeStyle = new PolylineEdgeStyle({
  smoothingLength: 25,
  stroke: "1px #bcbcbc",
  targetArrow: new Arrow({
    fill: "#bcbcbc",
    type: "triangle",
  }),
});

function extractImportantWords(text: string): string[] {
  const nameRegex = /facts extracted from the text:\s*([a-zA-Z\s]+)/;
  const arrowRegex = /->\s*([a-zA-Z\s]+)/g;

  const Words: string[] = [];

  const nameMatch = text.match(nameRegex);
  if (nameMatch && nameMatch[1]) {
    Words.push(nameMatch[1].trim());
  }

  let arrowMatch;
  while ((arrowMatch = arrowRegex.exec(text)) !== null) {
    if (arrowMatch[1]) {
      Words.push(arrowMatch[1].trim());
    }
  }

  return Words;
}

export function useHighlightStyles(
  graphComponent: GraphComponent,
  currentSources: SourceNode[],
  visibleNodeList: string[],
  layoutSupport: LayoutSupport,
) {
  useEffect(() => {
    if (currentSources.length !== 0) {
      const currentIds = currentSources
        .flatMap((source) => extractImportantWords(source.text))
        .map((source) => source.toLowerCase());
      const filteredGraph = graphComponent.graph as FilteredGraphWrapper;
      const completeGraph = filteredGraph.wrappedGraph!;

      for (const node of completeGraph.nodes.toArray()) {
        const baseClass = "node";

        const style = node.style as ShapeNodeStyle;
        style.cssClass = baseClass;

        const nodeLabel = node.tag.label;
        if (currentIds.includes(nodeLabel.toLowerCase())) {
          style.cssClass = `${baseClass} highlight`;
          visibleNodeList.push(nodeLabel);

          const neighbors = completeGraph.neighbors(node).toArray();
          for (const neighbor of neighbors) {
            const neighborLabel = neighbor.tag.label;
            if (!visibleNodeList.includes(neighborLabel)) {
              visibleNodeList.push(neighborLabel);
            }
          }
        }
      }

      for (const edge of completeGraph.edges.toArray()) {
        if (
          currentIds.includes(edge.tag.start.toString()) ||
          currentIds.includes(edge.tag.end.toString())
        ) {
          filteredGraph.setStyle(edge, relatedEdgeStyle);
        } else {
          filteredGraph.setStyle(edge, unrelatedEdgeStyle);
        }
      }

      filteredGraph.nodePredicateChanged();
      layoutSupport.scheduleLayout();
    }
  }, [currentSources]);
}
