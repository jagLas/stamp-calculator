import { findBestCombo } from "./stampFunction.js"
import { Inventory } from "./classes.js"

const stamps = new Inventory();
let globalStampQueue = [];

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
    const inventory = document.querySelector('#inventory');

    //make a list of all stamps still in inventory
    let stampNames = Object.keys(stamps);
    stampNames.sort((a, b) => {
        if (stamps[a].val > stamps[b].val) {
            return -1;
        } else {
            return 1;
        }
    })

    //create a list of stamps already in dom
    const domStamps = inventory.children;

    //initialize a queue for stamps to be removed and made
    const makeStampQueue = [];
    const removeQueue = [];

    //iterate through each stamp type in inventory
    stampNames.forEach((stampName, i) => {
        //start at +1 to skip the instructions div
        const divI = i + 1;
        const stampDiv = domStamps[divI];
        //if there is a corresponding stampDiv in DOM
        if (stampDiv) {
            const divName = stampDiv.dataset.stampname;
            //check if the stamp name matches
            if (divName === stampName) {
                //if it does update the value of the input
                const input = document.querySelector(`[data-stampName="${stampName}"] > input`);
                input.value = stamps[stampName].qty;
            } else {
                //otherwise, add that div to the queue to be removed.
                removeQueue.push(divName);
                // console.log('adding', stampName, 'to queue')
                //and queue the stamp that should be at that position to be made
                makeStampQueue.push(stampName);
            }
        } else {
            //if the stamp div does not exist, then add the inventory stamp to the queue to be made into the DOM
            makeStampQueue.push(stampName);
        }
    })
    
    //the following removes adds any divs that are longer than the inventory to the removeQueue
    if(domStamps.length - 1 > stampNames.length) {
        let i = 1 + stampNames.length;
        while (i < domStamps.length) {
            const name = domStamps[i].dataset.stampname;
            // console.log(name)
            removeQueue.push(name);
            i++;
        }
    }

    //global stamp queue is necessary for now so that the add stamps function can access it
    globalStampQueue = makeStampQueue;
    removeStamps(removeQueue);

    //incase nothing was removed, trigger the make stamps function. Otherwise, stamps are added at the end of remove stamps function
    if (removeQueue.length === 0) {
        makeStamps(globalStampQueue);
        globalStampQueue = [];
    }
}

//makes stamps for the inventory screen and adds them
function makeStamps(array) {
    const inventory = document.querySelector('#inventory');
    array.forEach(stampName => {
        inventory.append(makeStamp(stampName, true));
    })

    //after making all of the stamps, check if instructions should be shown
    showInstructions();
}


function showInstructions () {
    const inventory = document.querySelector('#inventory');
    //check if instructions are the only thing in inventory
    if (inventory.children.length <= 1) {
        //if yes, removed hidden tag and turn into flexbox
        console.log('Inventory is currently empty');
        inventory.classList.remove('grid');
        document.querySelector('#instructions').classList.remove('hidden');
    } else {
        //if not, apply grid class to inventory and add hidden class to instructions
        document.querySelector('#instructions').classList.add('hidden');
        //turns css into grid class if stamps present
        inventory.classList.add('grid');
    }
}

function removeStamps(array) {
    // console.log('Stamps to remove', array)
    array.forEach(stamp => {
        // console.log('removing', stamp);
        //find the corresponding stampDiv
        const stampDiv = document.querySelector(`#inventory [data-stampname="${stamp}"]`);
        //add the deleted class for transition effect
        stampDiv.classList.add('deleted');
        stampDiv.ontransitionend = () => {
            //remove it when transition is done, call makeStamps with the queue, and reset the queue; 
            stampDiv.remove();
            makeStamps(globalStampQueue);
            globalStampQueue = [];
        }
    })
}

function makeStamp(stampName, editable = false, inventory = stamps) {
    const stamp = inventory[stampName];
    const stampDiv = document.createElement('div');
    stampDiv.setAttribute('data-stampName', stampName);
    stampDiv.setAttribute('class', 'stamp');

    const value = document.createElement('span');
    value.setAttribute('class', 'value');
    value.innerText = stamp.val;
    stampDiv.appendChild(value);

    const mult = document.createElement('div');
    mult.setAttribute('class', 'mult');
    mult.innerText = 'X';
    stampDiv.appendChild(mult);

    let quantity;

    if(editable) {
        quantity = document.createElement('input');
        quantity.setAttribute('type', 'number');
        quantity.value = stamp.qty;

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
        quantity.innerText = stamp.qty;
    }

    quantity.setAttribute('class', 'quantity');


    stampDiv.appendChild(quantity);
    return stampDiv;
}

function refreshResult(inventory) {
    const result = document.querySelector('#result > .inventory')
    result.innerHTML = '';
    result.classList.add('grid');

    //sets the summary information and removes those keys from the inventory list
    document.querySelector('#res-qty').innerText = inventory.totalQty;
    document.querySelector('#postage').innerText = inventory.totalVal;
    delete inventory.totalQty;
    delete inventory.totalVal;

    //sorts the stamps and adds a stamp for each one
    const stamps = Object.keys(inventory)
    stamps.sort((a, b) => {
        if (inventory[a].val > inventory[b].val) {
            return -1;
        } else {
            return 1;
        }
    })

    stamps.forEach(stamp => {
        result.appendChild(makeStamp(stamp, false, inventory));
    })
}

//function sets the stamps variable to the inventory saved in local storage
function restoreInventory() {
    let stampJSON = localStorage.getItem('stamps');
    stampJSON = JSON.parse(stampJSON);

    for (const stamp in stampJSON) {
        stamps.addStamp(stampJSON[stamp].val, stampJSON[stamp].qty);
    }
    console.log('Loading inventory from localStorage:', stamps);
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
            console.log('result', res);
            refreshResult(res);
        } else {
            document.querySelector('#result > .inventory').innerText = res;
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
