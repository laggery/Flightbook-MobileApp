import { Place } from '../place/place';
import { Glider } from '../glider/glider';

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
}
