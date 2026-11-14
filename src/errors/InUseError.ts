export class InUseError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "InUseError";
  }
}
