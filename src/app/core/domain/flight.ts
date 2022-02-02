import { Glider } from "./glider";
import { Igc } from "./igc";
import { Place } from "./place";

export class Flight {
    id: number;
    number: number;
    glider: Glider;
    date: string;
    start?: Place;
    landing?: Place;
    time?: string;
    km?: number;
    description?: string;
    price?: number;
    timestamp?: Date;
    igc?: Igc;
    igcFile?: File;
}
