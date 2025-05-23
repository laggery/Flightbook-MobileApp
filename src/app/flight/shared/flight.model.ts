import { Glider } from "src/app/glider/shared/glider.model";
import { Place } from "src/app/place/shared/place.model";
import { Igc } from "../../shared/domain/igc.model";
import { FlightValidation } from "./flight-validation.model";

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
    shvAlone?: boolean;
    validation?: FlightValidation;
}
