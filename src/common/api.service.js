import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/common/jwt.service";
import { API_URL } from "@/common/config";

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = API_URL;
  },

  setHeader() {
    Vue.axios.defaults.headers.common[
      "Authorization"
    ] = `Token ${JwtService.getToken()}`;
  },

  query(resource, params) {
    return Vue.axios.get(resource, params).catch(error => {
      throw new Error(`[TOPONAVO] ApiService ${error}`);
    });
  },

  get(resource, slug = "") {
    return Vue.axios.get(`${resource}/${slug}`).catch(error => {
      throw new Error(`[TOPONAVO] ApiService ${error}`);
    });
  },

  post(resource, params) {
    return Vue.axios.post(`${resource}`, params);
  },

  update(resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params);
  },

  put(resource, params) {
    return Vue.axios.put(`${resource}`, params);
  },

  delete(resource) {
    return Vue.axios.delete(resource).catch(error => {
      throw new Error(`[TOPONAVO] ApiService ${error}`);
    });
  }
};

export default ApiService;

export const MapsService = {
  query(type, params) {
    return ApiService.query("maps" + (type === "feed" ? "/feed" : ""), {
      params: params
    });
  },
  get(slug) {
    return ApiService.get("maps", slug);
  },
  create(params) {
    return ApiService.post("maps", { map: params });
  },
  update(slug, params) {
    return ApiService.update("maps", slug, { map: params });
  },
  destroy(slug) {
    return ApiService.delete(`maps/${slug}`);
  }
};

export const FavoriteService = {
  add(slug) {
    return ApiService.post(`maps/${slug}/favorite`);
  },
  remove(slug) {
    return ApiService.delete(`maps/${slug}/favorite`);
  }
};
