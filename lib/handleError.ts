
export interface ApiErrorResponse {
  errorMessage?: string;
  response: Response;
}

export const isApiErrorResponse = (response: any): response is ApiErrorResponse => {
  return isObject(response) && response.errorMessage;
}

const defaultMessage = "Unknown Error.  Contact an administrator";
export const handleError = (e: any): ApiErrorResponse => {
  const apiErrorResponse: ApiErrorResponse = {
    response: e.response,
    errorMessage: defaultMessage,
  }

  if (typeof e === 'string') {
    console.error(`API Error Recieved: ${e}`);
  } else if (isObject(e) && isObject(e.response)) {
    try {
      const { response: { data: error } } = e;
      if (isObject(error) && (error.message || error.error)) {
        apiErrorResponse.errorMessage = error.message || error.error;
      }
    } catch (parseError) {
      console.error(`Error handling API Error: ${parseError}`);
    }
  }

  return apiErrorResponse;
};

const isObject = (item: any): boolean => !!item && typeof item === 'object';