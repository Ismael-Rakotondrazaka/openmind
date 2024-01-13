export class UploadedFile extends File {
  public readonly _buffer: Buffer;

  constructor({
    blobParts,
    name,
    options,
    buffer,
  }: {
    blobParts: BlobPart[];
    name: string;
    options?: FilePropertyBag;
    buffer: Buffer;
  }) {
    super(blobParts, name, options);

    this._buffer = buffer;
  }

  get buffer(): Buffer {
    return this._buffer;
  }
}
