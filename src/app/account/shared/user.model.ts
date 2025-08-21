import { UserConfig } from "./userConfig.model";

export class User {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
    token: string;
    config?: UserConfig;
}
