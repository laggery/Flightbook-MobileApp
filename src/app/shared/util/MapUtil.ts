import { Position } from "geojson";
import Point from "ol/geom/Point";

export class MapUtil {

    public static convertEPSG3857ToEPSG4326(position: Position): any {
        if (position?.length >= 2) {
            return new Point(position).transform('EPSG:3857', 'EPSG:4326');
        }
        return null;
    }
}