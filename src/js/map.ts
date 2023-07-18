import {Fill, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";
import TextStyle from "ol/style/Text";
import {Feature, Map, Overlay, View} from "ol";
import {Point} from "ol/geom";
import {fromLonLat, toLonLat} from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import {toStringHDMS} from "ol/coordinate";
import {Cluster} from "ol/source";
import {boundingExtent} from "ol/extent";

export function osmLoader(){
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
/*  const styles = [
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
  ];*/

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

  // clusterSource 추가
  const clusterSource = new Cluster({
    source: vectorSource
  })

  const styleCache = {};

  // vectorSource add to vectorLayer
/*  const vectorLayer = new VectorLayer({
    source : clusterSource,
    style: styles,
  });*/

  const vectorLayer = new VectorLayer({
    source : clusterSource,
    style: function (feature){
      const size = feature.get('features').length;
      let style = styleCache[size];
      if(!style){
        style = [
          new Style({
            image: outerCircle
          }),
          new Style({
            image: innerCircle,
            text: new TextStyle({
              text: size.toString(),
              fill: textFill,
              scale : 1.3
            })
          })
        ];
        styleCache[size] = style;
      }
      return style;
    },
  });

  //instance TileLayer
  const tileLayer = new TileLayer({
    source: new OSM({url : 'http://localhost:8282/tile/{z}/{x}/{y}.png', crossOrigin: null}),
  });

  //instance View
  const view = new View({
    center:fromLonLat([126.89986357412153, 37.51439687834425]),
    zoom: 10,
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
    vectorLayer.getFeatures(e.pixel).then((clickedFeatures)=>{
      if(clickedFeatures.length){
        // Get clustered Coordinates
        const features = clickedFeatures[0].get('features');
        // 마커가 클러스터로 묶여 있으면,
        if (features.length > 1) {
          const extent = boundingExtent(
            features.map((r) => r.getGeometry().getCoordinates())
          );
          console.log("extent",extent);
          // 확대
          map.getView().fit(extent, {duration: 1000, padding: [250, 250, 250, 250]});
        }else{
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
        }
      }
    })
  });
  map.on('pointermove', (e) => map.getViewport().style.cursor = map.hasFeatureAtPixel(e.pixel) ? 'pointer' : '');

  //popup closed
  closer.onclick = () =>{
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  }

}
