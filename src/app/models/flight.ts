import { IonDatetime } from '@ionic/angular';
import { Place } from './place';
import { Glider } from './glider';

export class Flight {
    id: number;
    user_id: number;
    glider_id: number;
    glider: Glider;
    date: string;
    start_id: number;
    start: Place
    landing_id: number;
    landing: Place;
    time: IonDatetime;
    km: number;
    description: string;
    number: number;
    price: number;
    timestamp: IonDatetime;
}