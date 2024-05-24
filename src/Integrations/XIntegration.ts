import { MentionedTestData } from "../TestData/MentionedTestData";
import { TweetV2, TweetV2PostTweetResult, TwitterApi } from "twitter-api-v2";

/**
 * COULD NOT TEST THIS CLASS, BECAUSE NO ACCESS TO THE BASIC X API
 */
export class XIntegration {
  private id = process.env.X_ID || "";
  private bearer = process.env.X_BEARER || "";

  private client = new TwitterApi(this.bearer);

  /**
   * Get all posts which mention the given X id/handle.
   *
   * After the call save the last post id and that post id is given as filter for the next call.
   * Returning only newly created posts
   *
   * @return Mentioned posts
   */
  async getMentionedPosts(sinceId: string = ""): Promise<TweetV2[]> {
    // @REMOVE THE IF STATEMENT WHEN NOT TESTING. LINES 18-37 SHOULD BE REMOVED
    if (process.env.APP_ENV === "local") {
      return MentionedTestData.data();
    }

    return await this.client.v2
      .userMentionTimeline(this.id, {
        expansions: "referenced_tweets.id%2Cauthor_id",
        since_id: sinceId,
      })
      .then((data) => data.data.data);
  }

  /**
   * Upload a base64 encoded image
   *
   * @param media base64 encoded
   * @returns media_id
   */
  async uploadMedia(media: Buffer): Promise<string> {
    return await this.client.v1.uploadMedia(media, { mimeType: "image/png" });
  }

  /**
   * Reply to post with image and text
   *
   * @param postId
   * @param text
   * @param mediaId
   * @returns
   */
  async replyToPost(
    postId: string,
    text: string,
    mediaId: string
  ): Promise<{ id: string; text: string }> {
    return await this.client.v2
      .tweet(text, {
        media: { media_ids: [mediaId] },
        reply: { in_reply_to_tweet_id: postId },
      })
      .then((data) => data.data);
  }
}
