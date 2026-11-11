import type { Request, Response } from "express";
import { createSuccessResponse } from "../../core/http/api-response.js";
import type { CreateUserDto, UserIdParamDto } from "./dto/user.dto.js";
import type { IUserService } from "./user.service.interface.js";

export class UserController {
  constructor(private readonly userService: IUserService) {}

  public create = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateUserDto;
    const user = await this.userService.createUser(dto);
    res.status(201).json(createSuccessResponse(user));
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as UserIdParamDto;
    const user = await this.userService.getUserById(id);
    res.status(200).json(createSuccessResponse(user));
  };

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.userService.getAllUsers();
    res.status(200).json(createSuccessResponse(users));
  };
}
