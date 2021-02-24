export function Selector(selector: {}) {
  return (target, propertyKey, descriptor) => {
    console.log('Selector decorator');

    console.log(selector)
    console.log(target);
    console.log(propertyKey);
    console.log(descriptor);

    return descriptor;
  };
}
