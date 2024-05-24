export class KokoIntegration {
  /**
   * Convert a text prompt to an image
   *
   * @param prompt string with the text to create the image
   * @returns url image
   */
  async generateImage(prompt: string): Promise<string> {
    if (process.env.APP_ENV === "local") {
      return "https://art.koalaai.vip/static/slideshow/generated-image-2024-04-03T20_43_42.605Z.png";
    }

    return "URL OF THE IMAGE";
  }
}
