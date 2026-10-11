
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from "@nestjs/common";

import { TopicProgressService } from "./topic-progress.service.js";
import { UpdateTopicProgressDto } from "./dto/update-topic-progress.dto.js";

@Controller("users/:userId/progress")
export class TopicProgressController {
  constructor(
    private readonly topicProgressService: TopicProgressService,
  ) {}

  @Get()
  getProgress(
    @Param("userId", ParseIntPipe) userId: number,
  ) {
    return this.topicProgressService.getProgress(userId);
  }

  @Patch(":topicId")
  setProgress(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("topicId", ParseIntPipe) topicId: number,
    @Body() data: UpdateTopicProgressDto,
  ) {
    return this.topicProgressService.setProgress(
      userId,
      topicId,
      data,
    );
  }
}
