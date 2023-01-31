const {Stamp, Inventory} = require('./classes')

function selectStamps(inventory, target) {

    //checks for valid input. Requires Inventory class
    if (inventory instanceof Inventory === false) {
        throw new TypeError('argument not an instance of Inventory')
    }

    if (typeof target !== 'number') {
        throw new TypeError('argument should be a number')
    }

    //creates a deep copy of the inventory for modification
    let copy = copyInventory(inventory);

    //create an array for every stamp in inventory and sorts it from greatest to least
    let stamps = [];
    for (const stamp in copy) {
        //excludes stamps that are more than the target value and non-zero
        if (copy[stamp].val <= target && copy[stamp].qty > 0) {
            stamps.push(copy[stamp])
        }
    }

    //sorts the stamps from greatest to least
    stamps.sort((a,b) => b.val - a.val);

    //base case for recursion. If there are no stamps left that are lower than target, return undefined
    if (stamps.length === 0) {
        return;
    }
    
    /*The following algorithm generally works as follows.
        1) Choose the highest stamp
            a) create a separate copy of the inventory
            b) decrement the stamp qty in the new copy to reflect being chosen
            c) recurse with the target lowered by the stamp value and the decremented inventory
                store this recursion as a variable. These are all sub combinations to the chosen stamp
            d) if the subCombo is undefined, base case has been hit. Create a new Inventory
                to store the current stamp. and push it to the selected array
            e) if subCombo is a returned array, then for each index add the current stamp to that inventory
                and push to the selected array
        2) Remove the current stamp value entirely from inventory copy and set it's value in stamps
            array to infinity so that it will no longer be selected for future combinations
        3) Iterate to next highest stamp to create all combos that don't have the highest stamp
    */
        
    let selected = [];
    for (let i = 0; i < stamps.length; i++) {

        let s1 = stamps[i].val;
        //if stamp is less than target
        if (s1 <= target) {
            //copy the inventory again
            let loopCopy = copyInventory(copy);
            //remove stamp from inventory
            loopCopy.addStamp(s1, -1);
            //find all sub combinations to this stamp
            let subCombos = selectStamps(loopCopy, target - s1)

            if (subCombos === undefined) {
                //create a new Inventory if it's first stamp being added
                let combo = new Inventory;
                combo.addStamp(s1, 1);
                selected.push(combo);
            } else {
                //otherwise, add the stamp to each subCombos inventory
                subCombos.forEach(subCombo => {
                    subCombo.addStamp(s1, 1);
                    selected.push(subCombo);
                })
                
            }
        }

        //remove the stamp type from inventory list
        let qty = stamps[i].qty;
        copy.addStamp(s1, -qty);
    }
    
    return selected;
}

function copyInventory (inventory) {
    //creates new instance of Inventory class
    let copy = new Inventory();

    //goes through each value in the inventory and adds it to the copy
    Object.values(inventory).forEach(stamp => {
        copy.addStamp(stamp.val, stamp.qty);
    })

    return copy;
}

function findBestCombo(inventory, postage) {
    let inventoryCopy = copyInventory(inventory);
    if (inventoryCopy.calcValue() < postage) {
        return 'Not Enough for Postage'
    }

    //Finds all possible combinations of stamps less than or equal to the postage
    let combos = selectStamps(inventory, postage);

    //calculates each one's total value and the number of stamps
    combos.forEach(combo => {
        combo.calcValue()
        combo.calcQty();
    })

    
    //filters to combinations that meet postage requirements
    combos = combos.filter(combo => {
        if (combo.totalVal === postage) {
            return combo;
        }
    })

    //sorts them from fewest number of stamps to most
    combos.sort((a,b) => {
        return a.totalQty - b.totalQty;
    })

    //if no combination of stamps exist equal to the postage, recurse with the postage increased by 1
    if (combos.length === 0) {
        return findBestCombo(inventory, postage + 1)
    }

    //once a combo has been found equal to the postage, return the combo
    return combos[0];
}

let test = new Inventory;
test.addStamp(1,2);
test.addStamp(2,1);
test.addStamp(7,2)
console.log(findBestCombo(test, 19))

// let mom = new Inventory;
// mom.addStamp(2, 11);
// mom.addStamp(4, 9);
// mom.addStamp(17, 27);
// mom.addStamp(23, 12);
// mom.addStamp(37, 33);
// mom.addStamp(39, 5);
// mom.addStamp(41, 12);

// console.log(findBestCombo(mom, 63))