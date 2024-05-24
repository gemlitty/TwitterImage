import { TweetV2 } from "twitter-api-v2";
import { database } from "../Database/Database";
import { ImageService } from "./ImageService";
import { PostService } from "./PostService";

/**
 * Main scheduler
 */
export class ScheduleService {
  private imageService = new ImageService();
  private postService = new PostService();

  /**
   * Check posts which mention the X handle and reply with text/image
   */
  mentionedPostsAndReply(): void {
    //Receive all non replied posts
    this.postService.getMentionedPosts().then((posts) => {
      posts.forEach(async (post) => {
        // Check if user can generate an image
        if (!this.canGenerateImage(post)) {
          return;
        }

        //generate image for every post -> returns base64 encoded image
        let image = await this.imageService.generateImage(post.text);

        //Reply to post with an image and optional text
        this.postService
          .replyToPostWithImageText(
            post,
            image,
            "Thank you for using the Koalaai image meme generator. Want to generate more? https://art.koalaai.vip/"
          )
          .then((success) => {
            //If reply is send then increment usage
            if (success) {
              this.incrementUsage(post.author_id);
            }
          });
      });
    });
  }

  /**
   * Check if the user can generate an image
   *
   * @param post
   * @returns
   */
  private async canGenerateImage(post: TweetV2): Promise<boolean> {
    if (post.author_id === undefined) {
      return false;
    }
    //Check if user exceeded max amount of image generations
    let amount = await database.get(post.author_id);
    if (amount !== null && parseInt(amount) > 50) {
      //@TODO maybe send a reply -> max amount of generations exceeded?
      return false;
    }

    return true;
  }

  /**
   * If user generated an image then increment the counter by 1
   *
   * @param authorId
   */
  private incrementUsage(authorId?: string): void {
    if (authorId === undefined) {
      return;
    }
    
    //Increase counter of X user
    database.get(authorId).then((data) => {
      let counter = 0;
      if (data !== null) {
        counter = parseInt(data);
      }

      database.set(authorId, `${++counter}`);
    });
  }
}
