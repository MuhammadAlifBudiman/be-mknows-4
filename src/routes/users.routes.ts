import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";

import { UserController } from "@controllers/user.controller";
import { AuthMiddleware, AuthorizedRoles } from "@middlewares/auth.middleware";
import Limitter from "@middlewares/rate-limitter.middleware";
// import { ValidationMiddleware } from "@middlewares/validation.middleware";
// import { CreateUserDto } from "@dtos/users.dto";

export class UserRoute implements Routes {
  public path = "users";
  public router = Router();
  public user = new UserController();
  public limitter = new Limitter();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/v1/users/check`, this.user.getUseragent);
    this.router.get(`/v1/${this.path}`, 
      this.limitter.default(), 
      AuthMiddleware, AuthorizedRoles(["ADMIN"]), 
      this.user.getUsers
    );
    this.router.get(`/v1/${this.path}/:uuid`, this.user.getUserByUUID);
  }
}