
import { FormModal } from "@/shared/ui/form-modal/form-modal";
import { useCreateWorkspace } from "../hooks/use-create-workspace";

export function CreateWorkspaceModal() {
  const formProps = useCreateWorkspace();
  
  return <FormModal {...formProps} />;
}