export class PersistentStorage {
  storage: any;
  length: number;

  constructor(storage: Storage) {
    this.storage = storage;
    this.length = storage.length;
  }

  clear(): void {
    this.storage.clear();
  }

  getItem<T>(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = this.storage.getItem(key) as any;
        resolve(JSON.parse(data));
      }, 0);
    });
  }

  key(index: number): string | null {
    throw new Error('Method not implemented.');
  }
  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
