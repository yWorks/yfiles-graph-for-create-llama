import {
  EdgeLabelPreferredPlacement,
  GraphComponent,
  INode,
  LabelAngleReferences,
  LabelEdgeSides,
  LayoutDescriptor,
  LayoutExecutorAsync,
  OrganicLayoutData,
  OrganicScope,
} from "@yfiles/yfiles";

/**
 * Keeps track of layout requests on the graph and makes sure that there is always a clean layout
 * afterward.
 */
export class LayoutSupport {
  private needsLayout = false;
  private isLayoutRunning = false;

  private worker = new Worker(new URL("./WorkerLayout", import.meta.url), {
    type: "module",
  });

  constructor(private readonly graphComponent: GraphComponent) {}

  /**
   * Can be called subsequent times, to schedule layouts without interfering with currently
   * running layouts.
   */
  async scheduleLayout(incrementalNodes: INode[] = []) {
    this.needsLayout = true;
    if (this.isLayoutRunning) {
      return;
    }

    if (this.needsLayout) {
      this.isLayoutRunning = true;

      const layoutData = this.createLayoutData(incrementalNodes);
      const layoutDescriptor = this.createLayoutDescriptor();

      // create an asynchronous layout executor that calculates a layout on the worker
      const executor = new LayoutExecutorAsync({
        messageHandler: LayoutExecutorAsync.createWebWorkerMessageHandler(
          this.worker,
        ),
        graphComponent: this.graphComponent,
        layoutDescriptor,
        layoutData,
        animationDuration: "1s",
        animateViewport: true,
        easedAnimation: true,
      });

      // run the Web Worker layout
      await executor.start();

      this.needsLayout = false;
      this.isLayoutRunning = false;
    }
  }

  /**
   * Creates the object that describes the layout to the Web Worker layout executor.
   * @returns The LayoutDescriptor for this layout
   */
  private createLayoutDescriptor(): LayoutDescriptor {
    return {
      name: "OrganicLayout",
      properties: {
        defaultMinimumNodeDistance: 20,
        nodeLabelPlacement: "consider",
        edgeLabelPlacement: "integrated",
        avoidNodeEdgeOverlap: true,
      },
    };
  }

  /**
   * Creates the layout data that is used to execute the layout.
   */
  private createLayoutData(incrementalNodes: INode[]) {
    const layoutData = new OrganicLayoutData({
      minimumEdgeLengths: (edge) =>
        edge.labels.at(0)?.preferredSize.width ?? 20 * 1.05,
      // Place labels along the edge
      edgeLabelPreferredPlacements: new EdgeLabelPreferredPlacement({
        angleReference: LabelAngleReferences.RELATIVE_TO_EDGE_FLOW,
        angle: 0,
        edgeSide: LabelEdgeSides.ON_EDGE,
      }),
    });
    if (incrementalNodes.length > 0) {
      layoutData.scope.scopeModes = (node) =>
        incrementalNodes.includes(node)
          ? OrganicScope.INCLUDE_CLOSE_NODES
          : OrganicScope.FIXED;
    }
    return layoutData;
  }
}
