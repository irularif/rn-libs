import axios, { AxiosRequestConfig } from "axios";
import get from "lodash.get";

export interface IAPI extends AxiosRequestConfig {
  onError?: (res: any) => void;
}

const Axios = axios.create({
  transformResponse: [
    function transformResponse(data, headers) {
      let res = data;
      try {
        res = JSON.parse(res);
      } catch (error) {
        console.log(error, res);
      }
      return res;
    },
  ],
});

const api = async (e: IAPI) => {
  let url = e.url;
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...get(e, "headers", {}),
  };
  let onError: any;
  if (e.onError) {
    onError = e.onError;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const res = await Axios({ ...e, url, headers });
      if (res.status >= 200 && res.status < 300) {
        if (!!res.data) resolve(res.data);
        else resolve(res);
      } else {
        let error = res;
        if (res.data) error = res.data;
        onError(error);
        resolve(error);
      }
    } catch (e) {
      if (onError) {
        let error = e.response;
        if (e.response && e.response.data) error = e.response.data;
        onError(error);
        resolve(error);
      } else {
        if (e.response && e.response.data) resolve(e.response.data);
        else resolve(e.response);
      }
    }
  });
};

export default api;
