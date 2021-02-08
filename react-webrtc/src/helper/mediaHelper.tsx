export async function getUserMedia(): Promise<MediaStream> {
  try {
    const constraints = { video: true, audio: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    throw Error('Error opening video camera');
  }
}
