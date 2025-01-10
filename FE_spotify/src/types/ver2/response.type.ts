type SuccessResponse<T> = {
  message: string;
  data: T;
  timestamp: string;
};

export default SuccessResponse;
