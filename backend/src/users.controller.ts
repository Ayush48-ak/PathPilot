import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Post()
  createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @Patch(":id")
  updateUser(
    @Param("id") id: string,
    @Body() data: UpdateUserDto,
  ) {
    return this.usersService.updateUser(Number(id), data);
  }

  @Delete(":id")
  deleteUser(@Param("id") id: string) {
    return this.usersService.deleteUser(Number(id));
  }
}