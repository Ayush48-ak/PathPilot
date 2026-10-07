import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { UserProfileService } from "./user-profile.service.js";
import { CreateUserProfileDto } from "./dto/create-user-profile.dto.js";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto.js";

@Controller("profiles")
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
  ) {}

  @Get()
  getProfiles() {
    return this.userProfileService.getProfiles();
  }

  @Post()
  createProfile(@Body() data: CreateUserProfileDto) {
    return this.userProfileService.createProfile(data);
  }

  @Patch(":id")
  updateProfile(
    @Param("id") id: string,
    @Body() data: UpdateUserProfileDto,
  ) {
    return this.userProfileService.updateProfile(
      Number(id),
      data,
    );
  }
}