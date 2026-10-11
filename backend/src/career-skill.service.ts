
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";
import { CreateCareerSkillDto } from "./dto/create-career-skill.dto.js";

@Injectable()
export class CareerSkillService {
  constructor(private readonly prisma: PrismaService) {}

  async getSkillsByCareer(careerId: number) {
    const career = await this.prisma.db.orm.public.Career
      .where({ id: careerId })
      .all();

    if (career.length === 0) {
      throw new NotFoundException("Career not found");
    }

    return this.prisma.db.orm.public.CareerSkill
      .where({ careerId })
      .all();
  }

  async createSkill(
    careerId: number,
    data: CreateCareerSkillDto,
  ) {
    const career = await this.prisma.db.orm.public.Career
      .where({ id: careerId })
      .all();

    if (career.length === 0) {
      throw new NotFoundException("Career not found");
    }

    return this.prisma.db.orm.public.CareerSkill.create({
      careerId,
      name: data.name,
      description: data.description,
      importance: data.importance,
      level: data.level,
    });
  }
}
