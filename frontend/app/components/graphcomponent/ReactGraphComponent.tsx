import { useHighlightStyles } from "@/app/components/graphcomponent/use-highlight-styles";
import { useInputMode } from "@/app/components/graphcomponent/use-input-mode";
import { useMemo } from "react";
import { SourceNode } from "../ui/chat";
import { LayoutSupport } from "./LayoutSupport";
import "./ReactGraphComponent.css";
import { useGraphBuilder } from "./use-graph-builder";
import { useGraphComponent } from "./use-graph-component";

export function ReactGraphComponent({
  graphData,
  currentSources,
}: {
  graphData: any;
  currentSources: SourceNode[];
}) {
  // get hold of the GraphComponent
  const { graphComponent, graphComponentContainer, visibleNodeList } =
    useGraphComponent();

  // update graph arrangement on data changes
  const layoutSupport = useMemo(
    () => new LayoutSupport(graphComponent),
    [graphComponent],
  );

  // build initial graph
  useGraphBuilder(graphComponent, graphData, layoutSupport);

  // register interaction
  useInputMode(graphComponent, visibleNodeList, layoutSupport);

  // listen for data changes
  useHighlightStyles(
    graphComponent,
    currentSources,
    visibleNodeList,
    layoutSupport,
  );

  return (
    <>
      <div
        className="graph-component-container"
        style={{ width: "100%", height: "100%" }}
        ref={graphComponentContainer}
      />
    </>
  );
}
