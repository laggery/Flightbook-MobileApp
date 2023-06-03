import { Glider } from "src/app/glider/shared/glider.model";

export class FlightFilter {
    glider: Glider;
    from: Date;
    to: Date;
    gliderType: string;
    description: string;

    constructor() {
        this.glider = new Glider();
        this.gliderType = "";
    }
}
