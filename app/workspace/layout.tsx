import { SiteHeader } from "@/components/SiteHeader";
import { WorkspaceSubnav } from "@/components/WorkspaceSubnav";
import { WorkspaceGate } from "@/components/workspace/WorkspaceGate";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b12] via-[#070712] to-black font-sans text-white antialiased">
      <SiteHeader />
      <WorkspaceSubnav />
      <WorkspaceGate>{children}</WorkspaceGate>
    </div>
  );
}
