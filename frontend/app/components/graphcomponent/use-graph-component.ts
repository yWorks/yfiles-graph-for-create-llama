import {
  Arrow,
  FilteredGraphWrapper,
  FreeEdgeLabelModel,
  GraphComponent,
  IEdge,
  IGraph,
  INode,
  LabelLayerPolicy,
  LabelStyle,
  License,
  PolylineEdgeStyle,
  ShapeNodeStyle,
} from "@yfiles/yfiles";
import { useLayoutEffect, useMemo, useRef } from "react";
import yFilesLicense from "./license.json";

function configureDefaultStyles(graph: IGraph) {
  graph.nodeDefaults.style = new ShapeNodeStyle({
    cssClass: `node type-${"1"}`,
    shape: "ellipse",
  });
  graph.nodeDefaults.shareStyleInstance = false;
  graph.nodeDefaults.size = [55, 55];
  graph.edgeDefaults.style = new PolylineEdgeStyle({
    smoothingLength: 25,
    targetArrow: new Arrow({
      fill: "#66485B",
      type: "triangle",
    }),
  });
  graph.decorator.nodes.focusRenderer.hide();
  graph.edgeDefaults.shareStyleInstance = false;

  graph.edgeDefaults.labels.style = new LabelStyle({
    backgroundFill: "rgba(255,255,255,0.7)",
    padding: [2, 4],
    shape: "round-rectangle",
  });
  graph.edgeDefaults.labels.layoutParameter =
    FreeEdgeLabelModel.INSTANCE.createParameter();
}

export function useGraphComponent() {
  const graphComponentContainer = useRef<HTMLDivElement>(null);

  const { graphComponent, visibleNodeList } = useMemo(() => {
    License.value = yFilesLicense;

    const gc = new GraphComponent({
      graphModelManager: { edgeLabelLayerPolicy: LabelLayerPolicy.AT_OWNER },
    });

    // specify default styles for newly created nodes and edges
    configureDefaultStyles(gc.graph);

    // show only relevant parts of the graph
    const nodeLabelsToShow: string[] = [];
    gc.graph = new FilteredGraphWrapper(
      gc.graph,
      (node: INode): boolean => nodeLabelsToShow.includes(node.tag.label),
      // show all edges (actually all edges whose source and target is shown).
      (edge: IEdge): true => true,
    );

    return { graphComponent: gc, visibleNodeList: nodeLabelsToShow };
  }, []);

  useLayoutEffect(() => {
    const gcContainer = graphComponentContainer.current!;
    graphComponent.htmlElement.style.width = "100%";
    graphComponent.htmlElement.style.height = "100%";
    gcContainer.appendChild(graphComponent.htmlElement);

    return () => {
      gcContainer.innerHTML = "";
    };
  }, [graphComponentContainer, graphComponent]);

  return { graphComponentContainer, graphComponent, visibleNodeList };
}
