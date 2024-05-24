import { exit } from "process";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

class Database {
  private client;

  constructor(host?: string, port?: string, password?: string) {
    this.client = createClient({
      url: `redis://default:${password}@${host}:${port}`,
    });

    this.client.on("error", (err) => {
      console.log("Database Redis client Error", err);
      exit;
    });

    this.client.connect();
  }

  disconnect() {
    this.client.disconnect();
  }

  public async get(id: string): Promise<string | null> {
    return await this.client.get(id);
  }

  public set(id: string, value: any, expire: number = 0) {
    if (expire === 0) {
      this.client.set(id, value);
    } else {
      this.client.set(id, value, { EX: expire }); // 1 minute
    }
  }
}

export let database = new Database(
  process.env.REDIS_HOST,
  process.env.REDIS_PORT,
  process.env.REDIS_PASSWORD
);
