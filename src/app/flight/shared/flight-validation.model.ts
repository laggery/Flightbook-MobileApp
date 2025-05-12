import { User } from "src/app/account/shared/user.model";
import { School } from "src/app/school/shared/school.model";
import { FlightValidationState } from "./flight-validation-state";

export class FlightValidation {
  state: FlightValidationState | undefined;
  comment: string | undefined;
  instructor: User | undefined;
  school: School | undefined;
  timestamp: Date | undefined;
}
