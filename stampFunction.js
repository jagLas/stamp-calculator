const {Stamp, Inventory} = require('./classes')

function selectStamps(inventory, target) {
    if (inventory instanceof Inventory === false) {
        throw new TypeError('argument not an instance of Inventory')
    }


}

let mom = new Inventory;
mom.addStamp(2, 11);
mom.addStamp(4, 9);
mom.addStamp(17, 27);
mom.addStamp(23, 12);
mom.addStamp(37, 33);
mom.addStamp(39, 5);
mom.addStamp(41, 12);

console.log(selectStamps(mom))
// console.log(mom.getStamps())
console.log(mom.getValues())

console.log(mom)