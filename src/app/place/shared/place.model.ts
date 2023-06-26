import { Position } from "geojson";

export class Place {
    id: number;
    name: string;
    altitude: number;
    country: string;
    notes: string;
    coordinates: Position
}
