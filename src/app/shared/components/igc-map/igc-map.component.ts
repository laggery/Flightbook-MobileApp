import { AfterViewInit, Component, Input } from '@angular/core';
import Feature from 'ol/Feature';
import IGC from 'ol/format/IGC';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import Attribution from 'ol/control/Attribution';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { LineString, Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { getVectorContext } from 'ol/render';
import IGCParser from 'igc-parser';
import { ConfigurationService } from '../../services/configuration.service';
import { firstValueFrom } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { IonRange, IonCard } from "@ionic/angular/standalone";

@Component({
    selector: 'fb-igc-map',
    templateUrl: './igc-map.component.html',
    styleUrls: ['./igc-map.component.scss'],
    imports: [
        TranslateModule,
        IonRange,
        IonCard
    ]
})
export class IgcMapComponent implements AfterViewInit {

    igcFileValue: string;
    inputValue = 0;
    sliderInfo: any;

    private styleCache = {};
    private vectorSource = new VectorSource();
    private vectorSourceOverlay = new VectorSource();
    private time: any;
    private vectorLayer: VectorLayer<any>;
    private featureOverlay: VectorLayer<any>;
    private map: Map;
    private geometry: LineString;
    private igcParserValue: any;

    @Input()
    set igcFile(val: string) {
        this.igcFileValue = val
        const igcFormat = new IGC();
        if (typeof val === 'string') {
            this.igcParserValue = IGCParser.parse(val, { lenient: true });
            const features = igcFormat.readFeatures(val, {
                featureProjection: 'EPSG:3857',
            });

            this.geometry = features[0].getGeometry() as LineString;

            if (this.vectorSource) {
                this.vectorSource.clear();
                this.time = {
                    start: Infinity,
                    stop: -Infinity,
                    duration: 0,
                };
                this.vectorSource.addFeatures(features);
            }

            if (this.vectorSourceOverlay) {
                this.vectorSourceOverlay.clear();
                this.inputValue = 0;
                this.sliderInfo = null;
            }

            if (this.map) {
                this.mapCenter();
            }
        }
    }

    constructor(
        private configurationService: ConfigurationService
    ) {
        this.vectorSource.on('addfeature', this.onAddfeature);

        this.vectorLayer = new VectorLayer({
            source: this.vectorSource,
            style: this.styleFunction,
        });

        this.vectorLayer.on('postrender', this.onPostrender);
    }

    ngAfterViewInit() {
        this.initMap();
    }

    onAddfeature = ((evt: any) => {
        const geometry = evt.feature.getGeometry() as LineString;
        this.time.start = Math.min(this.time.start, geometry.getFirstCoordinate()[2]);
        this.time.stop = Math.max(this.time.stop, geometry.getLastCoordinate()[2]);
        this.time.duration = this.time.stop - this.time.start;
    });

    onPostrender = ((evt: any) => {
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

        const vectorContext = getVectorContext(evt);
        vectorContext.setStyle(style);
        if (point !== null) {
            vectorContext.drawGeometry(point);
        }
        if (line !== null) {
            vectorContext.drawGeometry(line);
        }
    });

    onTimeSliderInput($event: any) {
        const value = $event.target.value / 100;
        this.inputValue = value;
        const m = this.time.start + this.time.duration * value;
        this.sliderInfo = this.igcParserValue.fixes.find((val: any) => { return val.time == new Date(m * 1000).toISOString().substr(11, 8) })

        this.vectorSource.forEachFeature(feature => {
            const geometry = (feature.getGeometry() as LineString);
            const coordinate = geometry.getCoordinateAtM(m, true);
            let highlight = feature.get('highlight');
            if (highlight === undefined) {
                highlight = new Feature(new Point(coordinate));
                feature.set('highlight', highlight);
                this.featureOverlay.getSource().addFeature(highlight);
            } else {
                highlight.getGeometry().setCoordinates(coordinate);
            }
        });

        this.map.render();
    }

    private styleFunction = (feature: { get: (arg0: string) => string | number; }) => {
        // @ts-ignore
        const color = 'rgba(0, 140, 173, 1)';
        // @ts-ignore
        // tslint:disable-next-line:no-shadowed-variable
        let style = this.styleCache[color];
        if (!style) {
            style = new Style({
                stroke: new Stroke({
                    color,
                    width: 3,
                }),
            });
            // @ts-ignore
            this.styleCache[color] = style;
        }
        return style;
    };

    private async initMap() {
        const config = await firstValueFrom(this.configurationService.getMapConfiguration());
        const attributionControl = new Attribution({
            collapsible: true,
            collapsed: true
        })
        this.map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM({
                        url: config.url,
                        attributions: config.attributions,
                        crossOrigin: config.crossOrigin
                    })
                }),
                this.vectorLayer
            ],
            controls: [attributionControl],
            target: 'map',
            view: new View(),
        });

        this.mapCenter();

        this.featureOverlay = new VectorLayer({
            source: this.vectorSourceOverlay,
            map: this.map,
            style: new Style({
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({
                        color: 'rgba(255,0,0,0.9)',
                    }),
                }),
            }),
        });
    }

    private mapCenter() {
        this.map.getView().fit(this.geometry.getExtent());
        const zoom = this.map.getView().getZoom();
        this.map.getView().setZoom(zoom - 1);
    }
}
