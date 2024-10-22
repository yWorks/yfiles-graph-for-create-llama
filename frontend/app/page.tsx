"use client"
import Header from "@/app/components/header";
import ChatSection from "./components/chat-section";
import KnowledgeGraph from "./components/knowledge_graph";
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { SourceNodesProvider } from "./components/graphcomponent/get-data";


export default function Home() {
  return (
    <SourceNodesProvider>
      <main className="h-screen w-screen flex justify-center items-center background-gradient">
        <div className="space-y-2 lg:space-y-10 w-[90%] lg:w-[60rem]">
          <Header />
          <div className="h-[65vh] flex">
            <ChatSection />
            <div className="w-[70%] w-full ml-4 bg-white rounded-xl shadow-xl">
              {/* Add your content for the new div here */}
              {/*<div style={{ width: "100%", height: "80%" }}
                className="flex-1 w-full rounded-xl bg-white shadow-xl relative overflow-y-auto">*/}
              <KnowledgeGraph />
            </div>
          </div>
        </div>
      </main>
    </SourceNodesProvider >
  );
}