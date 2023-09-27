import { CreateExperienceDto } from "@/routes/experience/dto/create-experience.dto";
import { ExperienceDocument } from "@/routes/experience/experience.schema";

const CREATE_EXPERIENCE_STUB: CreateExperienceDto = {
  title: "경력1",
  description: "경력1",
  start: "2021-01-01",
  end: "2021-01-01",
};

const UPDATE_EXPERIENCE_STUB = {
  ...CREATE_EXPERIENCE_STUB,
  _id: "_id",
};

const EXPERIENCE_STUB = {
  ...UPDATE_EXPERIENCE_STUB,
} as unknown as ExperienceDocument;

export { CREATE_EXPERIENCE_STUB, UPDATE_EXPERIENCE_STUB, EXPERIENCE_STUB };
