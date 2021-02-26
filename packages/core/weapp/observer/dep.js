// import type Watcher from './watcher'
import { remove } from '../util/index';

let uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  removeSub(sub) {
    remove(this.subs, sub);
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    // stabilize the subscriber list first
    // 复制产生一个新的数组 这里不能理解 原数组没有改变 也没有返回值 是为了什么呢？
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update(); // +而且还没有这个方法 可能其他地方有吧
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
const targetStack = [];

export function pushTarget(_target) {
  if (Dep.target) targetStack.push(Dep.target);
  Dep.target = _target;
}

export function popTarget() {
  Dep.target = targetStack.pop();
}
