import Vue from "vue";
import { MapsService, FavoriteService } from "@/common/api.service";
import {
  FETCH_MAP,
  FAVORITE_ADD,
  FAVORITE_REMOVE,
  MAP_PUBLISH,
  MAP_EDIT,
  MAP_DELETE,
  MAP_RESET_STATE
} from "./actions.type";
import { RESET_STATE, SET_MAP, UPDATE_MAP_IN_LIST } from "./mutations.type";

const initialState = {
  map: {
    author: {},
    title: "",
    description: "",
    body: ""
  }
};

export const state = Object.assign({}, initialState);

export const actions = {
  [FETCH_MAP](context, mapSlug, prevMap) {
    // avoid extronuous network call if map exists
    if (prevMap !== undefined) {
      return context.commit(SET_MAP, prevMap);
    }
    return MapsService.get(mapSlug).then(({ data }) => {
      context.commit(SET_MAP, data.map);
      return data;
    });
  },
  [FAVORITE_ADD](context, payload) {
    return FavoriteService.add(payload).then(({ data }) => {
      // Update list as well. This allows us to favorite an map in the Home view.
      context.commit(UPDATE_MAP_IN_LIST, data.map, { root: true });
      context.commit(SET_MAP, data.map);
    });
  },
  [FAVORITE_REMOVE](context, payload) {
    return FavoriteService.remove(payload).then(({ data }) => {
      // Update list as well. This allows us to favorite an map in the Home view.
      context.commit(UPDATE_MAP_IN_LIST, data.map, { root: true });
      context.commit(SET_MAP, data.map);
    });
  },
  [MAP_PUBLISH]({ state }) {
    return MapsService.create(state.map);
  },
  [MAP_DELETE](context, slug) {
    return MapsService.destroy(slug);
  },
  [MAP_EDIT]({ state }) {
    return MapsService.update(state.map.slug, state.map);
  },
  [MAP_RESET_STATE]({ commit }) {
    commit(RESET_STATE);
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_MAP](state, map) {
    state.map = map;
  },
  [RESET_STATE]() {
    for (let f in state) {
      Vue.set(state, f, initialState[f]);
    }
  }
};

const getters = {
  map(state) {
    return state.map;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
