import { User } from "src/app/account/shared/user.model";
import { AppointmentType } from "./appointment-type.model";
import { School } from "./school.model";
import { State } from "./state";
import { Subscription } from "./subscription.model";

export class Appointment {
    id: number;
    type: AppointmentType;
    scheduling: Date;
    meetingPoint: string;
    maxPeople: number;
    description: string;
    state: State;
    school: School;
    instructor: User;
    takeOffCoordinator: User;
    takeOffCoordinatorText: string;
    subscriptions: Subscription[];
    countSubscription: number;
    countWaitingList: number;

    // @hack -> only used to render the ion-toggle correctly
    // this property is instatiated after receiving the appointments from the server 
    subscribed: boolean;
}
