export interface CodeExecutedEvent {
  _id: string;
  userId: string;
  workSpaceId: string;
  code: string;
  language: string;
  result: {
    stdout: string;
    stderr: string;
    exitCode: number;
  };
  timestamp: Date;
}
