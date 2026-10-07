import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";
import { CreateCareerDto } from "./dto/create-career.dto.js";

@Injectable()
export class CareerPathService {
  constructor(private readonly prisma: PrismaService) {}

  async getCareerPaths() {
    return this.prisma.db.orm.public.Career.all();
  }

  async getCareerPath(id: number) {
    return this.prisma.db.orm.public.Career
      .where({ id })
      .all();
  }

  async createCareer(data: CreateCareerDto) {
    return this.prisma.db.orm.public.Career.create(data);
  }
}