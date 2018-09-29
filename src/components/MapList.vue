<template>
  <div>
    <div v-if="isLoading" class="map-card">
      Loading...
    </div>
    <div v-else>
      <div v-if="maps.length === 0" class="map-card">
        Nothing here.
      </div>
      <map-card
        v-for="(map, index) in maps"
        :map="map"
        :key="map.title + index">
      </map-card>
      <v-pagination
        :pages="pages"
        :currentPage.sync="currentPage"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MapCard from "@/components/MapCard";
import VPagination from "@/components/VPagination";
import { FETCH_MAPS } from "@/store/actions.type";

export default {
  name: "toponavo-map-list",
  components: {
    MapCard,
    VPagination
  },
  props: {
    type: {
      type: String,
      required: false,
      default: "all"
    },
    author: {
      type: String,
      required: false
    },
    favorited: {
      type: String,
      required: false
    },
    itemsPerPage: {
      type: Number,
      required: false,
      default: 10
    }
  },
  data() {
    return {
      currentPage: 1
    };
  },
  computed: {
    listConfig() {
      const { type } = this;
      const filters = {
        offset: (this.currentPage - 1) * this.itemsPerPage,
        limit: this.itemsPerPage
      };
      if (this.author) {
        filters.author = this.author;
      }
      if (this.favorited) {
        filters.favorited = this.favorited;
      }
      return {
        type,
        filters
      };
    },
    pages() {
      if (this.isLoading || this.mapsCount <= this.itemsPerPage) {
        return [];
      }
      return [
        ...Array(Math.ceil(this.mapsCount / this.itemsPerPage)).keys()
      ].map(e => e + 1);
    },
    ...mapGetters(["mapsCount", "isLoading", "maps"])
  },
  watch: {
    currentPage(newValue) {
      this.listConfig.filters.offset = (newValue - 1) * this.itemsPerPage;
      this.fetchMaps();
    },
    type() {
      this.resetPagination();
      this.fetchMaps();
    },
    author() {
      this.resetPagination();
      this.fetchMaps();
    },
    favorited() {
      this.resetPagination();
      this.fetchMaps();
    }
  },
  mounted() {
    this.fetchMaps();
  },
  methods: {
    fetchMaps() {
      this.$store.dispatch(FETCH_MAPS, this.listConfig);
    },
    resetPagination() {
      this.listConfig.offset = 0;
      this.currentPage = 1;
    }
  }
};
</script>
