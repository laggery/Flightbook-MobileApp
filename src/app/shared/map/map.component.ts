import { AfterViewInit, OnChanges, OnInit, Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import 'ol/ol.css';
import Feature from 'ol/Feature';
import IGC from 'ol/format/IGC';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { LineString, Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { getVectorContext } from 'ol/render';

@Component({
  selector: 'fb-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {

  constructor() {
  }

  map: Map;

  igcFileValue: string;

  private vectorSource: any;

  // @Input()
  // igcFile: string | File;

  @Input()
  set igcFile(val: string) {
    this.igcFileValue = val
    const igcFormat = new IGC();
    if (typeof val === 'string') {
      const features = igcFormat.readFeatures(val, {
        featureProjection: 'EPSG:3857',
      });
      if (this.vectorSource){
        this.vectorSource.addFeatures(features);
      }
    }
  }

  ngAfterViewInit() {
    const styleCache = {};
    const styleFunction = (feature: { get: (arg0: string) => string | number; }) => {
      // @ts-ignore
      const color = 'rgba(0, 140, 173, 1)';
      // @ts-ignore
      // tslint:disable-next-line:no-shadowed-variable
      let style = styleCache[color];
      if (!style) {
        style = new Style({
          stroke: new Stroke({
            color,
            width: 3,
          }),
        });
        // @ts-ignore
        styleCache[color] = style;
      }
      return style;
    };

    const vectorSource = new VectorSource();

    const time = {
      start: Infinity,
      stop: -Infinity,
      duration: 0,
    };
    vectorSource.on('addfeature', evt => {
      const geometry = evt.feature.getGeometry() as LineString;
      time.start = Math.min(time.start, geometry.getFirstCoordinate()[2]);
      time.stop = Math.max(time.stop, geometry.getLastCoordinate()[2]);
      time.duration = time.stop - time.start;
    });

    const igcFormat = new IGC();
    if (typeof this.igcFileValue === 'string') {
      const features = igcFormat.readFeatures(this.igcFileValue, {
        featureProjection: 'EPSG:3857',
      });
      vectorSource.addFeatures(features);
    }

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
    });

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM({
            url:
              'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }),
        }),
        vectorLayer],
      target: 'map',
      view: new View({
        center: [913365.7089403362, 5914629.865071137],
        zoom: 7,
      }),
    });

    const point: any = null;
    const line: any = null;
    const stroke = new Stroke({
      color: 'rgba(255,0,0,0.9)',
      width: 5,
    });
    const style = new Style({
      stroke,
      image: new CircleStyle({
        radius: 5,
        fill: null,
        stroke,
      }),
    });
    vectorLayer.on('postrender', evt => {
      const vectorContext = getVectorContext(evt);
      vectorContext.setStyle(style);
      if (point !== null) {
        vectorContext.drawGeometry(point);
      }
      if (line !== null) {
        vectorContext.drawGeometry(line);
      }
    });

    const featureOverlay = new VectorLayer({
      source: new VectorSource(),
      map,
      style: new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: 'rgba(255,0,0,0.9)',
          }),
        }),
      }),
    });

    const elementById = document.getElementById('time');
    if (elementById) {
      elementById.addEventListener('input', function () {
        const value = parseInt((this as HTMLInputElement).value, 10) / 100;
        const m = time.start + time.duration * value;
        vectorSource.forEachFeature(feature => {
          const geometry = (feature.getGeometry() as LineString);
          const coordinate = geometry.getCoordinateAtM(m, true);
          let highlight = feature.get('highlight');
          if (highlight === undefined) {
            highlight = new Feature(new Point(coordinate));
            feature.set('highlight', highlight);
            featureOverlay.getSource().addFeature(highlight);
          } else {
            highlight.getGeometry().setCoordinates(coordinate);
          }
        });
        map.render();
      });
    }
  }


}
