interface ProxyHandler<T extends object> {
  get?<K extends keyof T>(target: T, property: K): T[K] | Promise<T[K]>;
  set?<K extends keyof T>(
    target: T,
    property: K,
    value: T[K]
  ): boolean | Promise<boolean>;
  validate?<K extends keyof T>(
    property: K,
    value: T[K]
  ): boolean | Promise<boolean>;
}

function createProxy<T extends object>(target: T, handler: ProxyHandler<T>): T {
  return new Proxy(target, {
    get<K extends keyof T>(target: T, prop: K): any {
      if (handler.get) {
        return handler.get(target, prop as keyof T);
      }
      return target[prop];
    },
    set<K extends keyof T>(target: T, prop: K, value: T[K]): any {
      if (handler.validate && !handler.validate(prop as keyof T, value)) {
        throw new Error("Invalid value");
      }
      if (handler.set) {
        return handler.set(target, prop as keyof T, value);
      }
      target[prop] = value;
      return true;
    },
    has(target, prop) {
      console.log(
        `Checking if "${String(prop)}" property exists on target object`
      );
      return prop in target;
    },
  });
}
// Usage:
interface User {
  name: string;
  age: number;
  role: string;
}
const user = createProxy<User>(
  {
    name: "John",
    age: 30,
    role: "admin",
  },
  {
    get(target: User, property: keyof User) {
      console.log(`Accessing ${String(property)}`);
      return target[property];
    },
    validate(property, value) {
      if (property === "age" && typeof value === "number") {
        return value >= 0 && value <= 150;
      }
      return true;
    },
  }
);

console.log(user.age);
