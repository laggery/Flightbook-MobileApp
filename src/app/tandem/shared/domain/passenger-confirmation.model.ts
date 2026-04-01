import { School } from "src/app/school/shared/school.model";

export class PassengerConfirmation{
    id?: number;
    date: Date;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    place: string;
    signature: string;
    signatureMimeType: string;
    validated: boolean;
    canUseData: boolean;
    tandemSchool: School

    constructor() {
        this.date = new Date();
        this.validated = false;
        this.canUseData = false;
    }
}
