//@ts-expect-error This does not exist outside of polyfill which this is doing
if (typeof Promise.withResolvers !== "function") {
    //@ts-ignore
    Promise.withResolvers = function <T>() {
      let resolve!: (value: T | PromiseLike<T>) => void;
      let reject!: (reason?: any) => void;
      const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }
  
  export {};