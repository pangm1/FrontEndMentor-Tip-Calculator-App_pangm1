const forms = Object.values(document.forms)
const inputForm = forms.find((v) => {
    return v.classList.contains('input-form');
});
const radioGroup = inputForm.elements['tip'];

const resultForm = forms.find((v) => {
    return v.classList.contains('result-form');
});
console.log(resultForm);

const billErrorText = document.querySelector('.label[for=\'bill\'] .error');
const billInput = document.querySelector('.field-input[name=\'bill\']');
const tipErrorText = document.querySelector('.label[for=\'tip\'] .error');
const tipRadioButtons = document.querySelectorAll('.field-input.radio');
const tipCustomInput = document.querySelector('.field-input[name=\'tip-custom\']');
const numPeopleErrorText = document.querySelector('.label[for=\'people\'] .error');
const numPeopleInput = document.querySelector('.field-input[name=\'people\']');

const resultTipText = document.querySelector('#tip-amount');
const resultTotalText = document.querySelector('#total-amount');
const resetButton = document.querySelector('.reset');

// TODO: fix tab order (especially for custom tip)

billInput.addEventListener('input', onInput);
numPeopleInput.addEventListener('input', onInput);

tipRadioButtons.forEach((e) => {
    e.addEventListener('change', onInput);
});

resetButton.addEventListener('click', resetForms);


function onInput(e) {
    const target = e.target;
    console.log(target);

    if (target.type === 'radio') {
        if (target.value === 'custom') {
            // console.log("Custom value");
            tipCustomInput.disabled = false;
            tipCustomInput.focus();
            tipCustomInput.addEventListener('input', onInput);
        }
        else {
            tipCustomInput.removeEventListener('input', onInput);
            tipCustomInput.value = '';
            tipCustomInput.disabled = true;
        }
    }
    

    const [bill, tip, numPeople] = validateInput();
    console.log(`Bill(${bill}) : Tip(${tip}) : People(${numPeople})`);

    if (bill && tip && numPeople) {
        const [divTip, divTotal] = divideCash(bill, tip, numPeople);
        console.log(`Tip Amount: ${divTip}\nTotal Amount: ${divTotal}`);

        resultTipText.value = `$${divTip}`;
        resultTotalText.value = `$${ divTotal }`;
        resetButton.disabled = false;
    }
    else {
        console.log('Invalid');
        resetButton.disabled = true;
    }
}

function validateInput() {
    const bill = Number.parseFloat(billInput.value);
    console.log('Bill: ' + bill);

    try {
        if (!bill || bill <= 0) {
            const message = 'Must be >0'
            throw new Error(message);
        }

        if (bill.toFixed(2) != bill) {
            const message = 'Must be whole cents'
            throw new Error(message);
        }

        billErrorText.classList.remove('show');
    } catch (error) {
        // console.log("Bill Error");
        // console.log(error.message);

        billErrorText.textContent = error.message;
        billErrorText.classList.add('show');
    }
    

    const numPeople = Number.parseFloat(numPeopleInput.value);
    console.log('Number of People: ' + numPeople);

    try {
        if (!numPeople || numPeople <= 0) {
            const message = 'Must be >0'
            throw new Error(message);
        }

        if (numPeople.toFixed(0) != numPeople) {
            const message = 'Has to be an integer'
            throw new Error(message);
        }

        numPeopleErrorText.classList.remove('show');
    } catch (error) {
        console.log("NumPeople Error");
        console.log(error.message);

        numPeopleErrorText.textContent = error.message;
        numPeopleErrorText.classList.add('show');
    }

    let tip = radioGroup.value;
    console.log('Tip: ' + tip);

    try {
        if (tip === 'custom') {
            console.log('Custom Tip');

            tip = tipCustomInput.value;

            if (tip < 0) {
                const message = 'Must be >0'
                throw new Error(message);
            }
        }
        else {
            if (tip <= 0) {
                const message = 'Choose a button'
                throw new Error(message);
            }
        }

        tipErrorText.classList.remove('show');
    } catch (error) {
        // console.log("Tip Error");
        // console.log(error.message);

        tipErrorText.textContent = error.message;
        tipErrorText.classList.add('show');
    }

    return [bill, tip, numPeople];
}

function divideCash(bill, tip, numPeople) {
    const divTip = bill * tip / 100 / numPeople;
    const divTotal = divTip + bill / numPeople;
    return [divTip, divTotal];
}

function resetForms() {
    inputForm.reset();
    resultForm.reset();
}