import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { PrismaService } from "./prisma.service.js";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";
import { UserProfileService } from "./user-profile.service.js";
import { UserProfileController } from "./user-profile.controller.js";
import { CareerPathService } from "./career-path.service.js";
import { CareerPathController } from "./career-path.controller.js";

@Module({
  imports: [],
  controllers: [
    AppController,
    UsersController,
    UserProfileController,
    CareerPathController,
  ],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    UserProfileService,
    CareerPathService,
  ],
})
export class AppModule {}