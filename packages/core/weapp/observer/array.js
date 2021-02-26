/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def, hasOwn, isObject } from '../util/index';
import { cleanPaths } from './observerPath';

const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);

const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method];
  // +关于这一部分的使用可以看看MDN
  // +https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create#%E4%BD%BF%E7%94%A8_object.create_%E7%9A%84_propertyobject%E5%8F%82%E6%95%B0
  // +重写数组方法后调用的的是arrayMethods而不是数组的方法
  def(arrayMethods, method, function mutator(...args) { // 获取不可迭代的参数数组
    const len = this.length;
    // 不知道this.length是指什么？？？？？
    // 清除已经失效的 paths
    if (len > 0) {
      switch (method) {
        case 'pop':
          delInvalidPaths(len - 1, this[len - 1], this);
          break;
        case 'shift':
          delInvalidPaths(0, this[0], this);
          break;
        case 'splice':
        case 'sort':
        case 'reverse':
          for (let i = 0; i < this.length; i++) {
            delInvalidPaths(i, this[i], this);
          }
      }
    }

    const result = original.apply(this, args);
    const ob = this.__ob__;
    const vm = ob.vm;

    // push parent key to dirty, wait to setData
    if (vm.$dirty) {
      if (method === 'push') {
        const lastIndex = ob.value.length - 1;
        vm.$dirty.set(ob.op, lastIndex, ob.value[lastIndex]);
      } else {
        vm.$dirty.set(ob.op, null, ob.value);
      }
    }

    // 这里和 vue 不一样，所有变异方法都需要更新 path
    ob.observeArray(ob.key, ob.value);

    // notify change
    ob.dep.notify();
    return result;
  });
});

function delInvalidPaths(key, value, parent) {
  if (isObject(value) && hasOwn(value, '__ob__')) {
    // delete invalid paths
    cleanPaths(key, value.__ob__.op, parent.__ob__.op);
  }
}
