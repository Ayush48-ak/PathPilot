import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";
import { CreateUserProfileDto } from "./dto/create-user-profile.dto.js";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto.js";

@Injectable()
export class UserProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(data: CreateUserProfileDto) {
    return this.prisma.db.orm.public.UserProfile.create(data);
  }

  async getProfiles() {
    return this.prisma.db.orm.public.UserProfile.all();
  }

  async updateProfile(id: number, data: UpdateUserProfileDto) {
    return this.prisma.db.orm.public.UserProfile
      .where({ id })
      .update({
        education: data.education,
        currentDegree: data.currentDegree,
        graduationYear: data.graduationYear,
        previousBackground: data.previousBackground,
        experienceLevel: data.experienceLevel,
        careerGoal: data.careerGoal,
      });
  }
}