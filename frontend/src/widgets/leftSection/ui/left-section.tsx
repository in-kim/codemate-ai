import { CollaborationWrapper } from "@/widgets/collaboration/ui/collaboration-wrapper";
import WorkspaceWrapper from "@/widgets/workspace/ui/workspace-wrapper";

export default function LeftSection() {
  return (
    <div className="flex flex-col h-full">
      <WorkspaceWrapper />
      <CollaborationWrapper />
    </div>
  )
}