import { type RateLimitRequestHandler } from "express-rate-limit";
declare class Limitter {
    default: () => RateLimitRequestHandler;
    emailVerification: () => RateLimitRequestHandler;
}
export default Limitter;
