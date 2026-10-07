export class CreateUserProfileDto {
  userId: number;
  education?: string;
  currentDegree?: string;
  graduationYear?: number;
  previousBackground?: string;
  experienceLevel?: string;
  careerGoal?: string;
}