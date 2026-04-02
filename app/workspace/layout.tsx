import { SiteHeader } from "@/components/SiteHeader";
import { WorkspaceSubnav } from "@/components/WorkspaceSubnav";
import { WorkspaceGate } from "@/components/workspace/WorkspaceGate";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen font-sans text-white antialiased">
      <SiteHeader />
      <div className="flex w-full gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <WorkspaceSubnav />
        <div className="min-w-0 flex-1">
          <WorkspaceGate>{children}</WorkspaceGate>
        </div>
      </div>
    </div>
  );
}
