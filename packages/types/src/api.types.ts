/**
 * Standard API response wrapper for success
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
}

/**
 * Standard API response wrapper for error
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string;
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * API response for delete operations
 */
export interface ApiDeleteResponse {
  success: true;
  message: string;
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>,
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is error
 */
export function isErrorResponse(
  response: ApiResponse,
): response is ApiErrorResponse {
  return response.success === false;
}
