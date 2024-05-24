import fs from "fs";
import { TweetV2 } from "twitter-api-v2";

export class MentionedTestData {
  static async data(): Promise<TweetV2[]> {
    return await new Promise((resolve, reject) => {
      fs.readFile(
        `${__dirname}/data/mentionpostdata.json`,
        "utf-8",
        (err, content) => {
          if (err) {
            reject(err);
          } else {
            try {
              resolve(JSON.parse(content).data);
            } catch (err) {
              reject(err);
            }
          }
        }
      );
    });
  }
}
