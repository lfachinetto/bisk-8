class OpcodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpcodeError';
  }
}

export default OpcodeError;