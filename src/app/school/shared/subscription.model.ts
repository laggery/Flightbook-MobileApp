import { User } from "src/app/account/shared/user.model";
import { Student } from "./student.model";

export class Subscription {
    id: number;
    user: User;
    student: Student;
    waitingList: boolean;
}
