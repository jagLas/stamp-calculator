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

class Inventory {
    constructor() {    
    }

    addStamp (val, amount = 0) {
        if (typeof val !== 'number' || typeof amount !== 'number') {
            throw new TypeError('inputs should be numbers');
        }

        const stampName = 'c' + val.toString();

        if (this[stampName] === undefined) {
            this[stampName] = new Stamp(val, amount);
        } else {
            this[stampName].addQuantity(amount);
        }
    }

    // getStamps(){
    //     return Object.keys(this);
    // };

    // getValues() {
    //     //returns a sorted array from least to greatest of the values of each stamp in inventory.
    //     const values = [];
    //     for (const stamp in this) {
    //         values.push(this[stamp].val);
    //     }

    //     return values.sort((a, b) => a-b);
    // }

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
}

// let test = new Inventory;
// test.addStamp(1,5);
// test.addStamp(2,3);
// test.addStamp(7,2)
// console.log(test.calcQty())
// console.log(test)

// let mom = new Inventory;
// mom.addStamp(2, 11);
// mom.addStamp(4, 9);
// mom.addStamp(17, 27);
// mom.addStamp(23, 12);
// mom.addStamp(37, 33);
// mom.addStamp(39, 5);
// mom.addStamp(41, 12);

module.exports = {Stamp, Inventory}