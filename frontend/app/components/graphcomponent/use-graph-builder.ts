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
import { FilteredGraphWrapper, GraphBuilder, GraphComponent, IEdge, IGraph, ShapeNodeStyle } from 'yfiles'
import { LayoutSupport } from './LayoutSupport'
import { useEffect, useMemo } from 'react'

function createGraphBuilder(graph: IGraph, data: any) {
  const graphBuilder = new GraphBuilder(graph)
  const nodesSource = graphBuilder.createNodesSource({
    // Stores the nodes of the graph
    data: data.nodes as any,
    id: 'id',
  })
  const edgesSource = graphBuilder.createEdgesSource({
    // Stores the edges of the graph
    data: data.edges as any,
    sourceId: 'start',
    targetId: 'end'
  })

  nodesSource.nodeCreator.createLabelBinding((node: any) => node.label)
  edgesSource.edgeCreator.createLabelBinding((edge: any) => edge.label)

  // Define a utility method that resolves a node's id to the name of the node
  const idToName = (id: number) => graphBuilder.getNodeById(id)?.tag.name

  return { graphBuilder, nodesSource, edgesSource }
}

export function useGraphBuilder(
  graphComponent: GraphComponent,
  data: any,
  layoutSupport: LayoutSupport
) {
  const { graphBuilder, nodesSource, edgesSource } = useMemo(
    () => {
      return createGraphBuilder((graphComponent.graph as FilteredGraphWrapper).wrappedGraph!, data)

    },
    [graphComponent]

  )

  useEffect(() => {
    graphBuilder.setData(nodesSource, data.nodes)
    graphBuilder.setData(edgesSource, data.edges)
    graphBuilder.updateGraph()
    layoutSupport.scheduleLayout()

  }, [graphComponent, graphBuilder, nodesSource, edgesSource, layoutSupport])
}
