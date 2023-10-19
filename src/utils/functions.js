function createUUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    },
  );
  return uuid;
}

/*
  Turns this: { a: { b: "123" } }
  into this: { "a.b": "123" }
*/
const flattenObject = (obj = {}, parent) => {
  let res = {};

  for (const [key, value] of Object.entries(obj)) {
    const property = parent ? parent + "." + key : key;
    const flattened = {};

    if (value instanceof Date) {
      flattened[key] = value.toISOString();
    } else if (typeof value === "object" && value !== null) {
      res = { ...res, ...flattenObject(value, property) };
    } else {
      res[property] = value;
    }
  }

  return res;
};

export { createUUID, flattenObject };
