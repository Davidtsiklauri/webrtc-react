class MediaHelper {
  public async getUserMedia(): Promise<MediaStream> {
    // , audio: true
    try {
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } catch (error) {
      throw Error('Error opening video camera');
    }
  }
}

export const userMedia = new MediaHelper();
