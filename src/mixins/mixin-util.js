function deepMixin(obj1, obj2){
  let mixed = Object.assign(obj1);

  Object.keys(obj2).forEach(propName => {
    if (mixed.hasOwnProperty(propName) && typeof mixed[propName] === 'object'){
      mixed[propName] = deepMixin(mixed[propName], obj2[propName]);
    } else {
      mixed[propName] = obj2[propName];
    }
  });

  return mixed;
}

function mixin(obj, ...mixins){
  mixins.forEach(m => {
    obj = deepMixin(obj, m);
  });
  return obj;
}

export default mixin;
export { deepMixin };