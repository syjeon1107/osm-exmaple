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
import {osmLoader} from "@/js/map";

export default defineComponent({
  setup(){
    //onmounted
    onMounted(()=>{
      osmLoader()
    });
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

