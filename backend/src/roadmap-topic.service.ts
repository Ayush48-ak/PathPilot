
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";
import { CreateRoadmapTopicDto } from "./dto/create-roadmap-topic.dto.js";

@Injectable()
export class RoadmapTopicService {
  constructor(private readonly prisma: PrismaService) {}

  async getTopicsByPhase(phaseId: number) {
    const phase = await this.prisma.db.orm.public.RoadmapPhase
      .where({ id: phaseId })
      .all();

    if (phase.length === 0) {
      throw new NotFoundException("Roadmap phase not found");
    }

    const topics = await this.prisma.db.orm.public.RoadmapTopic
      .where({ phaseId })
      .all();

    return topics.sort((a, b) => a.order - b.order);
  }

  async createTopic(
    phaseId: number,
    data: CreateRoadmapTopicDto,
  ) {
    const phase = await this.prisma.db.orm.public.RoadmapPhase
      .where({ id: phaseId })
      .all();

    if (phase.length === 0) {
      throw new NotFoundException("Roadmap phase not found");
    }

    return this.prisma.db.orm.public.RoadmapTopic.create({
      phaseId,
      title: data.title,
      description: data.description,
      order: data.order,
      estimatedHours: data.estimatedHours,
      resourceUrl: data.resourceUrl,
    });
  }
}
