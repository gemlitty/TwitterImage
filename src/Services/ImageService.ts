import axios from "axios";
import { KokoIntegration } from "../Integrations/KokoIntegration";

export class ImageService {
  private kokoIntegration = new KokoIntegration();

  /**
   *
   * @param prompt unfiltered text prompt
   * @returns image buffer
   */
  async generateImage(prompt: string): Promise<Buffer> {
    //filter out the name of the X handle (e.a. @KOKOAIIMAGE)
    let filteredPrompt = prompt.replace(
      new RegExp(String.raw`${process.env.X_HANDLE}`, "g"),
      ""
    );

    let url = await this.kokoIntegration.generateImage(filteredPrompt);

    if (this.isValidUrl(url)) {
      return this.getImageFromURL(url);
    }

    throw new Error("Image not found!");
  }

  /**
   * Retreive image from the given URL
   *
   * @param url
   * @returns image buffer
   */
  private async getImageFromURL(url: string): Promise<Buffer> {
    return axios
      .get(url, { responseType: "arraybuffer" })
      .then((resp) => Buffer.from(resp.data, "binary"));
  }

  /**
   * Check if the url is valid
   *
   * @param url
   * @returns
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  }
}
