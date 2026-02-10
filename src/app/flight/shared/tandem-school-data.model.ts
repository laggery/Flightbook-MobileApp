import { User } from "src/app/account/shared/user.model";
import { School } from "src/app/school/shared/school.model";
import { TandemSchoolPaymentState } from "./tandem-school-payment-state";

export class TandemSchoolData {
  paymentState: TandemSchoolPaymentState | undefined;
  paymentComment: string | undefined;
  instructor: User | undefined;
  tandemSchool: School | undefined;
  paymentTimestamp: Date | undefined;
}
