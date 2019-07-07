export interface ApiErrorResponse {
  errorMessage?: string;
  response: Response;
}

const isObject = (item: any): boolean => !!item && typeof item === 'object';
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

let baseUrl: string = process.env.BASE_URL || "";
let baseApiPath: string = "";
export const setBaseApiPath = (path: string) => baseApiPath = path;

const buildUrl = (path: string): string => `${baseUrl}${baseApiPath}${path}`;
const parseQueryParams = (params: { [key: string]: any }) => 
  Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

export const makeRequest = (
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", 
  path: string, 
  params?: { [key: string]: any }
) => {
  let body: string;
  let url: string = buildUrl(path);
  if (params) {
    if (["GET", "DELETE"].includes(method)) {
      url += `?${parseQueryParams(params)}`;
    } else {
      body = JSON.stringify(params);
    }
  }

  return window.fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
    },
    method,
    body
  }).catch((response: Response) => handleError(response));
};

const getCookie = (name: string): string => {
  if (!document.cookie) {
    return null;
  }
  const xsrfCookies = document.cookie.split(';')
    .map(c => c.trim())
    .filter(c => c.startsWith(name + '='));

  if (xsrfCookies.length === 0) {
    return null;
  }
  return decodeURIComponent(xsrfCookies[0].split('=')[1]);
};
