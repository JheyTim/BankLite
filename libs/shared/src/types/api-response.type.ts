// Standard successful API response shape.
// Every successful HTTP response will be wrapped in this format.
export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
  meta: {
    timestamp: string;
    path: string;
    correlationId: string | null;
  };
};

// Standard error API response shape.
// Every handled or unhandled HTTP error will be formatted like this.
export type ApiErrorResponse = {
  success: false;
  error: {
    statusCode: number;
    message: string | string[];
    code: string;
    path: string;
    method: string;
    correlationId: string | null;
    timestamp: string;
  };
};
