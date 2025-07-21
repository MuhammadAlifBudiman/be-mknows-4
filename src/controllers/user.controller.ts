import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import asyncHandler from "express-async-handler";

import { User } from "@interfaces/user.interface";
import { UserService } from "@services/users.service";
import { apiResponse } from "@/utils/apiResponse";
import { getUserAgent } from "@utils/userAgent";
import { UserAgent } from "@/interfaces/common/useragent.interface";
// import { CreateUserDto } from "@dtos/users.dto";

export class UserController {
  public user = Container.get(UserService);

  public getUseragent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userAgentPayload: UserAgent = getUserAgent(req);
    res.status(200).json(apiResponse(200, "OK", "User Agent Retrieved", userAgentPayload));
  });

  public getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const findAllUsersData: User[] = await this.user.findAllUser();

    res.status(200).json(apiResponse(200, "OK", "All Users Retrieved", findAllUsersData));
  });

  public getUserByUUID = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user_uuid = req.params.uuid;
    const findOneUserData: User = await this.user.findUserByUUID(user_uuid);

    res.status(200).json(apiResponse(200, "OK", "User Retrieved", findOneUserData));
  });


}