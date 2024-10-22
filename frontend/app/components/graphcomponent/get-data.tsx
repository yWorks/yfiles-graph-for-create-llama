import { SourceData, SourceNode } from "../ui/chat";

import React, { createContext, useContext, useState, ReactNode } from "react";

type SourceNodesContextType = {
    nodes: SourceNode[];
    setNodes: (nodes: SourceNode[]) => void;
};

const SourceNodesContext = createContext<SourceNodesContextType | undefined>(undefined);

export const useSourceNodes = () => {
    const context = useContext(SourceNodesContext);
    if (!context) {
        throw new Error("useSourceNodes must be used within a SourceNodesProvider");
    }
    return context;
};

export const SourceNodesProvider = ({ children }: { children: ReactNode }) => {
    const [nodes, setNodes] = useState<SourceNode[]>([]);

    const updateNodes = (newNodes: SourceNode[]) => {
        console.log("Updating nodes in context:", newNodes);
        setNodes([...newNodes]);
    };

    return (
        <SourceNodesContext.Provider value={{ nodes, setNodes: updateNodes }}>
            {children}
        </SourceNodesContext.Provider>
    );
};



export function extractSourceNodesData(data: SourceData | null): SourceNode[] {
    if (!data || !data.nodes) return [];

    // Process data to extract source nodes
    return data.nodes;
}


type SourceNodesDisplayProps = {
    nodes: SourceNode[]
};

export function SourceNodesDisplay({ nodes }: SourceNodesDisplayProps) {
    return (
        <div className="bg-white p-4" style={{ width: "100%", height: "100%" }}>
            <h2 className="text-lg font-semibold">Source Nodes:</h2>
            {/* Display the nodes in JSON format */}
            <pre>{JSON.stringify(nodes, null, 2)}</pre>
        </div>
    );
}