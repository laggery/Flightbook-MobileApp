import { AfterViewInit, Component, Input } from '@angular/core';
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
import { Coordinate } from 'ol/coordinate';
import * as IGCParser from 'igc-parser';

@Component({
  selector: 'fb-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {

  constructor() {
  }

  map: Map;

  @Input()
  igcFile: string | File;

  ngAfterViewInit() {

    const colors = {
      Rex: 'rgba(0, 0, 255, 0.7)',
    };

    const styleCache = {};
    const styleFunction = (feature: { get: (arg0: string) => string | number; }) => {
      // @ts-ignore
      const color = colors[feature.get('PLT')];
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

    const igcFormat = new IGC();
    if (typeof this.igcFile === 'string') {
      const igcFile = IGCParser.parse(this.igcFile, { lenient: true });
      const features = igcFormat.readFeatures(this.igcFile, {
        featureProjection: 'EPSG:3857',
      });
      vectorSource.addFeatures(features);
    }

    const time = {
      start: Infinity,
      stop: -Infinity,
      duration: 0,
    };
    vectorSource.on('addfeature', evt => {
      console.log('test3');
      const geometry = evt.feature.getGeometry() as LineString;
      time.start = Math.min(time.start, geometry.getFirstCoordinate()[2]);
      time.stop = Math.max(time.stop, geometry.getLastCoordinate()[2]);
      time.duration = time.stop - time.start;
    });

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
        center: [703365.7089403362, 5714629.865071137],
        zoom: 7,
      }),
    });

    let point: any = null;
    let line: any = null;
    const displaySnap = (coordinate: Coordinate) => {
      const closestFeature = vectorSource.getClosestFeatureToCoordinate(coordinate);
      const info = document.getElementById('info');
      if (closestFeature === null) {
        point = null;
        line = null;
        info.innerHTML = '&nbsp;';
      } else {
        const geometry = closestFeature.getGeometry();
        const closestPoint = geometry.getClosestPoint(coordinate);
        if (point === null) {
          point = new Point(closestPoint);
        } else {
          point.setCoordinates(closestPoint);
        }
        const date = new Date(closestPoint[2] * 1000);
        info.innerHTML =
          closestFeature.get('PLT') + ' (' + date.toUTCString() + ')';
        const coordinates = [coordinate, [closestPoint[0], closestPoint[1]]];
        if (line === null) {
          line = new LineString(coordinates);
        } else {
          line.setCoordinates(coordinates);
        }
      }
      map.render();
    };

    map.on('pointermove', evt => {
      if (evt.dragging) {
        return;
      }
      const coordinate = map.getEventCoordinate(evt.originalEvent as MouseEvent);
      displaySnap(coordinate);
    });

    map.on('click', evt => {
      displaySnap(evt.coordinate);
    });

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
