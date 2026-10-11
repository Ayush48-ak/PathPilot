
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { PrismaService } from "./prisma.service.js";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";
import { UserProfileService } from "./user-profile.service.js";
import { UserProfileController } from "./user-profile.controller.js";
import { CareerPathService } from "./career-path.service.js";
import { CareerPathController } from "./career-path.controller.js";
import { CareerSkillService } from "./career-skill.service.js";
import { CareerSkillController } from "./career-skill.controller.js";
import { RoadmapPhaseService } from "./roadmap-phase.service.js";
import { RoadmapPhaseController } from "./roadmap-phase.controller.js";
import { RoadmapTopicService } from "./roadmap-topic.service.js";
import { RoadmapTopicController } from "./roadmap-topic.controller.js";
import { CareerRoadmapService } from "./career-roadmap.service.js";
import { CareerRoadmapController } from "./career-roadmap.controller.js";
import { UserSkillService } from "./user-skill.service.js";
import { UserSkillController } from "./user-skill.controller.js";
import { TopicProgressService } from "./topic-progress.service.js";
import { TopicProgressController } from "./topic-progress.controller.js";

@Module({
  imports: [],
  controllers: [
    AppController,
    UsersController,
    UserProfileController,
    CareerPathController,
    CareerSkillController,
    RoadmapPhaseController,
    RoadmapTopicController,
    CareerRoadmapController,
    UserSkillController,
    TopicProgressController,
  ],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    UserProfileService,
    CareerPathService,
    CareerSkillService,
    RoadmapPhaseService,
    RoadmapTopicService,
    CareerRoadmapService,
    UserSkillService,
    TopicProgressService,
  ],
})
export class AppModule {}
