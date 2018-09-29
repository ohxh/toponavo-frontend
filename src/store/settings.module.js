import { MapsService, CommentsService } from '@/common/api.service'
import { FETCH_MAP, FETCH_COMMENTS } from './actions.type'
import { SET_MAP, SET_COMMENTS } from './mutations.type'

export const state = {
  map: {},
  comments: []
}

export const actions = {
  [FETCH_MAP] (context, mapSlug) {
    return MapsService.get(mapSlug)
      .then(({ data }) => {
        context.commit(SET_MAP, data.map)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_COMMENTS] (context, mapSlug) {
    return CommentsService.get(mapSlug)
      .then(({ data }) => {
        context.commit(SET_COMMENTS, data.comments)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_MAP] (state, map) {
    state.map = map
  },
  [SET_COMMENTS] (state, comments) {
    state.comments = comments
  }
}

export default {
  state,
  actions,
  mutations
}
