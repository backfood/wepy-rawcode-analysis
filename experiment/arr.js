// let arr = [1, 2, 45]
// let narr = arr.slice()
// narr.push(1, 3, 4)
// console.log(arr)
// console.log(narr)


/**
    let arr = []
    let obj = { a: 1, b: 2 }
    arr.push(obj)
    obj.a = 3
    console.log(arr)
 */


Object.defineProperty(Object.create(Array.prototype), 'push', {
    value: function mutator(...args) {
        console.log(this)
    },
    enumerable: false,
    writable: true,
    configurable: true
});


let arr = []
arr.push("")
console.log(arr)
