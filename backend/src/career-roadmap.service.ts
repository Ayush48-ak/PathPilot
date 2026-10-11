
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";

@Injectable()
export class CareerRoadmapService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoadmapByCareer(careerId: number) {
    const careers = await this.prisma.db.orm.public.Career
      .where({ id: careerId })
      .all();

    const career = careers[0];

    if (!career) {
      throw new NotFoundException("Career not found");
    }

    const phases = await this.prisma.db.orm.public.RoadmapPhase
      .where({ careerId })
      .all();

    const sortedPhases = phases.sort(
      (a, b) => a.order - b.order,
    );

    const roadmapPhases = await Promise.all(
      sortedPhases.map(async (phase) => {
        const topics = await this.prisma.db.orm.public.RoadmapTopic
          .where({ phaseId: phase.id })
          .all();

        return {
          ...phase,
          topics: topics.sort((a, b) => a.order - b.order),
        };
      }),
    );

    return {
      career,
      phases: roadmapPhases,
    };
  }
}
