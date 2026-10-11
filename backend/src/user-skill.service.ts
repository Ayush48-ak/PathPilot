
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "./prisma.service.js";
import { CreateUserSkillDto } from "./dto/create-user-skill.dto.js";

@Injectable()
export class UserSkillService {
  constructor(private readonly prisma: PrismaService) {}

  async getSkills(userId: number) {
    const users = await this.prisma.db.orm.public.User
      .where({ id: userId })
      .all();

    if (users.length === 0) {
      throw new NotFoundException("User not found");
    }

    return this.prisma.db.orm.public.UserSkill
      .where({ userId })
      .all();
  }

  async addSkill(userId: number, data: CreateUserSkillDto) {
    const users = await this.prisma.db.orm.public.User
      .where({ id: userId })
      .all();

    if (users.length === 0) {
      throw new NotFoundException("User not found");
    }

    const name = data.name?.trim();
    const proficiency = data.proficiency?.trim();

    if (!name || !proficiency) {
      throw new BadRequestException(
        "Skill name and proficiency are required",
      );
    }

    const existingSkills = await this.getSkills(userId);

    if (
      existingSkills.some(
        (skill) => skill.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      throw new BadRequestException(
        "This skill has already been added",
      );
    }

    return this.prisma.db.orm.public.UserSkill.create({
      userId,
      name,
      proficiency,
    });
  }

  async analyzeSkillGap(userId: number, careerId: number) {
    const users = await this.prisma.db.orm.public.User
      .where({ id: userId })
      .all();

    if (users.length === 0) {
      throw new NotFoundException("User not found");
    }

    const careers = await this.prisma.db.orm.public.Career
      .where({ id: careerId })
      .all();

    const career = careers[0];

    if (!career) {
      throw new NotFoundException("Career not found");
    }

    const userSkills = await this.getSkills(userId);

    const requiredSkills =
      await this.prisma.db.orm.public.CareerSkill
        .where({ careerId })
        .all();

    const currentSkillNames = new Set(
      userSkills.map((skill) => skill.name.trim().toLowerCase()),
    );

    const matchedSkills = requiredSkills.filter((skill) =>
      currentSkillNames.has(skill.name.trim().toLowerCase()),
    );

    const missingSkills = requiredSkills.filter(
      (skill) =>
        !currentSkillNames.has(skill.name.trim().toLowerCase()),
    );

    const coveragePercentage =
      requiredSkills.length === 0
        ? 0
        : Math.round(
            (matchedSkills.length / requiredSkills.length) * 100,
          );

    return {
      userId,
      careerId,
      careerName: career.name,
      totalRequiredSkills: requiredSkills.length,
      matchedCount: matchedSkills.length,
      missingCount: missingSkills.length,
      coveragePercentage,
      matchedSkills,
      missingSkills,
    };
  }
}
