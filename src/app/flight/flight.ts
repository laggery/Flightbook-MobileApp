import { IonDatetime } from '@ionic/angular';
import { Place } from '../place/place';
import { Glider } from '../glider/glider';

export class Flight {
    id: number;
    glider: Glider;
    date: Date;
    start?: Place;
    landing?: Place;
    time?: IonDatetime;
    km?: number;
    description?: string;
    price?: number;
    timestamp?: Date;
}
