
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from "@nestjs/common";

import { CareerRoadmapService } from "./career-roadmap.service.js";

@Controller("career-paths/:careerId/roadmap")
export class CareerRoadmapController {
  constructor(
    private readonly careerRoadmapService: CareerRoadmapService,
  ) {}

  @Get()
  getRoadmap(
    @Param("careerId", ParseIntPipe) careerId: number,
  ) {
    return this.careerRoadmapService.getRoadmapByCareer(careerId);
  }
}
