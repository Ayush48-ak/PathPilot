
import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "./prisma.service.js";
import { UpdateTopicProgressDto } from "./dto/update-topic-progress.dto.js";

@Injectable()
export class TopicProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getProgress(userId: number) {
    const users = await this.prisma.db.orm.public.User
      .where({ id: userId })
      .all();

    if (users.length === 0) {
      throw new NotFoundException("User not found");
    }

    return this.prisma.db.orm.public.TopicProgress
      .where({ userId })
      .all();
  }

  async setProgress(
    userId: number,
    topicId: number,
    data: UpdateTopicProgressDto,
  ) {
    const users = await this.prisma.db.orm.public.User
      .where({ id: userId })
      .all();

    if (users.length === 0) {
      throw new NotFoundException("User not found");
    }

    const topics = await this.prisma.db.orm.public.RoadmapTopic
      .where({ id: topicId })
      .all();

    if (topics.length === 0) {
      throw new NotFoundException("Roadmap topic not found");
    }

    const existing = await this.prisma.db.orm.public.TopicProgress
      .where({ userId, topicId })
      .all();

    if (existing.length > 0) {
      const progress = existing[0];

      return this.prisma.db.orm.public.TopicProgress
        .where({ id: progress.id })
        .update({
          completed: data.completed,
          completedAt: data.completed ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        });
    }

    return this.prisma.db.orm.public.TopicProgress.create({
      userId,
      topicId,
      completed: data.completed,
      completedAt: data.completed ? new Date().toISOString() : null,
    });
  }
}
