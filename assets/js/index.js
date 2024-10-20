const amountInput = document.querySelector('[name="amount"]');
const yearInput = document.querySelector('[name="year"]');
const mortgageType = document.querySelectorAll('[name="mortgage-type"]');
const interestRate = document.querySelector('[name="interest-rate"]');
const submitButton = document.querySelector('.submit-btn');
const clearAll = document.querySelector('.clear-btn');
const form = document.querySelector('.mortgage-form');
const resultsDiv = document.querySelector('.results');
const radioBoxes = document.querySelectorAll('.radio-box');

class UI {
    displayResults(monthlyPayment, totalPayment, totalInterest){
        resultsDiv.innerHTML = `
        <h2 calss="results-title">Your results</h2>
        <p calss="paragraph">
            Your results are shown below based on the information you provided.
            To adjust the results, edit the form and click “calculate repayments” again.
        </p>
        <div class="result-inside-box">
            <p>Your monthly repayments</p>
            <span class="result-sum">£${this.formatNumber(monthlyPayment)}</span>
            <div class="hr"></div>
            <p>Total you'll repay over the term</p>
            <span class="total">£${this.formatNumber(totalPayment + totalInterest)}</span>
        </div>  
    `;

    }
    formatNumber(number) {
        return number.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    getInputs(){
        const amount = parseFloat(amountInput.value);
        const years = parseFloat(yearInput.value);
        const rate = parseFloat(interestRate.value) / 100 / 12;
        const type = Array.from(mortgageType).find(radio => radio.checked).value;
        return { amount, years, rate, type };
    }
    appLogic(e){
        e.preventDefault();
        const { amount, years, rate, type } = this.getInputs();
        const months = years * 12;

        let monthlyPayment, totalPayment, totalInterest;

        if (type === 'repayment') {
            monthlyPayment = (amount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
            totalPayment = monthlyPayment * months;
            totalInterest = totalPayment - amount;
        } else { // interest-only
            monthlyPayment = amount * rate;
            totalPayment = monthlyPayment * months + amount;
            totalInterest = monthlyPayment * months;
        }

        this.displayResults(monthlyPayment, totalPayment, totalInterest);
    }
    clearAllFields(){
        form.reset();
        // resultsDiv.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    radioBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const radio = box.querySelector('input[type="radio"]');
            radio.checked = true;
            // Trigger a change event in case you have other logic depending on this
            radio.dispatchEvent(new Event('change'));
        });
    }); 

    const ui = new UI();
    form.addEventListener('submit', (e) => ui.appLogic(e));
    clearAll.addEventListener('click', () => ui.clearAllFields());
});