
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";

import { RoadmapTopicService } from "./roadmap-topic.service.js";
import { CreateRoadmapTopicDto } from "./dto/create-roadmap-topic.dto.js";

@Controller("roadmap/phases/:phaseId/topics")
export class RoadmapTopicController {
  constructor(
    private readonly roadmapTopicService: RoadmapTopicService,
  ) {}

  @Get()
  getTopics(
    @Param("phaseId", ParseIntPipe) phaseId: number,
  ) {
    return this.roadmapTopicService.getTopicsByPhase(phaseId);
  }

  @Post()
  createTopic(
    @Param("phaseId", ParseIntPipe) phaseId: number,
    @Body() data: CreateRoadmapTopicDto,
  ) {
    return this.roadmapTopicService.createTopic(phaseId, data);
  }
}
