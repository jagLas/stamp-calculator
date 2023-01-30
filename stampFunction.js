const {Stamp, Inventory} = require('./classes')

function selectStamps(inventory, target) {
    if (inventory instanceof Inventory === false) {
        throw new TypeError('argument not an instance of Inventory')
    }



    //creates a deep copy of the inventory for modification
    let copy = copyInventory(inventory);

    //create an array for every stamp in inventory and sorts it from greatest to least
    let stamps = [];
    for (const stamp in copy) {
        if (copy[stamp].val <= target && copy[stamp].qty > 0) {
            stamps.push(copy[stamp])
        }
    }

    stamps.sort((a,b) => b.val - a.val);
    if (stamps.length === 0) {
        return;
    }
    
    let selected = [];
    for (let i = 0; i < stamps.length; i++) {
        // let loopSelected = [];
        let s1 = stamps[i].val;
        if (s1 <= target) {
            // loopSelected.push(s1);
            let loopCopy = copyInventory(copy);
            loopCopy['c' + s1.toString()].qty -= 1;

            let subCombos = selectStamps(loopCopy, target - s1)
            if (subCombos === undefined) {
                let combo = new Inventory;
                combo.addStamp(s1, 1);
                selected.push(combo);
            } else {
                subCombos.forEach(subCombo => {
                    // console.log(subCombo)
                    subCombo.addStamp(s1, 1);
                    selected.push(subCombo);
                })
                
            }
        }

        let qty = stamps[i].qty;
        copy.addStamp(s1, -qty);
        stamps[0] = Infinity;
    }

    
    return selected;
    //use a function to combine all combinations of 2 stamp arrays, then iterate to three, etc, until it returns a value within tolerance
}

function copyInventory (inventory) {
    let copy = new Inventory();
    Object.values(inventory).forEach(stamp => {
        copy.addStamp(stamp.val, stamp.qty);
    })

    return copy;
}

function findBestCombo(inventory, postage) {
    let combos = selectStamps(inventory, postage);
    combos.forEach(combo => {
        combo.calcValue()
        combo.calcQty();
    })
    
    combos = combos.filter(combo => {
        if (combo.totalVal === postage) {
            return combo;
        }
    })

    combos.sort((a,b) => {
        return a.totalQty - b.totalQty;
    })

    if (combos.length === 0) {
        return findBestCombo(inventory, postage + 1)
    }
    return combos[0];
}

// let test = new Inventory;
// test.addStamp(1,5);
// test.addStamp(2,3);
// test.addStamp(7,2)
// console.log(findBestCombo(test, 10))

let mom = new Inventory;
mom.addStamp(2, 11);
mom.addStamp(4, 9);
mom.addStamp(17, 27);
mom.addStamp(23, 12);
mom.addStamp(37, 33);
mom.addStamp(39, 5);
mom.addStamp(41, 12);

console.log(findBestCombo(mom, 63))