export type HttpResponse<T> = {
  message: string;
  status: string;
  data: T;
};