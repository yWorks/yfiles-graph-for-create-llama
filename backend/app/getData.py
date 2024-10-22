from app.engine.index import get_index


def get_knowledge_graph_info(params=None):
    index = get_index()
    nodes = index.property_graph_store.graph.nodes
    edges = index.property_graph_store.graph.triplets
    return {'nodes': create_node_list(nodes), 'edges': create_edge_list(edges)}
    

def create_node_list(nodes):
    result = []
    for node in nodes:
            try:
                value = nodes[node] 
                result.append({'id': node, 'label': node})#, 'properties': {value['properties']}})
            except:
                continue
    return result

def create_edge_list(edges):
    result = []
    for edge in edges: 
        result.append({
                'id': edge[1],
                'start': edge[0],
                'end': edge[2],
                'label': edge[1],
            })
    return result