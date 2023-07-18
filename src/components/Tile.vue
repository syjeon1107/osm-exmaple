<template>
  <v-app id="inspire">
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="7">
            <v-card height="600">
              <!-- 지도 -->
              <div id="map"></div>
              <!-- 지도 end -->
              <!-- 팝업 -->
              <div id="popup" class="ol-popup">
                <a href="#" id="popup-closer" class="ol-popup-closer"></a>
                <div id="popup-content"></div>
              </div>
              <!-- 팝업 end -->
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue';
import {Feature, Map, Overlay, View} from 'ol'
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import {fromLonLat, toLonLat} from "ol/proj";
import {Point} from "ol/geom";
import {Fill, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";
import TextStyle from "ol/style/Text";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {toStringHDMS} from "ol/coordinate";

export default defineComponent({
  setup(){
    //onmounted
    onMounted(()=>{
      osmLoader()
    });
    const osmLoader = () =>{
      // marker font color
      const textFill = new Fill({
        color: '#FFF',
      });

      // large marker
      const innerCircle = new CircleStyle({
        radius: 14,
        fill: new Fill({
          color: [0,255,255,0.7],
        }),
      });

      // small marker
      const outerCircle = new CircleStyle({
        radius: 20,
        fill: new Fill({
          color: [0,255,255,0.3],
        }),
      });

      // marker style
      const styles = [
        new Style({
          image: outerCircle
        }),
        new Style({
          image: innerCircle,
          text: new TextStyle({
            text: '1',
            scale: 1.3,
            fill: textFill,
          })
        })
      ];

      //marker
      const marker1 = new Feature({
        geometry: new Point(fromLonLat([126.89986357412153, 37.51439687834425])),
      });
      const marker2 = new Feature({
        geometry: new Point(fromLonLat([126.89936357412153, 37.51459687834425])),
      });

      // test setId
      marker1.setId('marker01');
      marker2.setId('marker02');

      // marker add to vectorSource,
      const vectorSource = new VectorSource({
        features: [ marker1, marker2 ],
      });

      // vectorSource add to vectorLayer
      const vectorLayer = new VectorLayer({
        source : vectorSource,
        style: styles,
      });

      //instance TileLayer
      const tileLayer = new TileLayer({
        source: new OSM({url : 'http://localhost:8282/tile/{z}/{x}/{y}.png', crossOrigin: null}),
      });

      //instance View
      const view = new View({
        center:fromLonLat([126.89986357412153, 37.51439687834425]),
        zoom: 18,
      });

      //instance Map
      const map = new Map({
        target : 'map',
        layers : [tileLayer,vectorLayer],
        view : view,
      });

      //marker popup
      const popup = document.getElementById('popup') as HTMLElement | null;
      const content = document.getElementById('popup-content') as HTMLElement | null;
      const closer = document.getElementById('popup-closer') as HTMLElement | null;

      /**
       * instance overlay
       * https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html
       */
      const overlay = new Overlay({
        id: 'popup',
        element: popup || undefined,
        positioning: 'center-center',
        autoPan: {
          animation: {
            duration: 250
          }
        }
      });

      //overlay add to map
      map.addOverlay(overlay);

      /**
       * ol/Map
       * https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html#hasFeatureAtPixel
       */
      map.on('singleclick',(e) =>{
        /**
         * 해당픽셀에 객체가 있으면,
         * https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html#hasFeatureAtPixel
         */
        if(map.hasFeatureAtPixel(e.pixel)){
          /**
           * https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html#forEachFeatureAtPixel
           */
          map.forEachFeatureAtPixel(e.pixel, feature =>{
            console.log("feature", feature);
            const geom = feature.getGeometry();
            if(geom){
              // const [ minX, minY, maxX, maxY ] = geom.getExtent();
              const coordinate = e.coordinate;
              //https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html#.toStringHDMS
              const hdms = toStringHDMS(toLonLat(coordinate));
              content.innerHTML = `<ul>
                                    <li>${feature.getId() || ''}</li>
                                    <li>${hdms || 'NULL'}</li>
                                 </ul>`
              // overlay.setPosition([ (maxX + minX) / 2, (maxY + minY) / 2 ]);
              overlay.setPosition(coordinate);
            }
          });
        }else{
            overlay.setPosition(undefined);
        }
      });

      map.on('pointermove', (e) => map.getViewport().style.cursor = map.hasFeatureAtPixel(e.pixel) ? 'pointer' : '');

      //popup closed
      closer.onclick = () =>{
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      }
    }
  },
  computed: {},
});
</script>

<style>
html,
body {
  margin: 0;
  height: 100%;
}

#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 600px;
  filter: invert(80%)
}

.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}
.ol-popup:after, .ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}


</style>

