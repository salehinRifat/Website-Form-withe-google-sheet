const form = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const viewDataBtn = document.getElementById('viewDataBtn');
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const tableBody = document.getElementById('tableBody');
const loader = document.getElementById('loader');
const loaderWrap = document.getElementById('loader-wrap');

// Google Apps Script Web App URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbzx7EWAWkdu_nOtiDYKvyDkG3GX8QZnIPEUKcPfOZaEpQ6kHgitUd-jH1_vqFN8EpcU/exec';

function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString(); // e.g., "5/29/2025, 12:15:47 PM"
}

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        batch: formData.get('batch'),
        handle: formData.get('handle')
    };

    const params = new URLSearchParams(data);

    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');
    btnText.textContent = 'Submitting...';

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: params
        });

        if (!response.ok) throw new Error('Failed to submit');

        await new Promise(resolve => setTimeout(resolve, 2000));

        submitBtn.classList.remove('btn-loading');
        submitBtn.classList.add('btn-success');
        btnText.textContent = 'Success!';

        setTimeout(() => {
            form.reset();
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-success');
            btnText.textContent = 'Submit';
        }, 3000);

    } catch (error) {
        console.error('Error:', error);
        submitBtn.classList.remove('btn-loading');
        btnText.textContent = 'Try Again';
        submitBtn.disabled = false;

        setTimeout(() => {
            btnText.textContent = 'Submit';
        }, 3000);
    }
});

// View data button functionality
viewDataBtn.addEventListener('click', async function () {
    loader.style.display = 'block';
    tableBody.innerHTML = '';
    modalOverlay.classList.add('active');
    await loadAndShowData();
    loader.style.display = 'none';
    loaderWrap.style.display = 'none';
});

// Close modal functionality
closeModal.addEventListener('click', () => modalOverlay.classList.remove('active'));
modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('active');
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
    }
});

// Load and display data from Google Sheets
async function loadAndShowData() {
    try {
        const response = await fetch(scriptURL);
        const sheetData = await response.json();

        if (!sheetData.length) {
            tableBody.innerHTML = '<tr class="no-data"><td colspan="6">No data submitted yet</td></tr>';
            return;
        }

        let tableHTML = '';
        sheetData.forEach((item, index) => {
            const time = formatDateTime(item["Timestamp "] || item.timestamp);
            tableHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td class="email-cell">${item.email}</td>
                    <td>${item.batch}</td>
                    <td class="handle-cell"><a href="https://codeforces.com/profile/${item.handle}" target="_blank"}>${item.handle}</a></td>
                    <td class="time-cell">${time}</td>
                </tr>
            `;
        });

        tableBody.innerHTML = tableHTML;
    } catch (error) {
        console.error('Failed to load data:', error);
        tableBody.innerHTML = '<tr class="no-data"><td colspan="6">Failed to load data</td></tr>';
    }
}

// Add input animation effects
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'scale(1)';
    });
});
