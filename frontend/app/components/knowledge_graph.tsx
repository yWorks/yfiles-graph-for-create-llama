"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useClientConfig } from "./ui/chat/hooks/use-config";
import { ReactGraphComponent } from "./graphcomponent/ReactGraphComponent";
import { useSourceNodes } from "./graphcomponent/get-data";

export default function KnowledgeGraph() {
    const { backend } = useClientConfig();
    const { nodes } = useSourceNodes();
    const [knowledgeGraph, setKnowledgeGraph] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKnowledgeGraph = async () => {
            try {
                const response = await axios.get(`${backend}/api/knowledge_graph/knowledge-graph`);
                console.log("Response:", response.data);
                setKnowledgeGraph(response.data.graph_info);
            } catch (err) {
                setError("Failed to fetch knowledge graph info.");
            } finally {
                setLoading(false);
            }
        };

        fetchKnowledgeGraph();
    }, [backend]);
    return (
        <div className="bg-white rounded-xl" style={{ width: "100%", height: "100%" }}>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <ReactGraphComponent
                    graphData={knowledgeGraph}
                    currentSources={nodes}
                />
            )}
        </div>
    );
}
