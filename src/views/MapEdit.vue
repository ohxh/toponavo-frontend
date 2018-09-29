<template>
<div>
  <toponavo-header>
    <b-navbar-nav class="navbar-center"> 
    <b-nav-text> Editing&nbsp;<b v-if="map.title">{{ map.title}}</b><span v-else>an unnamed map</span>&nbsp;</b-nav-text>
    <b-nav-item-dropdown text="File" right>
        <b-dropdown-item v-on:click="onPublish(map.slug, map)">Save (ctrl + s)</b-dropdown-item>
        <b-dropdown-item href="#">Make a copy</b-dropdown-item>
        <b-dropdown-item href="#">Import annotations</b-dropdown-item>
        <b-dropdown-item href="#">Export annotations</b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item-dropdown text="Edit" right>
        <b-dropdown-item v-on:click="onPublish(map.slug, map)">Save (ctrl + s)</b-dropdown-item>
        <b-dropdown-item v-on:click="$refs.slippyMap.clearAnnotations()">Clear annotations</b-dropdown-item>
        <b-dropdown-item href="#">Import annotations</b-dropdown-item>
        <b-dropdown-item href="#">Export annotations</b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item-dropdown text="View" right>
        <b-dropdown-item v-on:click="$refs.slippyMap.resetView()">Reset view</b-dropdown-item>
        <b-dropdown-item v-on:click="$refs.slippyMap.zoomIn()">Zoom in</b-dropdown-item>
        <b-dropdown-item v-on:click="$refs.slippyMap.zoomOut()">Zoom out</b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item-dropdown text="Output" right>
        <b-dropdown-item href="#">Share a link</b-dropdown-item>
        <b-dropdown-item href="#">Print...</b-dropdown-item>
        <b-dropdown-item href="#">Export annotations</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </toponavo-header>
   <slippy-map :value="map" :canEdit="true" ref="slippyMap"></slippy-map>

<b-modal id="modalPrevent"
             ref="nameModal"
             title="Give your map a name"
             @ok="onPublish(map.slug, map)"
          >
      <form>
        <b-form-input type="text"
                      placeholder="Name"
                      v-model="map.title"></b-form-input>
                      <br>
                      <b-form-textarea :rows="3"
                      placeholder="Description (optional)"
                      v-model="map.description"></b-form-textarea>
      </form>
    </b-modal>

  </div>
</template>
<script>
import ToponavoHeader from "@/components/ToponavoHeader";
import { mapGetters } from "vuex";
import store from "@/store";
import ToponavoListErrors from "@/components/ListErrors";
import {
  MAP_PUBLISH,
  MAP_EDIT,
  FETCH_MAP,
  MAP_RESET_STATE
} from "@/store/actions.type";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import L from "leaflet";
import "leaflet-draw";
import SlippyMap from "@/components/SlippyMap";

export default {
  name: "ToponavoMapEdit",
  components: {
    ToponavoHeader,
    ToponavoListErrors,
    LMap,
    LTileLayer,
    LMarker,
    SlippyMap
  },
  props: {
    previousMap: {
      type: Object,
      required: false
    }
  },
  async beforeRouteUpdate(to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    //await store.dispatch(MAP_RESET_STATE);
    alert("this is the reload...");
    location.reload(); //#TODO: Figure out how to load data without refreshing
    return next();
  },
  async beforeRouteEnter(to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the map
    await store.dispatch(MAP_RESET_STATE);
    if (to.params.slug !== undefined) {
      await store.dispatch(FETCH_MAP, to.params.slug, to.params.previousMap);
    }
    return next();
  },
  async beforeRouteLeave(to, from, next) {
    await store.dispatch(MAP_RESET_STATE);
    next();
  },
  data() {
    return {
      tagInput: null,
      inProgress: false,
      errors: {},
      mapInfoOpen: false,
      inspectorOpen: false,
      zoom: 13,
      center: L.latLng(47.41322, -1.219482),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(47.41322, -1.219482)
    };
  },
  computed: {
    ...mapGetters(["map"])
  },
  methods: {
    onPublish(slug, map) {
      let action = slug ? MAP_EDIT : MAP_PUBLISH;
      console.log(map.title);
      if (map.title == null || map.title == "") {
        this.$refs.nameModal.show();
        return;
      }
      this.inProgress = true;
      this.$store
        .dispatch(action)
        .then(({ data }) => {
          this.inProgress = false;
          /*
          this.$router.push({
            name: 'map',
            params: { slug: data.map.slug }
          })*/
        })
        .catch(({ response }) => {
          this.inProgress = false;
          this.errors = response.data.errors;
        });
    }
  }
};
</script>
