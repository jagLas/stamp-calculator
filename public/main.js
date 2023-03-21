import { findBestCombo } from "./stampFunction.js"
import { Inventory } from "./classes.js"

const stamps = new Inventory();

function addToInventory() {
    const val = document.querySelector('#value').value;
    const qty = document.querySelector('#quantity').value;
    // debugger
    stamps.addStamp(parseInt(val), parseInt(qty));
    console.log(stamps)
}


window.onload = () => {
    console.log(stamps)
    const submit = document.querySelector('#addStampButton');
    submit.addEventListener('click', (e)=> {
        e.preventDefault();
        addToInventory();
    })
}
