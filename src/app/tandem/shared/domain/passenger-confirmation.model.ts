import { School } from "src/app/school/shared/school.model";

export interface PassengerConfirmationValidation {
    fullyUnderstoodInstructions: boolean;
    undertakePilotInstructions: boolean;
    noHealthProblems: boolean;
    understandRisks: boolean;
}

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
    validation: PassengerConfirmationValidation;
    canUseData: boolean;
    tandemSchool: School

    constructor() {
        this.date = new Date();
        this.validation = {
            fullyUnderstoodInstructions: false,
            undertakePilotInstructions: false,
            noHealthProblems: false,
            understandRisks: false
        };
        this.canUseData = false;
    }
}
