import { FormModal } from "@/shared/ui/form-modal/form-modal";
import { useInviteForm } from "../hooks/use-invite-form";

export function InviteFormModal() {
  const formProps = useInviteForm();
  
  return <FormModal {...formProps} />;
}