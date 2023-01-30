const {Stamp, Inventory} = require('./classes')

function selectStamps(inventory, target) {
    if (inventory instanceof Inventory === false) {
        throw new TypeError('argument not an instance of Inventory')
    }

    //creates a deep copy of the inventory for modification
    let copy = new Inventory();
    Object.values(inventory).forEach(stamp => {
        copy.addStamp(stamp.val, stamp.qty);
    })

    //create an array for every stamp in inventory and sorts it from greatest to least
    let stamps = [];
    for (const stamp in copy) {
        for (let i = 0; i < copy[stamp].qty; i++) {
            stamps.push(copy[stamp].val);
        }
    }
    stamps.sort((a,b) => b - a);
    
    let selected = [];
    let total = 0;
    let index = 0;

    for (let i = 0; i < stamps.length - 1; i++) {
        for (let j = i; j < stamps.length; j++) {
            let stamp1 = stamps[i];
            let stamp2 = stamps[j];
            let sum = stamp1 + stamp2;
            if (sum >= target && sum <= target + 2) {
                if (!selected.toString().includes([stamp1, stamp2].toString())) {
                    selected.push([stamp1, stamp2])
                }
                
            }
        }
    }
  
    // while (total !== target){
    //     let curVal = stamps[index]
    //     if (curVal + total <= target) {
    //         selected.push(curVal);
    //         total += curVal;
    //     }
    //     index++;
    // }
    
    return selected;
    //use a function to combine all combinations of 2 stamp arrays, then iterate to three, etc, until it returns a value within tolerance
}

// function ()

let test = new Inventory;
// test.addStamp(40,2);
// test.addStamp(20,1);
// test.addStamp(3,2)
// console.log(selectStamps(test, 63))

let mom = new Inventory;
mom.addStamp(2, 11);
mom.addStamp(4, 9);
mom.addStamp(24, 27);
mom.addStamp(23, 12);
mom.addStamp(37, 33);
mom.addStamp(39, 5);
mom.addStamp(41, 2);

console.log(selectStamps(mom, 63))
// console.log(mom.getStamps())
// console.log(mom.getValues())