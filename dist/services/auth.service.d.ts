import { User } from "../interfaces/user.interface";
import { UserRole } from "../interfaces/authentication/user-role.interface";
import { UserSession } from "../interfaces/user-session.interface";
import { UserAgent } from "../interfaces/common/useragent.interface";
import { CreateUserDto } from "../dtos/users.dto";
export declare class AuthService {
    signup(userData: CreateUserDto): Promise<{
        uuid: string;
        email: string;
    }>;
    login(userData: CreateUserDto, userAgent: UserAgent): Promise<{
        cookie: string;
        accessToken: string;
    }>;
    logout(userData: User, userSessionId: string): Promise<boolean>;
    checkSessionActive(session_id: string): Promise<UserSession>;
    getUserRoles(user_id: number): Promise<UserRole[]>;
    logoutSessionActive(data: {
        uid: string;
        sid: string;
    }): Promise<boolean>;
    createUserSession(data: {
        pk: number;
        useragent: string;
        ip_address: string;
    }): Promise<UserSession>;
    private getRoleId;
    private asignUserRole;
    verifyEmail(user_uuid: string, otp: string): Promise<{
        email: string;
    }>;
}
