/****************************************************************************
 ** @license
 ** This demo file is part of yFiles for HTML 2.6.0.4.
 ** Copyright (c) 2000-2024 by yWorks GmbH, Vor dem Kreuzberg 28,
 ** 72070 Tuebingen, Germany. All rights reserved.
 **
 ** yFiles demo files exhibit yFiles for HTML functionalities. Any redistribution
 ** of demo files in source code or binary form, with or without
 ** modification, is not permitted.
 **
 ** Owners of a valid software license for a yFiles for HTML version that this
 ** demo is shipped with are allowed to use the demo source code as basis
 ** for their own yFiles for HTML powered applications. Use of such programs is
 ** governed by the rights and conditions as set out in the yFiles for HTML
 ** license agreement.
 **
 ** THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESS OR IMPLIED
 ** WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 ** MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
 ** NO EVENT SHALL yWorks BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 ** SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 ** TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 ** PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 ** LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 ** NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 ** SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **
 ***************************************************************************/
import {
  Arrow,
  DefaultLabelStyle,
  EdgePathLabelModel,
  FilteredGraphWrapper,
  FreeEdgeLabelLayoutModel,
  FreeEdgeLabelModel,
  GraphComponent,
  GraphItemTypes,
  GraphViewerInputMode,
  HighlightIndicatorManager,
  IEdge,
  IGraph,
  INode,
  License,
  NodeCreator,
  PolylineEdgeStyle,
  ShapeNodeStyle,
  Size
} from 'yfiles'
import { useLayoutEffect, useMemo, useRef } from 'react'
import yFilesLicense from './license.json'

function configureDefaultStyles(graph: IGraph) {

  const defaultNodeStyle = new ShapeNodeStyle({ cssClass: `node type-${'1'}`, shape: "ellipse" })
  graph.nodeDefaults.style = defaultNodeStyle
  graph.nodeDefaults.shareStyleInstance = false
  graph.nodeDefaults.size = [55, 55]
  graph.edgeDefaults.style = new PolylineEdgeStyle({
    smoothingLength: 25,
    //stroke: '4px #66485B',
    targetArrow: new Arrow({
      fill: '#66485B',
      type: 'triangle'
    })
  })
  graph.decorator.nodeDecorator.focusIndicatorDecorator.hideImplementation()
  graph.edgeDefaults.shareStyleInstance = false

  graph.edgeDefaults.labels.style = new DefaultLabelStyle({
    backgroundFill: 'rgba(255,255,255,0.7)',
    insets: [2, 4],
    shape: 'round-rectangle'
  })
  graph.edgeDefaults.labels.layoutParameter = FreeEdgeLabelModel.INSTANCE.createDefaultParameter()

}

export function useGraphComponent() {
  const graphComponentContainer = useRef<HTMLDivElement>(null)

  const { graphComponent, visibleNodeList } = useMemo(() => {
    // include the yFiles License
    License.value = yFilesLicense
    // initialize the GraphComponent
    const gc = new GraphComponent()
    gc.graphModelManager.edgeLabelLayerPolicy = 'at-owner'
    // register interaction
    gc.inputMode = new GraphViewerInputMode({
      // nodes and labels should be selectable
      selectableItems: GraphItemTypes.NODE | GraphItemTypes.LABEL
    })
    // specify default styles for newly created nodes and edges
    configureDefaultStyles(gc.graph)
    const nodeLabelsToShow: String[] = []
    const wrapper = new FilteredGraphWrapper(
      // the original graph to wrap
      gc.graph,
      // (node: INode): true => true,
      (node: INode): boolean => nodeLabelsToShow.includes(node.tag.label),
      // show all edges (actually all edges whose source and target is shown).
      (edge: IEdge): true => true
    )
    // set the filtered graph as the graph to work on
    gc.graph = wrapper
    gc.horizontalScrollBarPolicy = 'as-needed-dynamic'
    gc.verticalScrollBarPolicy = 'as-needed-dynamic'



    return { graphComponent: gc, visibleNodeList: nodeLabelsToShow }
  }, [])

  useLayoutEffect(() => {
    const gcContainer = graphComponentContainer.current!
    graphComponent.div.style.width = '100%'
    graphComponent.div.style.height = '100%'
    gcContainer.appendChild(graphComponent.div)

    return () => {
      gcContainer.innerHTML = ''
    }
  }, [graphComponentContainer, graphComponent])

  return { graphComponentContainer, graphComponent, visibleNodeList }
}
