import { XIntegration } from "../Integrations/XIntegration";
import { database } from "../Database/Database";
import { TweetV2 } from "twitter-api-v2";

export class PostService {
  private xIntegration = new XIntegration();

  /**
   * receive all posts which mentioned the given handle
   *
   * Return only the posts on the users own timeline
   *
   * @returns Array of posts
   */
  async getMentionedPosts(): Promise<TweetV2[]> {
    let sinceId = await database.get("since_id");

    if (sinceId === null) {
      sinceId = "";
    }

    return this.xIntegration.getMentionedPosts(sinceId).then((data) => {
      //check if there is data
      //save the latest post id to work from there in next call
      //This way you don't receive the same posts over and over again
      if (data.length > 0) {
        database.set("since_id", data[0]?.id);
      }

      //Posts with no referenced_tweets are post on the users own timeline
      return data.filter((post) => post.referenced_tweets === undefined);
    });
  }

  /**
   * Reply to the post with text and/or an image
   *
   * @param post The original post with the mentioned handle
   * @param text Text to use in the reply
   * @param image base64 encoded string of the image to use in the reply
   *
   * @returns boolean if reply is received
   */
  async replyToPostWithImageText(
    post: TweetV2,
    image: Buffer,
    text: string
  ): Promise<boolean> {
    //Step 1: Upload image to twitter. MediaId is returned
    let mediaId = await this.xIntegration.uploadMedia(image);

    //Step 2: Create a new post
    this.xIntegration.replyToPost(post.id, text, mediaId);

    return true;
  }
}
