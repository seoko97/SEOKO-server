import { Series } from "@/routes/series/series.schema";

interface IUpdatePostArgs {
  title?: string;
  content?: string;
  thumbnail?: string;
  series?: Series | null;
}

export { IUpdatePostArgs };
