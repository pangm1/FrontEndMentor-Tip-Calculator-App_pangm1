const forms = Object.values(document.forms)
const inputForm = forms.find((v) => {
    return v.classList.contains('input-form');
});
const resultForm = forms.find((v) => {
    return v.classList.contains('result-form');
});

const billErrorText = document.querySelector('.label[for=\'bill\'] .error');
const billInput = inputForm.elements['bill'];
const tipErrorText = document.querySelector('.label[for=\'tip\'] .error');
const radioGroup = inputForm.elements['tip'];
const tipCustomInput = inputForm.elements['tip-custom-text'];
const numPeopleErrorText = document.querySelector('.label[for=\'people\'] .error');
const numPeopleInput = inputForm.elements['people'];

const resultTipText = resultForm.elements['tip-amount'];
const resultTotalText = resultForm.elements['total-amount'];
const resetButton = resultForm.elements['reset-forms'];


billInput.addEventListener('input', onInput);
numPeopleInput.addEventListener('input', onInput);

radioGroup.forEach(addEventListener.bind(null, 'change', onInput));

resetButton.addEventListener('click', resetForms);


function onInput(e) {
    const target = e.target;

    if (target.type === 'radio') {
        if (target.value === 'custom') {
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

    if (bill && tip && numPeople) {
        const [divTip, divTotal] = divideCash(bill, tip, numPeople);

        resultTipText.value = `$${divTip}`;
        resultTotalText.value = `$${ divTotal }`;
        resetButton.disabled = false;
    }
    else {
        resultForm.reset();
        resetButton.disabled = true;
    }
}

function validateInput() {
    let bill = Number.parseFloat(billInput.value);
    let errorShown = tryAndShowErrors([
        { test: !bill || bill <= 0, message: 'Must be >0' },
        { test: bill.toFixed(2) != bill, message: 'Must be whole cents' }]
        , billErrorText);
    if (!errorShown) {
        bill = null;
    }

    let numPeople = Number.parseFloat(numPeopleInput.value);
    errorShown = tryAndShowErrors([
        { test: !numPeople || numPeople <= 0, message: 'Must be >0' },
        { test: numPeople.toFixed(0) != numPeople, message: 'Must be an integer' }]
        , numPeopleErrorText);
    if (!errorShown) {
        numPeople = null;
    }


    let tip = radioGroup.value;
    errorShown = tryAndShowErrors([
        { test: !tip, message: 'Choose a tip' },
        { test: tip === 'custom' && tipCustomInput.value <= 0, message: 'Must be >0' }]
        , tipErrorText);
    if (!errorShown) {
        tip = null;
    }
    else if (tip === 'custom' && tipCustomInput.value > 0) {
        tip = tipCustomInput.value;
    }


    return [bill, tip, numPeople];
}

function tryAndShowErrors(tests, errorTextElement) {
    try {
        for (let {test, message} of tests) {
            if (test) {
                throw new Error(message);
            }
        }

        errorTextElement.classList.remove('show');
    }
    catch(error) {
        errorTextElement.textContent = error.message;
        errorTextElement.classList.add('show');
        return false;
    }
    return true;
}


function divideCash(bill, tip, numPeople) {
    const divTip = bill * tip / 100 / numPeople;
    const divTotal = divTip + bill / numPeople;
    return [divTip, divTotal];
}

function resetForms() {
    inputForm.reset();
    resultForm.reset();
    resetButton.disabled = true;
}