import { useAuthStore } from "@/shared/store/auth-store";
import { useWorkspaceStore } from "@/shared/store/workspace-store";
import { useEffect } from "react";
import { IWorkspace } from "@/shared/lib/services/workspace.service";
import { User } from "@/shared/types/user";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/shared/store/loading-store";
import { useShallow } from "zustand/shallow";
import { getCode } from "@/shared/lib/services/code.service";
import { useEditorStore } from "@/shared/store/editor-store";
import { isHttpResponseSuccess } from "@/shared/lib/utils";

export interface ClientComponentProps {
  workspaces: IWorkspace[];
  selectedWorkspaceId: string;
  userInfo: User | null;
  isRedirect?: boolean;
}

export default function useWorkspace({ workspaces, selectedWorkspaceId, userInfo, isRedirect }: ClientComponentProps) {
  const router = useRouter();
  const { setUser } = useAuthStore(
    useShallow((state) => ({
      setUser: state.setUser
    }))
  );
  const { addWorkspace, selectWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      addWorkspace: state.addWorkspace,
      selectWorkspace: state.selectWorkspace
    }))
  );
  const { isLoading, startLoading, stopLoading } = useLoadingStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      startLoading: state.startLoading,
      stopLoading: state.stopLoading
    }))
  );

  const { setCode, setLanguage } = useEditorStore(
    useShallow((state) => ({
      setCode: state.setCode,
      setLanguage: state.setLanguage
    }))
  )

  const getCodeInfo = async () => {
    try {
      startLoading();
      const response = await getCode(selectedWorkspaceId);

      if(isHttpResponseSuccess(response)) {
        console.log('code', response)
        setCode(response.data.content) 
        setLanguage(response.data.language)
      }
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  }

  const getReviewHistory = async () => {
    
  }

  const getExecutionHistory = async () => {
    
  }

  /**
   * userInfo가 변경되면 setUser를 호출하여 userInfo를 저장
   */
  useEffect(() => {
    if(userInfo) setUser(userInfo);
  },[setUser, userInfo]);

  /**
   * workspaces와 selectedWorkspaceId가 변경되면 addWorkspace와 selectWorkspace를 호출하여 workspaces와 selectedWorkspaceId를 저장
   */
  useEffect(() => {
    addWorkspace(workspaces)
    selectWorkspace(selectedWorkspaceId)
  }, [addWorkspace, selectWorkspace, workspaces, selectedWorkspaceId])

  /**
   * 컴포넌트 마운트 시 fetchAllData를 호출하여 코드 정보, 리뷰 히스토리, 실행 히스토리를 가져옴
   */
  useEffect(() => {
    const fetchAllData = async () => {
      try{
        startLoading();
        await Promise.all([
          getCodeInfo(),
          getReviewHistory(),
          getExecutionHistory()
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        stopLoading();
      }
    };
    fetchAllData();
  },[startLoading, stopLoading]);

  /**
   * isRedirect가 변경되면 selectedWorkspaceId로 이동
   */
  useEffect(() => {
    if (isRedirect) {
      router.replace(`/workspace/${selectedWorkspaceId}`);
    }
  }, [router, selectedWorkspaceId, isRedirect]);

  return {
    isLoading,
  }
}