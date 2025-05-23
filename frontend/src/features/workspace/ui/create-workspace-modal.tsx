
import { FormModal } from "@/shared/ui/form-modal/form-modal";
import { CreateWorkspaceModalProps, useCreateWorkspace } from "../hooks/use-create-workspace";

export function CreateWorkspaceModal({ callbackSubmit, callbackCloseModal }: CreateWorkspaceModalProps) {
  const formProps = useCreateWorkspace({ callbackSubmit, callbackCloseModal });
  
  return <FormModal {...formProps} />;
}