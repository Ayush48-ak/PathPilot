
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";

import { UserSkillService } from "./user-skill.service.js";
import { CreateUserSkillDto } from "./dto/create-user-skill.dto.js";

@Controller("users/:userId")
export class UserSkillController {
  constructor(
    private readonly userSkillService: UserSkillService,
  ) {}

  @Get("skills")
  getSkills(
    @Param("userId", ParseIntPipe) userId: number,
  ) {
    return this.userSkillService.getSkills(userId);
  }

  @Post("skills")
  addSkill(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() data: CreateUserSkillDto,
  ) {
    return this.userSkillService.addSkill(userId, data);
  }

  @Get("skill-gap/:careerId")
  analyzeSkillGap(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("careerId", ParseIntPipe) careerId: number,
  ) {
    return this.userSkillService.analyzeSkillGap(userId, careerId);
  }
}
