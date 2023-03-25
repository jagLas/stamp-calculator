import { findBestCombo } from "./stampFunction.js"
import { Inventory } from "./classes.js"

const stamps = new Inventory();
let result;
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
    globalStampQueue = [];
    const inventory = document.querySelector('#inventory')

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


    const domStampNames = [];
    for (let i = 0; i < domStamps.length; i++) {
        const stampDiv = domStamps[i];
        const stampName = stampDiv.dataset.stampname;
        if(stampName) {
            domStampNames.push(stampName);
        }
    }

    if(domStamps.length === 1) {
        stampNames.forEach(stampName => {
            inventory.append(makeStamp(stampName, true));
    })
    }

    const makeStampQueue = [];
    const removeQueue = [];

    stampNames.forEach((stampName, i) => {
        const divI = i + 1;
        const stampDiv = domStamps[divI];
        if (stampDiv) {
            const divName = stampDiv.dataset.stampname;
            if (divName === stampName) {
                const input = document.querySelector(`[data-stampName="${stampName}"] > input`);
                input.value = stamps[stampName].qty;
            } else {
                removeQueue.push(divName);
                console.log('adding', stampName, 'to queue')
                makeStampQueue.push(stampName);
            }
        } else {
            makeStampQueue.push(stampName)
        }
    })
    
    if(domStamps.length - 1 > stampNames.length) {
        inventory.lastChild.remove();
    }

    console.log('stampQueue', makeStampQueue)
    console.log('remove queue', removeQueue)
    globalStampQueue = makeStampQueue;
    console.log('global preremove', globalStampQueue)
    removeStamps(removeQueue);
    console.log('Remaining stamps in queue', makeStampQueue)

    // let counter = 1;
    // while(stampNames.length > 0) {
    //     const name = stampNames.shift();
    //     let stampDiv = domStamps[counter];
    //     counter++;
    //     if (stampDiv) {
    //         const divName = stampDiv.dataset.stampname;
    //         if (divName === name) {
    //             const input = document.querySelector(`[data-stampName="${name}"] > input`);
    //             input.value = stamps[name].qty;
    //         } else {
    //             removeStamps([divName]);
    //             makeStampQueue.push(name);
    //             makeStampQueue.push(...stampNames)
    //             while(stampDiv.nextSibling && stampDiv.nextSibling.classList.contains('deleted') !== true) {
    //                 removeStamps([stampDiv.nextSibling.dataset.stampname])
    //                 stampDiv = stampDiv.nextSibling;
    //             }
    //             break;
    //         }
    //     } else {
    //         makeStampQueue.push(name);
    //         makeStampQueue.push(...stampNames)
    //         break;
    //     }
    // }


    // console.log(stampNames, makeStampQueue)


    //make this so it removes them from queue as processed. Turn into global variable
    //have the remove function trigger the make items command instead of timeout
    //find out why removing last item in list doesn't remove it
    console.log(globalStampQueue);


    showInstructions();
    // //Go through each stamp in inventory and
    // for (const stampName in stamps) {
    //     //find the stamps quantity and find it's input field
    //     const stamp = stamps[stampName];
    //     const quantity = stamp.qty;
    //     const input = document.querySelector(`[data-stampName="${stampName}"] > input`);
    //     if (input) {
    //         //if the input already exists, update the quantity
    //         // input.value = quantity;
    //     } else {
    //         //otherwise, make a new stamp div and add to DOM
    //         console.log('adding', stampName);
    //         const newStamp = makeStamp(stampName, true);
    //         inventory.append(newStamp)
    //     }
    // }


    // getNumRows(); //uncomment if turning back on slide out transitions
}

//this function calculates how big the css grid is in pixels and sets the css variable for transition
// function getNumRows() {
//     const root = document.documentElement
//     let gridRows = getComputedStyle(document.querySelector('#inventory'));
//     gridRows = gridRows.getPropertyValue('grid-template-rows')
//     gridRows = gridRows.split('px ')
//     let lastEntry = gridRows[gridRows.length - 1]
//     gridRows[gridRows.length - 1] = lastEntry.slice(0, lastEntry.indexOf('px'))
//     gridRows.map(rowHeight => {
//         return Number(rowHeight)
//     })
//     let divHeight = 0;
//     gridRows.forEach(height => {
//         divHeight += Number(height);
//     });
//     console.log(divHeight.toString() + 'px')
//     root.style.setProperty('--inventory-height', divHeight.toString() + 'px')
// }

function showInstructions () {
    const inventory = document.querySelector('#inventory');
    //check if instructions are the only thing in inventory
    if (inventory.children.length <= 1) {
        //if yes, removed hidden tag and turn into flexbox
        console.log('Inventory is currently empty')
        inventory.classList.remove('grid');
        document.querySelector('#instructions').classList.remove('hidden')
    } else {
        //if not, apply grid class to inventory and add hidden class to instructions
        document.querySelector('#instructions').classList.add('hidden')
        //turns css into grid class if stamps present
        inventory.classList.add('grid');
    }
}

function removeStamps(array) {
    // console.log('Stamps to remove', array)
    array.forEach(stamp => {
        console.log('removing', stamp);
        // document.querySelector(`[data-stampname="${stamp}"]`).remove();
        const stampDiv = document.querySelector(`[data-stampname="${stamp}"]`);
        stampDiv.classList.add('deleted');
        stampDiv.ontransitionend = () => {
            console.log('global', globalStampQueue)
            const newStamp = makeStamp(globalStampQueue.shift(), true);
            console.log('replacing with', newStamp)
            stampDiv.replaceWith(newStamp);
            console.log(globalStampQueue)
            showInstructions();
            // getNumRows();
        }
    })

}

function makeStamp(stampName, editable = false, inventory = stamps) {
    const stamp = inventory[stampName];
    const stampDiv = document.createElement('div');
    stampDiv.setAttribute('data-stampName', stampName)
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
    return stampDiv
}

//Creates a series of stamp divs to be displayed in inventory
function inventoryToHTML(inventory, editable = true) {
    if (inventory instanceof Inventory === false) {
        throw new TypeError('input must be of class inventory')
    }

    const div = document.createDocumentFragment('div');
    for (const entry in inventory) {
        div.appendChild(makeStamp(entry, editable, inventory))
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
