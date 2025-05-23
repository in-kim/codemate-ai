import { useAuthStore } from "@/shared/store/auth-store";
import { useWorkspaceStore } from "@/shared/store/workspace-store";
import { useEffect, useState } from "react";
import { getJoinMyWorkspaceResponse } from "@/shared/lib/services/workspace.service";
import { User } from "@/shared/types/user";

export interface ClientComponentProps {
  workspaces: getJoinMyWorkspaceResponse[];
  selectedWorkspaceId: string | null;
  userInfo: User | null
}

export default function useWorkspace({ workspaces, selectedWorkspaceId, userInfo }: ClientComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuthStore();
  const { addWorkspace, selectWorkspace } = useWorkspaceStore();

  const getCollaborators = async () => {
    
  }

  const getCodeInfo = async () => {
    
  }

  const getReviewHistory = async () => {
    
  }

  const getExecutionHistory = async () => {
    
  }

  useEffect(() => {
    if(userInfo) setUser(userInfo);
  },[setUser, userInfo]);

  useEffect(() => {
    addWorkspace(workspaces)
    selectWorkspace(selectedWorkspaceId || workspaces[0].workSpaceId)
  }, [addWorkspace, selectWorkspace, workspaces, selectedWorkspaceId])

  useEffect(() => {
    const fetchAllData = async () => {
      try{
        setIsLoading(true);
        await Promise.all([
          getCollaborators(),
          getCodeInfo(),
          getReviewHistory(),
          getExecutionHistory()
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  },[]);

  return {
    isLoading,
  }
}