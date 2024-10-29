"use strict";
function createProxy(target, handler) {
    return new Proxy(target, {
        get(target, prop) {
            if (handler.get) {
                return handler.get(target, prop);
            }
            return target[prop];
        },
        set(target, prop, value) {
            if (handler.validate && !handler.validate(prop, value)) {
                throw new Error("Invalid value");
            }
            if (handler.set) {
                return handler.set(target, prop, value);
            }
            target[prop] = value;
            return true;
        },
        has(target, prop) {
            console.log(`Checking if "${String(prop)}" property exists on target object`);
            return prop in target;
        },
    });
}
const user = createProxy({
    name: "John",
    age: 30,
    role: "admin",
}, {
    get(target, property) {
        console.log(`Accessing ${String(property)}`);
        return target[property];
    },
    validate(property, value) {
        if (property === "age" && typeof value === "number") {
            return value >= 0 && value <= 150;
        }
        return true;
    },
});
console.log(user.age);
