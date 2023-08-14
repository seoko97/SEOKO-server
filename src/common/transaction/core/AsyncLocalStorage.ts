import { AsyncLocalStorage } from "async_hooks";

class ALS {
  private static instance: ALS = new ALS();
  private asyncLocalStorage = new AsyncLocalStorage<Map<any, any>>();

  constructor() {
    return ALS.instance;
  }

  get store() {
    return this.asyncLocalStorage.getStore();
  }

  async run(fn: (...args: any[]) => any): Promise<any> {
    return await this.asyncLocalStorage.run(new Map(), fn);
  }

  set(key: any, value: any) {
    return this.store?.set(key, value);
  }

  get<T>(key: any): T {
    return this.store?.get(key);
  }
}

export { ALS };
