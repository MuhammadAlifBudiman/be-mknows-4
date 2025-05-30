import { User } from "../interfaces/user.interface";
import { UserSession } from "../interfaces/user-session.interface";
import { UpdateUserProfileDto } from "../dtos/account.dto";
export declare class AccountService {
    getProfileByUserId(user_id: number): Promise<User>;
    getSessionsHistoriesByUserId(user_id: number, session_id: string): Promise<UserSession[]>;
    updateUserProfile(user_id: number, data: UpdateUserProfileDto): Promise<User>;
}
