import { findBestCombo } from "./stampFunction.js"
import { Inventory } from "./classes.js"

const stamps = new Inventory();

//function to enter data from form controls into stamps inventory
function addToInventory() {
    //uses the value and quantity inputs to add them to inventory
    const val = document.querySelector('#value');
    const qty = document.querySelector('#quantity');
    stamps.addStamp(parseInt(val.value), parseInt(qty.value));

    //changes the inputs back to empty
    val.value = '';
    qty.value = '';
    console.log('inventory updating...new inventory:', stamps)

    //updates the dom to reflect changes to stamps inventory
    refreshInventory();

    //saves inventory to local storage after modification
    localStorage.setItem('stamps', JSON.stringify(stamps));

    //puts focus back on the first input of the form
    val.focus();
}

//refreshes the html of inventory
function refreshInventory() {
    const inventory = document.querySelector('#inventory')
    //resets inventory to blank so duplicates aren't created
    inventory.innerHTML = '';
    
    //adds all items to the inventory
    inventory.append(inventoryToHTML(stamps));

    //turns css into grid class
    inventory.classList.add('grid');

    //if no stamps are added, remove grid class and show inner text
    if (Object.keys(stamps).length === 0) {
        console.log('Inventory is currently empty')
        inventory.classList.remove('grid');
        inventory.innerText = 'Add stamps to the inventory to get started'
    }
}

//Creates a series of stamp divs to be displayed in inventory
function inventoryToHTML(inventory, editable = true) {
    if (inventory instanceof Inventory === false) {
        throw new TypeError('input must be of class inventory')
    }

    const div = document.createDocumentFragment();
    for (const entry in inventory) {
        const stamp = inventory[entry];
        const stampDiv = document.createElement('div');
        stampDiv.setAttribute('class', 'stamp')

        const value = document.createElement('span');
        value.setAttribute('class', 'value')
        value.innerText = stamp.val;
        stampDiv.appendChild(value);

        const mult = document.createElement('div');
        mult.setAttribute('class', 'mult');
        mult.innerText = 'X'
        stampDiv.appendChild(mult);

        let quantity;

        if(editable) {
            quantity = document.createElement('input');
            quantity.setAttribute('type', 'number')
            quantity.value = stamp.qty

            //creates the listener so that inventory amounts can be altered
            quantity.addEventListener('change', (e) => {
                stamps.setStamp(parseInt(stamp.val), parseInt(quantity.value));
                localStorage.setItem('stamps', JSON.stringify(stamps));
                console.log('inventory updating...new inventory:', stamps);

                //refreshes shown inventory only if a stamp would be removed
                if (parseInt(quantity.value) <= 0){
                    refreshInventory();
                }
            })
        } else {
            quantity = document.createElement('span');
            quantity.innerText = stamp.qty
        }

        quantity.setAttribute('class', 'quantity')


        stampDiv.appendChild(quantity)
        div.appendChild(stampDiv)
    }

    return div;
}

function refreshResult(inventory) {
    const result = document.querySelector('#result > .inventory')
    result.innerHTML = '';
    result.classList.add('grid')
    document.querySelector('#res-qty').innerText = inventory.totalQty;
    document.querySelector('#postage').innerText = inventory.totalVal;
    delete inventory.totalQty;
    delete inventory.totalVal;
    result.appendChild(inventoryToHTML(inventory, false));
}

//function sets the stamps variable to the inventory saved in local storage
function restoreInventory() {
    let stampJSON = localStorage.getItem('stamps');
    stampJSON = JSON.parse(stampJSON);

    for (const stamp in stampJSON) {
        stamps.addStamp(stampJSON[stamp].val, stampJSON[stamp].qty);
    }
    console.log('previous inventory:', stamps);
}

window.onload = () => {
    document.querySelector('#addStampButton').addEventListener('click', (e)=> {
        e.preventDefault();
        addToInventory();
    })

    document.querySelector('#calculate').addEventListener('click', (e) => {
        e.preventDefault();
        const postage = document.querySelector('#desired-postage');
        const res = findBestCombo(stamps, parseInt(postage.value));
        if (res instanceof Inventory) {
            refreshResult(res);
        } else {
            document.querySelector('#result > .inventory').innerText = res
        }

    })

    document.querySelector('#clear-inventory').addEventListener('click', (e) => {
        e.preventDefault();
        stamps.clearInventory();
        localStorage.setItem('stamps', JSON.stringify(stamps));
        refreshInventory();
    })

    restoreInventory();
    refreshInventory();
}
