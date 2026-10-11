
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";

import { CareerSkillService } from "./career-skill.service.js";
import { CreateCareerSkillDto } from "./dto/create-career-skill.dto.js";

@Controller("career-paths/:careerId/skills")
export class CareerSkillController {
  constructor(
    private readonly careerSkillService: CareerSkillService,
  ) {}

  @Get()
  getSkills(
    @Param("careerId", ParseIntPipe) careerId: number,
  ) {
    return this.careerSkillService.getSkillsByCareer(careerId);
  }

  @Post()
  createSkill(
    @Param("careerId", ParseIntPipe) careerId: number,
    @Body() data: CreateCareerSkillDto,
  ) {
    return this.careerSkillService.createSkill(careerId, data);
  }
}
