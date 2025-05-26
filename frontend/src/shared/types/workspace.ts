import { IWorkspace } from "../lib/services/workspace.service";
import { IStatus } from "./common";
import { User } from "./user";

export type WorkspaceDataResult = {
  status: IStatus;
  userInfo?: User;
  workspaces?: IWorkspace[];
  workspaceId?: string;
  message?: string;
  isRedirect?: boolean;
};