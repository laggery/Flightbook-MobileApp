import { LoginType } from "./login-type";

export class User {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    token: string;
    loginType: LoginType
}
