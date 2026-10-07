import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";

import { CareerPathService } from "./career-path.service.js";
import { CreateCareerDto } from "./dto/create-career.dto.js";

@Controller("career-paths")
export class CareerPathController {
  constructor(
    private readonly careerPathService: CareerPathService,
  ) {}

  @Get()
  getCareerPaths() {
    return this.careerPathService.getCareerPaths();
  }

  @Get(":id")
  getCareerPath(@Param("id") id: string) {
    return this.careerPathService.getCareerPath(Number(id));
  }

  @Post()
  createCareer(@Body() data: CreateCareerDto) {
    return this.careerPathService.createCareer(data);
  }
}