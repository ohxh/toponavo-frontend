<template>
  <div>
    <div style="height: calc(100vh - 40px)">
      <l-map ref="leafletMap" style="height: 100%;" :zoom="zoom" :center="center">
      </l-map>
      <div class="map-info-button" @click="openMapInfo"></div>
      <div class="toponavo-sidebar" :class="{'open' : mapInfoOpen}">
        <b-button-close @click="closeMapInfo"></b-button-close>
        <h3 style="margin-top: 10px;">{{ this.value.title }}</h3>
        {{ this.value.description}}
        <br>
        <p>
          <router-link target="_blank" :to="{ name: 'about'}">
            About Toponavo / Help
          </router-link>
        </p>
      </div>
      <div class="toponavo-sidebar" :class="{'open' : inspectorOpen}">
        <b-button-close @click="closeInspector"></b-button-close>
        <input id="inspector-element-name" onChange="" />
        <div id='elevation-graph' style="height:200px;position:relative; margin-top: 30px; margin-left: 0; margin-right: 20px;"></div>
        <h6 id="inspector-element-body" style="margin: 10px"> description </h6>
        <div id="style-selector">
          <input type="radio" name="color" value="#ff5722" class="orange">
          <input type="radio" name="color" value="#ffc107" class="amber">
          <input type="radio" name="color" value="#8bc34a" class="lime">
          <input type="radio" name="color" value="#009688" class="teal">
          <input type="radio" name="color" value="#2196f3" class="blue">
          <input type="radio" name="color" value="#3f51b5" class="indigo">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import L from "leaflet";
import "leaflet-draw";
import "leaflet.layerscontrol-minimap";
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
      zoom: 12,
      center: L.latLng(46.8531, -121.7591),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    };
  },
  methods: {
    registerChanges() {
      function drawnItemsToGeoJSON(ilayer) {
        var dOut = "";
        var dOut1 = "";
        var dOut2 = "";
        var ditems = ilayer.getLayers();
        dOut = '{"type":"FeatureCollection","features":[';
        for (var iIndex = 0; iIndex < ditems.length; ++iIndex) {
          if (
            ditems[iIndex] instanceof L.Point ||
            ditems[iIndex] instanceof L.Marker
          ) {
            dOut1 = dOut1 + ',{"type":"Feature","properties":{';
            dOut1 =
              dOut1 +
              '},"geometry":{"type":"Point","coordinates":[' +
              ditems[iIndex]._latlng.lng +
              "," +
              ditems[iIndex]._latlng.lat +
              "]}}";
          } else if (ditems[iIndex] instanceof L.Polygon) {
            dOut1 = dOut1 + ',{"type":"Feature","properties":{';
            if (ditems[iIndex].properties) {
              dOut1 += '"name": ' + '"' + ditems[iIndex].properties.name + '",';
              dOut1 +=
                '"color": ' + '"' + ditems[iIndex].properties.color + '"';
            }

            dOut1 += '},"geometry":{"type":"Polygon","coordinates":[[';
            dOut2 = "";
            for (var ll = 0; ll < ditems[iIndex]._latlngs[0].length; ll++) {
              dOut2 =
                dOut2 +
                ",[" +
                ditems[iIndex]._latlngs[0][ll].lng +
                "," +
                ditems[iIndex]._latlngs[0][ll].lat +
                "]";
            }
            dOut2 =
              dOut2 +
              ",[" +
              ditems[iIndex]._latlngs[0][0].lng +
              "," +
              ditems[iIndex]._latlngs[0][0].lat +
              "]";
            dOut1 = dOut1 + dOut2.substring(1) + "]]}";
            dOut1 = dOut1 + "}";
          } else if (ditems[iIndex] instanceof L.Polyline) {
            dOut1 = dOut1 + ',{"type":"Feature","properties":{';

            if (ditems[iIndex].properties) {
              dOut1 += '"name": ' + '"' + ditems[iIndex].properties.name + '",';
              dOut1 +=
                '"color": ' + '"' + ditems[iIndex].properties.color + '"';
            }

            dOut1 += '},"geometry":{"type":"LineString","coordinates":[';
            dOut2 = "";
            for (var ll = 0; ll < ditems[iIndex]._latlngs.length; ll++) {
              dOut2 =
                dOut2 +
                ",[" +
                ditems[iIndex]._latlngs[ll].lng +
                "," +
                ditems[iIndex]._latlngs[ll].lat +
                "]";
            }
            dOut1 = dOut1 + dOut2.substring(1) + "]}";
            dOut1 = dOut1 + "}";
          }
        }
        return dOut + dOut1.substring(1) + "]}";
      }

      var output = new L.featureGroup();
      this.annotationLayer.eachLayer(function(layer) {
        output.addLayer(layer);
      });
      //this.value.body = JSON.stringify(output.toGeoJSON());
      this.value.body = drawnItemsToGeoJSON(output);
      this.$emit("input", this.value);
      //#TODO: Avoid copying the map on every change
    },
    openMapInfo: function() {
      this.mapInfoOpen = true;
      this.inspectorOpen = false;
    },
    closeMapInfo: function() {
      this.mapInfoOpen = false;
    },
    openInspector: function(e) {
      console.log(this.value.body);
      this.inspectorOpen = true;
      this.mapInfoOpen = false;
      var nameField = document.getElementById("inspector-element-name");
      var bodyP = document.getElementById("inspector-element-body");
      bodyP.innerHTML = "";
      console.log(e);
      //Determine the type of element selected
      var elementType = null;
      if (e.layer._latlngs) {
        if (Array.isArray(e.layer._latlngs[0])) {
          elementType = "polygon";
        } else {
          elementType = "line";
        }
      } else {
        if (e.layer._mRadius) {
          elementType = "circle";
        } else {
          elementType = "marker";
        }
      }
      if (!e.layer.properties) {
        e.layer.properties = {};
      }
      if (!e.layer.properties.name) {
        e.layer.properties.name = "Unnamed " + elementType;
      }
      if (!e.layer.properties.color) {
        e.layer.properties.color = "#2196f3"; //default color
      }
      let self = this;
      function setColor() {
        e.layer.properties.color = this.value;
        e.layer.options.color = this.value;
        e.layer.setStyle({ color: this.value });
        self.registerChanges();
      }
      function setName() {
        e.layer.properties.name = nameField.value;
        self.registerChanges();
      }

      nameField.value = e.layer.properties.name;
      nameField.onchange = setName;

      var colorSelectors = Array.from(
        document.getElementById("style-selector").children
      );
      colorSelectors.forEach(element => {
        element.onchange = setColor;
      });

      function plotElevation(elevations, status) {
        if (elevations) {
          var arr = [["Distance", "Height"]];
          var length = 0;
          for (var i = 1; i < e.layer._latlngs.length; i++) {
            length += e.layer._latlngs[i - 1].distanceTo(e.layer._latlngs[i]);
          }
          for (var i = 0; i < elevations.length; i++) {
            arr.push([i * length / 256, elevations[i].elevation]);
          }
          var graphInput = [
            {
              type: "matrix",
              data: arr
            }
          ];
          console.log(graphInput);
          picasso.chart({
            element: document.querySelector("#elevation-graph"),
            data: graphInput,
            settings: {
              scales: {
                y: {
                  data: {
                    field: "Height"
                  },
                  invert: true
                },
                t: {
                  data: {
                    extract: {
                      field: "Distance"
                    }
                  }
                }
              },
              components: [
                {
                  type: "axis",
                  dock: "left",
                  scale: "y",
                  invert: "true",
                  formatter: {
                    type: "d3-number",
                    format: ".1r"
                  }
                },
                {
                  type: "axis",
                  dock: "bottom",
                  scale: "t",
                  formatter: {
                    type: "d3-number",
                    format: ".1r"
                  }
                },
                {
                  key: "lines",
                  type: "line",
                  data: {
                    extract: {
                      field: "Distance",
                      props: {
                        v: {
                          field: "Height"
                        }
                      }
                    }
                  },
                  settings: {
                    coordinates: {
                      major: {
                        scale: "t"
                      },
                      minor: {
                        scale: "y",
                        ref: "v"
                      }
                    },
                    layers: {
                      line: {}
                    }
                  }
                }
              ]
            }
          });
        }
      }
      document.querySelector("#elevation-graph").style.display = "none";
      switch (elementType) {
        case "polygon":
          break;
        case "line":
          document.querySelector("#elevation-graph").style.display = "block";
          var length = 0;
          for (var i = 1; i < e.layer._latlngs.length; i++) {
            length += e.layer._latlngs[i - 1].distanceTo(e.layer._latlngs[i]);
          }
          bodyP.innerHTML += "length: " + Math.round(length) + "m";
          var elevator = new google.maps.ElevationService();
          elevator.getElevationAlongPath(
            {
              path: e.layer._latlngs,
              samples: 256
            },
            plotElevation
          );
          break;
        case "circle":
          bodyP.innerHTML =
            e.layer._latlng.lat +
            " / " +
            e.layer._latlng.lng +
            " radius: " +
            e.layer._mRadius;
          break;
        case "marker":
          bodyP.innerHTML = e.layer._latlng.lat + " / " + e.layer._latlng.lng;
          break;
      }
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
            input = L.geoJson(JSON.parse(this.value.body), {
              style: function(feature) {
                return { color: feature.properties.color };
              }
            });
          } catch (e) {
            console.log("Failed to parse JSON");
            alert(this.value.body);

            input = L.geoJson();
          }
          input.eachLayer(function(layer) {
            editableLayers.addLayer(layer);
          });
        })
      );
    },
    setUp: function() {
      var leafletMap = this.$refs.leafletMap.mapObject;
      var editableLayers = new L.FeatureGroup();
      this.annotationLayer = editableLayers;
      leafletMap.addLayer(editableLayers);
      var input;
      try {
        input = L.geoJson(JSON.parse(this.value.body), {
          style: function(feature) {
            return { color: feature.properties.color };
          },
          onEachFeature: function(feature, layer) {
            if (feature.properties) {
              layer.properties = feature.properties;
            }
          }
        });
      } catch (e) {
        console.log("Failed to parse JSON");
        input = L.geoJson();
      }
      var attribution =
        '<a href="https://www.doi.gov">U.S. Department of the Interior</a> | <a href="https://www.usgs.gov">U.S. Geological Survey</a> | <a href="https://www.usgs.gov/laws/policies_notices.html">Policies</a>';
      var tnmUrl =
        "https://basemap.nationalmap.gov/ArcGIS/rest/services/{id}/MapServer/tile/{z}/{y}/{x}";
      var slopeUrl = "http://ctslope.s3.amazonaws.com/relief/{z}/{x}/{y}.png";
      var noaaUrl = "tileservice.charts.noaa.gov/tiles/50000_1/{z}/{x}/{y}.png";
      var USGSImageryOnly = L.tileLayer(tnmUrl, {
          id: "USGSImageryOnly",
          attribution: attribution
        }),
        USGSImageryTopo = L.tileLayer(tnmUrl, {
          id: "USGSImageryTopo",
          attribution: attribution
        }),
        USGSTNMBlank = L.tileLayer(tnmUrl, {
          id: "USGSTNMBlank",
          attribution: attribution
        }),
        USGSHydroCached = L.tileLayer(tnmUrl, {
          id: "USGSHydroCached",
          attribution: attribution
        }),
        USGSTopo = L.tileLayer(tnmUrl, {
          id: "USGSTopo",
          attribution: attribution
        }),
        USGSShadedReliefOnly = L.tileLayer(tnmUrl, {
          id: "USGSShadedReliefOnly",
          attribution: attribution
        }),
        CalTopoSlope = L.tileLayer(slopeUrl, {
          attribution: attribution,
          opacity: 0.3
        });
      // Group the base layers
      var baseLayers = {
        Topographic: USGSTopo,
        "Satelite and Topographic": USGSImageryTopo,
        Satelite: USGSImageryOnly,
        "Shaded Relief": USGSShadedReliefOnly
        //"Hydrology" : USGSHydroCached,
        //"Blank" : USGSTNMBlank
      };
      var overLays = {
        "Slope Angle": CalTopoSlope
      };
      var controlLayers = L.control.layers.minimap(baseLayers, overLays, {
        position: "topright"
      });
      USGSTopo.addTo(leafletMap);
      controlLayers.addTo(leafletMap);
      input.eachLayer(function(layer) {
        editableLayers.addLayer(layer);
      });
      let self = this;
      editableLayers.on("click", function(e) {
        self.openInspector(e);
      });
      var drawPluginOptions = {
        position: "bottomright",
        draw: {
          polyline: {
            shapeOptions: {
              color: "#2196f3",
              weight: 5,
              opacity: 0.5
            }
          },
          polygon: {
            shapeOptions: {
              stroke: true,
              color: "#2196f3",
              weight: 5,
              opacity: 0.5,
              fillOpacity: 0.2
            }
          },
          marker: false,
          circle: false,
          rectangle: {
            shapeOptions: {
              color: "#2196f3",
              weight: 5,
              opacity: 0.5,
              fillOpacity: 0.2
            }
          },
          circlemarker: false
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
      this.resetView();
    }
  },
  mounted() {
    this.$nextTick(this.setUp);
  }
};
</script>