import { ProjectDocument } from "@/routes/project/project.schema";

const CREATE_PROJECT_STUB = {
  title: "title",
  description: "description",
  content: "content",
  thumbnail: "thumbnail",
  github: "github",
  page: "page",
  start: "2021-01-01",
  end: "2021-01-01",
};

const UPDATE_PROJECT_STUB = {
  _id: "id",
  ...CREATE_PROJECT_STUB,
};

const PROJECT_STUB = {
  ...UPDATE_PROJECT_STUB,
  nid: 1,
} as unknown as ProjectDocument;

export { CREATE_PROJECT_STUB, UPDATE_PROJECT_STUB, PROJECT_STUB };
