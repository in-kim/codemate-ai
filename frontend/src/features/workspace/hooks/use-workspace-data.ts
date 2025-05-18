import { getJoinMyWorkspace, getJoinMyWorkspaceResponse } from "@/shared/lib/services/workspace.service";
import { HttpResponse } from "@/shared/types/response";
import { useEffect, useState } from "react";

interface UseWorkspaceDataReturn {
  workspaces: getJoinMyWorkspaceResponse[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export default function useWorkspaceData(userId: string): UseWorkspaceDataReturn {
  const [workspaces, setWorkspaces] = useState<getJoinMyWorkspaceResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkspaces = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getJoinMyWorkspace(userId);
      const isHttpResponse = (res: unknown): res is HttpResponse<getJoinMyWorkspaceResponse[]> => {
        return typeof res === 'object' && res !== null && 'status' in res;
      };
      
      if (isHttpResponse(response) && response.status === 'success') {
        setWorkspaces(response.data);
      } else {
        throw new Error(typeof response === 'string' ? response : '응답 형식이 올바르지 않습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWorkspaces();
    }
  }, [userId]);

  return {
    workspaces,
    loading,
    error,
    refetch: fetchWorkspaces
  };
}

