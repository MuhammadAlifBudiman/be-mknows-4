import { User } from "./user.interface";
export interface UserSession {
    pk: number;
    uuid: string;
    user_id: number;
    useragent: string;
    ip_address: string;
    status: string;
    is_current?: boolean;
    user?: User;
}
