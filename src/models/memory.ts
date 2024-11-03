class Memory {
  data: number[];

  constructor() {
    this.data = Array(256).fill(0b0);
  }

  clear() {
    this.data.fill(0b0);
  }

  clone(): Memory {
    const newMemory = new Memory();
    newMemory.data = [...this.data];
    return newMemory;
  }
}

export default Memory;
