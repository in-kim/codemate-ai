import { useAuthStore } from "@/shared/store/auth-store";
import { useWorkspaceStore } from "@/shared/store/workspace-store";
import { useEffect, useCallback } from "react";
import { IWorkspace } from "@/shared/lib/services/workspace.service";
import { User } from "@/shared/types/user";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/shared/store/loading-store";
import { useShallow } from "zustand/shallow";
import { getCode, getExecuteHistory, getReviewHistory } from "@/shared/lib/services/code.service";
import { useEditorStore } from "@/shared/store/editor-store";
import { isHttpResponseSuccess } from "@/shared/lib/utils";
import { useExecutionStore } from "@/shared/store/execution-store";
import { IGetExecuteHistoryData, IReviewResponse } from "@/shared/types/code";
import { useReviewStore } from "@/shared/store/review-store";

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

  const { codeId, setCode, setCodeId, setLanguage } = useEditorStore(
    useShallow((state) => ({
      codeId: state.codeId,
      setCode: state.setCode,
      setCodeId: state.setCodeId,
      setLanguage: state.setLanguage
    }))
  )

  const { putExecution } = useExecutionStore(
    useShallow((state) => ({
      putExecution: state.putExecution
    }))
  );

  const { putReviewHistory } = useReviewStore(
    useShallow((state) => ({
      putReviewHistory: state.putReviewHistory
    }))
  );

  const getCodeInfo = useCallback(async () => {
    try {
      startLoading();
      const response = await getCode(selectedWorkspaceId);

      if(isHttpResponseSuccess(response)) {
        console.log('code', response)
        setCode(response.data.content) 
        setLanguage(response.data.language)
        setCodeId(response.data._id)
      }
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  }, [startLoading, selectedWorkspaceId, setCode, setLanguage, setCodeId, stopLoading]);

  const fetchReviewHistory = useCallback(async (codeId: string) => {
    if (!codeId) return;

    try {
      startLoading();
      const response = await getReviewHistory(codeId);

      if(isHttpResponseSuccess(response)) {
        console.log('reviewHistory', response)
        putReviewHistory(response.data as IReviewResponse[])
      }
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  }, [putReviewHistory, startLoading, stopLoading]);

  const fetchExecutionHistory = useCallback(async () => {
    if (!codeId) return;
    
    try {
      startLoading();
      const response = await getExecuteHistory(codeId);

      if(isHttpResponseSuccess(response)) {
        console.log('executeHistory', response)
        putExecution(response.data as IGetExecuteHistoryData[])
      }
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  }, [codeId, startLoading, stopLoading, putExecution]);

  /**
   * userInfo가 변경되면 setUser를 호출하여 userInfo를 저장
   */
  useEffect(() => {
    if(userInfo) setUser(userInfo);
  },[setUser, userInfo]);

  /**
   * 컴포넌트 마운트 시 fetchAllData를 호출하여 코드 정보, 리뷰 히스토리, 실행 히스토리를 가져옴
   */
  useEffect(() => {
    const fetchAllData = async () => {
      try{
        startLoading();
        await getCodeInfo();
        await Promise.all([
          fetchReviewHistory(codeId),
          fetchExecutionHistory()
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        stopLoading();
      }
    };
    fetchAllData();
  },[codeId, getCodeInfo, fetchExecutionHistory, fetchReviewHistory, startLoading, stopLoading]);

   /**
   * workspaces와 selectedWorkspaceId가 변경되면 addWorkspace와 selectWorkspace를 호출하여 workspaces와 selectedWorkspaceId를 저장
   */
   useEffect(() => {
    addWorkspace(workspaces)
    selectWorkspace(selectedWorkspaceId)
  }, [addWorkspace, selectWorkspace, workspaces, selectedWorkspaceId])

  /**
   * isRedirect가 변경되면 selectedWorkspaceId로 이동
   */
  useEffect(() => {
    const fetchCodeData = async () => {
      await getCodeInfo();
      await fetchExecutionHistory();
    }

    if (isRedirect) {
      router.replace(`/workspace/${selectedWorkspaceId}`);

      fetchCodeData();
    }
  }, [router, selectedWorkspaceId, isRedirect, getCodeInfo, fetchExecutionHistory]);

  return {
    isLoading,
  }
}