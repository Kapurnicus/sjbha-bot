//@ts-nocheck
export default function dotNotate(obj: object, target={}, prefix=""): Record<string, any> {
  Object.keys(obj).forEach((key) => {
    if (typeof(obj[key]) === "object" ) {
      dotNotate(obj[key],target,prefix + key + ".");
    } else {
      return target[prefix + key] = obj[key];
    }
  });

  return target;
}