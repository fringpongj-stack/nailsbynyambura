function updateDepositCalculation() {
    const serviceSelect = document.getElementById('service');
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    const deposit = selectedOption.getAttribute('data-deposit');
    const depositAmount = `KSh ${deposit}`;
    document.getElementById('depositDisplay').innerText = depositAmount;
    document.getElementById('promptedAmount').innerText = depositAmount;
}

function closePaymentPrompt() {
    const modal = document.getElementById('paymentPromptModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function showPaymentPrompt() {
    const modal = document.getElementById('paymentPromptModal');
    const input = document.getElementById('paymentPromptInput');
    const phoneInput = document.getElementById('clientPhonePrompt');
    const checkbox = document.getElementById('paymentPromptCheckbox');

    phoneInput.value = phoneInput.value || '';
    input.value = document.getElementById('mpesaRef').value;
    checkbox.checked = false;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => phoneInput.focus(), 50);
}

function handleWhatsAppBooking(event) {
    event.preventDefault();
    showPaymentPrompt();
}

function continueBookingFromPrompt() {
    const name = document.getElementById('name').value.trim();
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const depositDisplay = document.getElementById('depositDisplay').innerText;
    const housecall = document.getElementById('housecall').checked ? 'Yes (House Call Requested)' : 'No (In-Studio / Regular)';
    const notes = document.getElementById('notes').value.trim() || 'None provided';
    const enteredCode = document.getElementById('paymentPromptInput').value.trim();
    const depositConfirmed = document.getElementById('paymentPromptCheckbox').checked;
    const clientPhone = document.getElementById('clientPhonePrompt').value.trim();

    if (!depositConfirmed) {
        alert('Please confirm that you have sent the deposit before continuing.');
        return;
    }

    if (!enteredCode) {
        alert('Please enter your M-Pesa confirmation code to continue.');
        return;
    }

    if (!clientPhone) {
        alert('Please enter the client phone number before continuing.');
        return;
    }

    document.getElementById('mpesaRef').value = enteredCode;
    closePaymentPrompt();

    const phoneNumber = "254759997961";
    const message = `Hello Nails by Nyambura! 👋%0A%0A` +
        `I have submitted my 50% deposit payment and would like to confirm my booking:%0A` +
        `• *Name:* ${encodeURIComponent(name)}%0A` +
        `• *Service:* ${encodeURIComponent(service)}%0A` +
        `• *50% Deposit Paid:* ${encodeURIComponent(depositDisplay)}%0A` +
        `• *M-Pesa Code:* ${encodeURIComponent(enteredCode)}%0A` +
        `• *Date:* ${encodeURIComponent(date)}%0A` +
        `• *House Call:* ${encodeURIComponent(housecall)}%0A` +
        `• *Design Ideas/Location:* ${encodeURIComponent(notes)}`;

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

window.addEventListener('DOMContentLoaded', () => {
    updateDepositCalculation();

    const tabButtons = document.querySelectorAll('.tab-button');
    const panels = document.querySelectorAll('.content-panel');
    const setActiveTab = (targetId) => {
        tabButtons.forEach((tab) => {
            tab.classList.toggle('active', tab.getAttribute('data-target') === targetId);
        });

        panels.forEach((panel) => {
            panel.classList.toggle('active', panel.id === targetId);
        });
    };

    tabButtons.forEach((tab) => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            setActiveTab(tab.getAttribute('data-target'));
        });
    });

    document.querySelectorAll('a[href="#services"], a[href="#gallery"], a[href="#booking"], a[href="#home"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').replace('#', '');
            setActiveTab(targetId);
        });
    });

    setActiveTab('services');

    document.getElementById('clientPhonePrompt').addEventListener('input', () => {
        const phone = document.getElementById('clientPhonePrompt').value.trim();
        const amount = document.getElementById('promptedAmount').innerText;
        if (phone) {
            document.getElementById('paymentPromptBox').innerHTML = `<strong>Amount to send:</strong><span>${amount}</span>`;
        } else {
            document.getElementById('paymentPromptBox').innerHTML = `<strong>Amount to send:</strong><span>${amount}</span>`;
        }
    });

    document.getElementById('confirmPaymentPrompt').addEventListener('click', continueBookingFromPrompt);
    document.getElementById('cancelPaymentPrompt').addEventListener('click', closePaymentPrompt);
    document.getElementById('paymentPromptModal').addEventListener('click', (event) => {
        if (event.target.id === 'paymentPromptModal') {
            closePaymentPrompt();
        }
    });
});
