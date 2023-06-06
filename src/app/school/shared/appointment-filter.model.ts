import { State } from "./state";

export class AppointmentFilter {
    from: Date;
    to: Date;
    state: string;

    constructor() {
        this.state = "";
    }
}
