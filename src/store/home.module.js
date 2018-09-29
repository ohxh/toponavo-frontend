import { MapsService } from "@/common/api.service";
import { FETCH_MAPS } from "./actions.type";
import { FETCH_START, FETCH_END, UPDATE_MAP_IN_LIST } from "./mutations.type";

const state = {
  maps: [],
  isLoading: true,
  mapsCount: 0
};

const getters = {
  mapsCount(state) {
    return state.mapsCount;
  },
  maps(state) {
    return state.maps;
  },
  isLoading(state) {
    return state.isLoading;
  }
};

const actions = {
  [FETCH_MAPS]({ commit }, params) {
    commit(FETCH_START);
    return MapsService.query(params.type, params.filters)
      .then(({ data }) => {
        commit(FETCH_END, data);
      })
      .catch(error => {
        throw new Error(error);
      });
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [FETCH_START](state) {
    state.isLoading = true;
  },
  [FETCH_END](state, { maps, mapsCount }) {
    state.maps = maps;
    state.mapsCount = mapsCount;
    state.isLoading = false;
  },
  [UPDATE_MAP_IN_LIST](state, data) {
    state.maps = state.maps.map(map => {
      if (map.slug !== data.slug) {
        return map;
      }
      // We could just return data, but it seems dangerous to
      // mix the results of different api calls, so we
      // protect ourselves by copying the information.
      map.favorited = data.favorited;
      map.favoritesCount = data.favoritesCount;
      return map;
    });
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
