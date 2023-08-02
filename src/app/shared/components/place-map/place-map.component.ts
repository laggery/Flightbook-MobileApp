import { AfterViewInit, Component, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Point as GeoPoint, Position } from 'geojson';
import { Feature, View } from 'ol';
import Map from 'ol/Map';
import Attribution from 'ol/control/Attribution';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { firstValueFrom } from 'rxjs';
import { Place } from 'src/app/place/shared/place.model';
import { PlaceService } from 'src/app/place/shared/place.service';

@Component({
  selector: 'fb-place-map',
  templateUrl: './place-map.component.html',
  styleUrls: ['./place-map.component.scss'],
})
export class PlaceMapComponent  implements OnInit, AfterViewInit, OnChanges {

  private map: Map;
  private vectorSource = new VectorSource();
  private vectorLayer: VectorLayer<any>;
  private attribution = `map data: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | map style: © <a href="https://opentopomap.org/">OpenTopoMap</a> <a href="https://creativecommons.org/licenses/by-sa/3.0/">(CC-BY-SA)</a>`;

  private marker = new Feature();

  private timerId: NodeJS.Timeout;

  @Input()
  placeName: String;

  @Input()
  place: Place;

  constructor(
    private placeService: PlaceService,
    private alertController: AlertController,
    private translate: TranslateService,
    private zone: NgZone
  ) {
    const style = new Style({
      image: new Icon({
      anchor: [0.5, 1],
      crossOrigin: 'anonymous',
      src: 'assets/icon/marker.png',
      })
    });

    this.vectorSource.addFeature(this.marker);

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: style
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.placeName.firstChange) {
      if (this.place.coordinates) {
        return;
      }
    }

    if (!this.place.coordinates && changes.placeName.currentValue && changes.placeName.currentValue != "") {
      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => this.searchPlace(changes.placeName.currentValue), 1000);
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap(this.place.coordinates);
  }

  private async searchPlace(name: string) { 
    const res = await firstValueFrom(this.placeService.searchOpenstreetmapPlace(name));
    if (!res.features || res.features.length === 0) {
      return;
    }
    const geometry = res.features[0]?.geometry as GeoPoint
    this.map.getView().animate({center: fromLonLat(geometry.coordinates), duration: 200}, {zoom: 14});
  }

  private initMap(position?: Position) {
    const attributionControl = new Attribution({
      collapsible: true,
      collapsed: true
    })

    let zoom = 1;
    let mapPoition = [0, 0];
    
    if (position && position != null) {
      this.marker.setGeometry(new Point(position));
      zoom = 15;
      mapPoition = position; 
    }
    
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM({
            url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attributions: this.attribution,
          }),
        }),
        this.vectorLayer
      ],
      controls: [attributionControl],
      target: 'map',
      view: new View({
        center: mapPoition,
        zoom: zoom,
      }),
    });

    this.map.on('dblclick', this.onDblclick)
  }

  onDblclick = (async(evt: any) => {
    this.place.coordinates = evt.coordinate;
    this.marker.setGeometry(new Point(evt.coordinate));
    const epsgGeometry: any = this.marker.getGeometry().clone().transform(this.map.getView().getProjection(), 'EPSG:4326')
    const res = await firstValueFrom(this.placeService.getPlaceMetadata(epsgGeometry.flatCoordinates));

    if (this.place.altitude) {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.infotitle'),
        message: this.translate.instant('place.override'),
        buttons: [
          {
            text: this.translate.instant('buttons.yes'),
            handler: () => {
              this.place.altitude = res.altitude;
              this.place.country = res.country;
            }
          },
          this.translate.instant('buttons.no')
        ]
      });
  
      await alert.present();
      await alert.onDidDismiss();
      await alert.dismiss();
    } else {
      this.zone.run(() => {
        this.place.altitude = res.altitude;
        this.place.country = res.country;
      });
    }
  });
}
