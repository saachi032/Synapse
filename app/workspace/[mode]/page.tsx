"use client";

import type { ComponentType } from "react";
import { useParams } from "next/navigation";
import {
  SummaryWorkspacePanel,
  FlashcardsWorkspacePanel,
  QuizWorkspacePanel,
  AskWorkspacePanel,
  TopicsWorkspacePanel,
  ExplainWorkspacePanel,
  ResourcesWorkspacePanel,
} from "@/components/workspace/WorkspacePanels";

const panels: Record<string, ComponentType> = {
  summary: SummaryWorkspacePanel,
  flashcards: FlashcardsWorkspacePanel,
  quiz: QuizWorkspacePanel,
  ask: AskWorkspacePanel,
  topics: TopicsWorkspacePanel,
  explain: ExplainWorkspacePanel,
  resources: ResourcesWorkspacePanel,
};

export default function WorkspaceModePage() {
  const params = useParams();
  const mode = typeof params.mode === "string" ? params.mode : "";
  const Panel = panels[mode];

  if (!Panel) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-lg text-gray-300">Unknown workspace tool.</p>
      </div>
    );
  }

  return <Panel />;
}
