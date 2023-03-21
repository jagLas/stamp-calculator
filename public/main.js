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
}


window.onload = () => {
    console.log(stamps)
    const submit = document.querySelector('#addStampButton');
    submit.addEventListener('click', (e)=> {
        e.preventDefault();
        addToInventory();
    })
}
