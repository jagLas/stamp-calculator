import { findBestCombo } from "./stampFunction.js"
import { Inventory } from "./classes.js"

const stamps = new Inventory();

function addToInventory() {
    const val = document.querySelector('#value');
    const qty = document.querySelector('#quantity');
    // debugger
    stamps.addStamp(parseInt(val.value), parseInt(qty.value));
    val.value = '';
    qty.value = '';
    refreshInventory();
    console.log(stamps)
    localStorage.setItem('stamps', JSON.stringify(stamps));
}

function refreshInventory() {
    const inventory = document.querySelector('#inventory')
    inventory.innerHTML = '';

    for (const entry in stamps) {
        const stamp = stamps[entry];
        const stampDiv = document.createElement('div');

        const quantity = document.createElement('span');
        quantity.innerText = `${stamp.qty} x `
        stampDiv.appendChild(quantity)

        const value = document.createElement('span');
        value.innerText = stamp.val;
        stampDiv.appendChild(value);

        inventory.appendChild(stampDiv)
    }
}

window.onload = () => {
    console.log(stamps)
    const submit = document.querySelector('#addStampButton');
    submit.addEventListener('click', (e)=> {
        e.preventDefault();
        addToInventory();
    })
    document.querySelector('#calculate').addEventListener('click', (e) => {
        const res = findBestCombo(stamps, 4);
        console.log(res)
    })
}
