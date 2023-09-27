import { MongoMemoryServer as MS } from "mongodb-memory-server";

export class MongoMemoryServer {
  static mongoUri: string;
  private static mongoServer: MS;

  static async start() {
    this.mongoServer = await MS.create();
    this.mongoUri = this.mongoServer.getUri();
  }

  static async stop() {
    await this.mongoServer.stop();
  }
}
