import Vue from 'vue'
import Vuex from 'vuex'

import home from './home.module'
import auth from './auth.module'
import map from './map.module'
import profile from './profile.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    home,
    auth,
    map,
    profile
  }
})
