import { handleError } from "./handleError";


class CoreApiClient {
  public baseUrl: string;

  private buildUrl = (path: string): string => `${this.baseUrl}/api${path}`;
  private parseQueryParams = (params: { [key: string]: any }) => 
  Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

  private makeRequest = (
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", 
    path: string, 
    params?: { [key: string]: any }
  ) => {
    let body: string;
    let url: string = this.buildUrl(path);
    if (params) {
      if (["GET", "DELETE"].includes(method)) {
        url += `?${this.parseQueryParams(params)}`;
      } else {
        body = JSON.stringify(params);
      }
    }

    return window.fetch(url, {
      method,
      body
    });
  }

  
  public getMembers = async (id: string) => {
    return this.makeRequest("GET", "/members/{id}".replace("{id}", id))
    .then(async (response: Response) => {
      const res = response.clone();
      return {
        ...res,
        data: await res.json()
      };
    })
    .catch((response: Response) => handleError(response));
  }
}

export default CoreApiClient;
