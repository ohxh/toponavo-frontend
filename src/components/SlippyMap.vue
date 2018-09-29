<template>
<div>
   <div style="height: calc(100vh - 40px)" >
    <l-map ref="leafletMap" style="height: 100%;" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    </l-map>
<div class="map-info-button" @click="openMapInfo"></div>
    <div class="toponavo-sidebar" :class="{'open' : mapInfoOpen}">
      <b-button-close @click="closeMapInfo"></b-button-close>
      <h3>{{ this.value.title }}</h3>
       {{ this.value.description}}
       <p>
      <router-link target="_blank" :to="{ name: 'about'}">
        About Toponavo / Help
      </router-link>
      </p>
  </div>
  <div class="toponavo-sidebar" :class="{'open' : inspectorOpen}">
      <b-button-close @click="closeInspector"></b-button-close>
      <h3>Inspector</h3>
      <p> description </p>
      Hellloooo!
      
  </div>
  </div>
  </div>
</template>
<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import L from "leaflet";
import "leaflet-draw";

export default {
  name: "ToponavoMapEdit",
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  props: ["value", "canEdit"],
  data() {
    return {
      annotationLayer: null,
      tagInput: null,
      inProgress: false,
      errors: {},
      mapInfoOpen: false,
      inspectorOpen: false,
      zoom: 13,
      center: L.latLng(47.41322, -1.219482),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    };
  },

  methods: {
    registerChanges() {
      var output = new L.featureGroup();

      this.annotationLayer.eachLayer(function(layer) {
        output.addLayer(layer);
      });
      console.log("built output");
      this.value.body = JSON.stringify(output.toGeoJSON());
      console.log("about to emit");
      this.$emit("input", this.value);
      console.log("emitted");
      console.log(this.value.body);
      //#TODO: Avoid copying the map on every change
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
    },
    clearAnnotations: function() {
      var leafletMap = this.$refs.leafletMap.mapObject;
      this.annotationLayer.eachLayer(function(layer) {
        leafletMap.removeLayer(layer);
      });
    },
    resetView: function() {
      this.$refs.leafletMap.mapObject.fitBounds(
        this.annotationLayer.getBounds()
      );
    },
    zoomIn: function() {
      this.$refs.leafletMap.mapObject.zoomIn();
    },
    zoomOut: function() {
      this.$refs.leafletMap.mapObject.zoomOut();
    },
    reload: function() {
      alert("reloading");
      this.$nextTick(
        this.$nextTick(() => {
          var leafletMap = this.$refs.leafletMap.mapObject;

          this.annotationLayer.eachLayer(function(layer) {
            leafletMap.removeLayer(layer);
          });

          var input;
          alert(input);
          try {
            input = L.geoJson(JSON.parse(this.value.body));
          } catch (e) {
            console.log("Failed to parse JSON");
            input = L.geoJson();
          }

          input.eachLayer(function(layer) {
            editableLayers.addLayer(layer);
          });
        })
      );
    },
    setUp: function() {
      console.log("next tick");
      var leafletMap = this.$refs.leafletMap.mapObject;
      var editableLayers = new L.FeatureGroup();
      this.annotationLayer = editableLayers;
      leafletMap.addLayer(editableLayers);
      var input;
      try {
        input = L.geoJson(JSON.parse(this.value.body));
      } catch (e) {
        console.log("Failed to parse JSON");
        input = L.geoJson();
      }

      input.eachLayer(function(layer) {
        editableLayers.addLayer(layer);
      });

      let self = this;

      editableLayers.on("click", function(e) {
        self.openInspector(e);
        console.log(e);
      });

      var drawPluginOptions = {
        position: "topright",
        draw: {
          polyline: {
            shapeOptions: {
              color: "#455A64",
              weight: 10
            }
          },
          polygon: {
            shapeOptions: {
              stroke: true,
              color: "#455a84",
              weight: 4,
              opacity: 0.5,
              fillOpacity: 0.2,
              clickable: true
            }
          },
          circle: false, // Turns off this drawing tool
          rectangle: {
            shapeOptions: {
              clickable: false
            }
          }
        },
        edit: {
          featureGroup: editableLayers, //REQUIRED!!
          remove: true,
          removeAllLayers: true
        }
      };

      if (this.canEdit) {
        var drawControl = new L.Control.Draw(drawPluginOptions);
        leafletMap.addControl(drawControl);

        leafletMap.on("draw:created", function(e) {
          var type = e.layerType,
            layer = e.layer;
          editableLayers.addLayer(layer);
        });

        leafletMap.on("draw:created", self.registerChanges);
        leafletMap.on("draw:edited", self.registerChanges);
        leafletMap.on("draw:deleted", self.registerChanges);
      }
    }
  },
  mounted() {
    console.log("mounted");
    this.$nextTick(this.setUp);
  }
};
</script>