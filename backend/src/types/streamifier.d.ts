declare module "streamifier" {
  import { Readable } from "stream";

  const streamifier: {
    createReadStream: (buffer: Buffer | Uint8Array) => Readable;
  };

  export default streamifier;
}
