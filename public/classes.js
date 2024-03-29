class Stamp {
    constructor (val, amount = 0) {
        this.val = val;
        this.qty = amount;
    }

    addQuantity(amount) {
        this.qty += amount;
        return this.qty;
    }
}

export class Inventory {
    constructor() {    
    }

    //adds a new stamp to the inventory, or adds that amount
    //to an existing stamp, and will clear zeros after
    addStamp (val, amount = 0) {
        if (isNaN(val) || isNaN(amount)) {
            throw new TypeError('inputs should be numbers');
        }

        const stampName = 'c' + val.toString();

        if (this[stampName] === undefined) {
            this[stampName] = new Stamp(val, amount);
        } else {
            this[stampName].addQuantity(amount);
        }

        this.clearZeroes(stampName);
    }

    //removes any stamp that has a quantity less than or equal to 0
    clearZeroes(stampName) {
        if (this[stampName].qty <= 0) {
            // console.log(`removing ${stampName} because qty is 0 or less`)
            delete this[stampName];
        }
    }

    //removes all stamps from inventory
    clearInventory(){
        for (const entry in this) {
            delete this[entry];
        }
    }

    //calculates the value of the inventory
    calcValue (){
        const stamps = Object.values(this);
        this.totalVal = 0;
        stamps.forEach(stamp => {
            const subVal = stamp.val * stamp.qty;
            if (typeof subVal === 'number') {
                this.totalVal += subVal;
            }
         
        })

        return this.totalVal;
    }

    //calculates the quantity of the inventory
    calcQty (){
        const stamps = Object.values(this);
        this.totalQty = 0;
        stamps.forEach(stamp => {
            if (typeof stamp.qty === 'number') {
                this.totalQty += stamp.qty;
            }
        })

        return this.totalQty;
    }

    //sets a stamps quantity to a specified amount
    setStamp(val, amount = 0) {
        if (isNaN(val) || isNaN(amount)) {
            throw new TypeError('inputs should be numbers');
        }

        const stampName = 'c' + val.toString();

        if (this[stampName] === undefined) {
            this[stampName] = new Stamp(val, amount);
        } else {
            this[stampName].qty = amount;
        }

        this.clearZeroes(stampName);
    }
}

// let test = new Inventory;
// test.addStamp(1,5);
// test.addStamp(2,3);
// test.addStamp(7,2)
// console.log(test.calcQty())
// console.log(test)

// let test2 = new Inventory;
// test2.addStamp(2, 11);
// test2.addStamp(4, 9);
// test2.addStamp(17, 27);
// test2.addStamp(23, 12);
// test2.addStamp(37, 33);
// test2.addStamp(39, 5);
// test2.addStamp(41, 12);
// console.log(test2);
// test2.clearInventory();
// console.log(test2)