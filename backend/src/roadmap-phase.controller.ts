
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";

import { RoadmapPhaseService } from "./roadmap-phase.service.js";
import { CreateRoadmapPhaseDto } from "./dto/create-roadmap-phase.dto.js";

@Controller("career-paths/:careerId/roadmap/phases")
export class RoadmapPhaseController {
  constructor(
    private readonly roadmapPhaseService: RoadmapPhaseService,
  ) {}

  @Get()
  getPhases(
    @Param("careerId", ParseIntPipe) careerId: number,
  ) {
    return this.roadmapPhaseService.getPhasesByCareer(careerId);
  }

  @Post()
  createPhase(
    @Param("careerId", ParseIntPipe) careerId: number,
    @Body() data: CreateRoadmapPhaseDto,
  ) {
    return this.roadmapPhaseService.createPhase(careerId, data);
  }
}
