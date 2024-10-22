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
import './ReactGraphComponent.css'
import { useEffect, useMemo } from 'react'
import { Arrow, FilteredGraphWrapper, GraphItemTypes, GraphViewerInputMode, INode, LabelAngleReferences, LabelPlacements, OrganicLayout, OrganicLayoutData, OrganicLayoutScope, PolylineEdgeStyle, PreferredPlacementDescriptor, Rect, Size } from 'yfiles'
import { useGraphComponent } from './use-graph-component'
import { useGraphBuilder } from './use-graph-builder'
import { getOrganicLayout, getOrganicLayoutData, LayoutSupport } from './LayoutSupport'
import { SourceNode } from '../ui/chat'
import React from 'react'


function extractImportantWords(text: string): string[] {
  const nameRegex = /facts extracted from the text:\s*([a-zA-Z\s]+)/
  const arrowRegex = /->\s*([a-zA-Z\s]+)/g

  const Words: string[] = []

  const nameMatch = text.match(nameRegex)
  if (nameMatch && nameMatch[1]) {
    Words.push(nameMatch[1].trim())
  }

  let arrowMatch
  while ((arrowMatch = arrowRegex.exec(text)) !== null) {
    if (arrowMatch[1]) {
      Words.push(arrowMatch[1].trim())
    }
  }

  return Words
}

interface ReactGraphComponentProps {
  graphData: any
}

export function ReactGraphComponent({ graphData, currentSources }: { graphData: any; currentSources: SourceNode[] }) {
  // get hold of the GraphComponent
  const { graphComponent, graphComponentContainer, visibleNodeList } = useGraphComponent()

  const graph = graphComponent.graph
  // update graph on data changes
  const layoutSupport = useMemo(() => new LayoutSupport(graphComponent), [graphComponent])
  useGraphBuilder(graphComponent, graphData, layoutSupport)
  const cssHovering = 'highlight'
  const filteredGraph = graphComponent.graph as FilteredGraphWrapper
  const completeGraph = filteredGraph.wrappedGraph


  const mode = new GraphViewerInputMode({
    clickableItems: GraphItemTypes.NODE
  })

  mode.addItemLeftDoubleClickedListener((_, args) => {
    const node = args.item
    const affectedNodeList: INode[] = []
    if (node instanceof INode) {
      for (const neighbor of completeGraph!.neighbors(node).toArray()) {
        if (!visibleNodeList.includes(neighbor.tag.label)) {
          visibleNodeList.push(neighbor.tag.label)
          completeGraph!.setNodeLayout(neighbor, new Rect(node.layout.center, new Size(node.layout.width, node.layout.height)))
          affectedNodeList.push(neighbor)
        }
      }
      filteredGraph.nodePredicateChanged()
    }

    const layout = getOrganicLayout()
    layout.scope = OrganicLayoutScope.SUBSET

    const layoutData = getOrganicLayoutData()
    layoutData.affectedNodes = affectedNodeList

    graphComponent.morphLayout(layout, '1s', layoutData)
    args.handled = true
  })

  graphComponent.inputMode = mode

  useEffect(() => {


    if (currentSources.length !== 0) {
      const currentIds = currentSources.flatMap(source => extractImportantWords(source.text))
      const filteredGraph = graphComponent.graph as FilteredGraphWrapper
      const completeGraph = filteredGraph.wrappedGraph

      for (const node of completeGraph!.nodes.toArray()) {
        const baseClass = 'node'

        if (currentIds.includes(node.tag.label)) {
          node.style.cssClass = `${baseClass} ${cssHovering}`.trim()
          visibleNodeList.push(node.tag.label)
          const neighbors = completeGraph!.neighbors(node).toArray()
          for (const neighbor of neighbors) {
            if (!visibleNodeList.includes(neighbor.tag.label)) {
              visibleNodeList.push(neighbor.tag.label)
            }
          }
        }
        else {
          node.style.cssClass = baseClass
        }
      }
      for (const edge of completeGraph!.edges.toArray()) {
        if (currentIds.includes(edge.tag.start.toString()) || currentIds.includes(edge.tag.end.toString())) {
          graph.setStyle(edge, new PolylineEdgeStyle({
            smoothingLength: 25,
            stroke: '1px #3f3f3f',
            targetArrow: new Arrow({
              fill: '#3f3f3f',
              type: 'triangle'
            })
          }))
        }
        else {
          graph.setStyle(edge, new PolylineEdgeStyle({
            smoothingLength: 25,
            stroke: '1px #bcbcbc',
            targetArrow: new Arrow({
              fill: '#bcbcbc',
              type: 'triangle'
            })
          }))
        }
      }


      filteredGraph.nodePredicateChanged()
      layoutSupport.scheduleLayout()

    }

  }, [currentSources])

  return (
    <>
      <div
        className="graph-component-container"
        style={{ width: '100%', height: '100%' }}
        ref={graphComponentContainer}
      />
    </>
  )
}
