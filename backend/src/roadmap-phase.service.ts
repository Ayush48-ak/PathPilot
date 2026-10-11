
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";
import { CreateRoadmapPhaseDto } from "./dto/create-roadmap-phase.dto.js";

@Injectable()
export class RoadmapPhaseService {
  constructor(private readonly prisma: PrismaService) {}

  async getPhasesByCareer(careerId: number) {
    const career = await this.prisma.db.orm.public.Career
      .where({ id: careerId })
      .all();

    if (career.length === 0) {
      throw new NotFoundException("Career not found");
    }

    return this.prisma.db.orm.public.RoadmapPhase
      .where({ careerId })
      .all();
  }

  async createPhase(
    careerId: number,
    data: CreateRoadmapPhaseDto,
  ) {
    const career = await this.prisma.db.orm.public.Career
      .where({ id: careerId })
      .all();

    if (career.length === 0) {
      throw new NotFoundException("Career not found");
    }

    return this.prisma.db.orm.public.RoadmapPhase.create({
      careerId,
      title: data.title,
      description: data.description,
      order: data.order,
      duration: data.duration,
    });
  }
}
