<template>
  <div>
    <toponavo-header>
      <view-toolbar :title="map.title"></view-toolbar>
    </toponavo-header>
    <slippy-map v-model="this.map" :canEdit="false"></slippy-map>
  </div>
</template>

<script>
import ViewToolbar from "@/components/ViewToolbar";
import ToponavoHeader from "@/components/ToponavoHeader";
import { mapGetters } from "vuex";
import marked from "marked";
import store from "@/store";
import ToponavoMapMeta from "@/components/MapMeta";
import { FETCH_MAP } from "@/store/actions.type";
import SlippyMap from "@/components/SlippyMap";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import L from "leaflet";
import "leaflet-draw";

export default {
  name: "toponavo-map",
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      mapInfoOpen: false,
      inspectorOpen: false,
      zoom: 13,
      center: L.latLng(47.41322, -1.219482),
      url:
        "http://basemap.nationalmap.gov/ArcGIS/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(47.41322, -1.219482)
    };
  },
  components: {
    ToponavoMapMeta,
    SlippyMap,
    ToponavoHeader,
    ViewToolbar
  },
  methods: {
    parseMarkdown(content) {
      return marked(content);
    },
    openMapInfo: function() {
      this.mapInfoOpen = true;
      this.inspectorOpen = false;
    },
    closeMapInfo: function() {
      this.mapInfoOpen = false;
    },
    openInspector: function() {
      this.inspectorOpen = true;
      this.mapInfoOpen = false;
    },
    closeInspector: function() {
      this.inspectorOpen = false;
    }
  },
  beforeRouteEnter(to, from, next) {
    Promise.all([store.dispatch(FETCH_MAP, to.params.slug)]).then(data => {
      next();
    });
  },
  computed: {
    ...mapGetters(["map", "currentUser", "isAuthenticated"])
  },
  mounted() {}
};
</script>
