import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.db.orm.public.User.all();
  }

  async createUser(data: CreateUserDto) {
    return this.prisma.db.orm.public.User.create(data);
  }

  async updateUser(id: number, data: UpdateUserDto) {
    return this.prisma.db.orm.public.User
      .where({ id })
      .update(data);
  }

  async deleteUser(id: number) {
    return this.prisma.db.orm.public.User
      .where({ id })
      .delete();
  }
}