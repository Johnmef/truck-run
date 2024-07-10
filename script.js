document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('form-container');
    const form = document.getElementById('info-form');
    const targetDivInput = document.getElementById('target-div');
    const showInfoDiv = document.querySelector('.show-info');

    // Function to add info to localStorage
    function addToLocalStorage(key, data) {
        let storedData = localStorage.getItem(key);
        if (!storedData) {
            storedData = [];
        } else {
            storedData = JSON.parse(storedData);
        }
        storedData.push(data);
        localStorage.setItem(key, JSON.stringify(storedData));
    }

    // Function to retrieve info from localStorage
    function getFromLocalStorage(key) {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : [];
    }

    // Function to display initial labels (D1 to D7, P1 to P7)
    function displayInitialLabels() {
        const driverSideDivs = document.querySelectorAll('.driver-side .side');
        const passengerSideDivs = document.querySelectorAll('.passenger-side .side');

        driverSideDivs.forEach((div, index) => {
            const label = document.createElement('span');
            label.textContent = `D${index + 1}`;
            label.classList.add('label');
            div.appendChild(label);
            div.addEventListener('click', () => displayInfo(div.id));
        });

        passengerSideDivs.forEach((div, index) => {
            const label = document.createElement('span');
            label.textContent = `P${index + 1}`;
            label.classList.add('label');
            div.appendChild(label);
            div.addEventListener('click', () => displayInfo(div.id));
        });
    }

    // Function to display customer information in show-info area
    function displayInfo(divId) {
        showInfoDiv.innerHTML = ''; // Clear previous content

        const storedData = getFromLocalStorage(divId);
        if (storedData.length > 0) {
            storedData.forEach(item => {
                const infoBox = document.createElement('div');
                infoBox.classList.add('info-box');
                infoBox.innerHTML = `<div><strong>Customer Name:</strong> ${item.customerName}</div>`;
                if (item.time) {
                    infoBox.innerHTML += `<div><strong>Time:</strong> ${item.time}</div>`;
                }
                if (item.time) {
                      infoBox.innerHTML += `<div><strong>Notes:</strong> ${item.time}</div>`;
                  }
              
                showInfoDiv.innerHTML = '';
                showInfoDiv.appendChild(infoBox);
            });
        } else {
            showInfoDiv.innerHTML = '<p>No information available for this section.</p>';
        }
    }

    // Function to add customer information
    function addInfo(targetDiv, customerName, time) {
        const initial = document.createElement('div');
        initial.textContent = customerName.charAt(0);
        initial.classList.add('initial');
        
        const info = document.createElement('div');
        info.classList.add('info');
        info.innerHTML = `<div class="customer-name">${customerName}</div><div class="time">${time}</div>`;
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.classList.add('close-button');
        closeButton.addEventListener('click', () => {
            targetDiv.removeChild(initial);
            targetDiv.removeChild(info);
            targetDiv.removeChild(closeButton);
            targetDiv.innerHTML += '<button class="add-button">+</button>'; // Add '+' button again
            targetDiv.querySelector('.add-button').addEventListener('click', handleAddButtonClick);
            
            // Remove from localStorage
            const targetId = targetDiv.id;
            const storedData = getFromLocalStorage(targetId);
            const newData = storedData.filter(item => !(item.customerName === customerName && item.time === time));
            localStorage.setItem(targetId, JSON.stringify(newData));

            // Clear show-info on removal
            showInfoDiv.innerHTML = '';
        });

        targetDiv.appendChild(initial);
        targetDiv.appendChild(info);
        targetDiv.appendChild(closeButton);

        // Add to localStorage
        addToLocalStorage(targetDiv.id, { customerName, time });

        // Remove the '+' button
        const addButton = targetDiv.querySelector('.add-button');
        if (addButton) {
            addButton.remove();
        }
    }

    // Event listener for handling button click to add customer information
    function handleAddButtonClick(event) {
        event.preventDefault();
        const targetDiv = event.target.parentElement;
        targetDivInput.value = targetDiv.id;
        formContainer.style.display = 'flex';

        // Scroll to the form container
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Event listener for form submission to add customer information
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const customerName = document.getElementById('customer-name').value;
        const time = document.getElementById('time').value;
        const notes = document.getElementById('notes').value;
        const targetDivId = targetDivInput.value;
        const targetDiv = document.getElementById(targetDivId);

        addInfo(targetDiv, customerName, time);

        // Reset form and hide it
        form.reset();
        formContainer.style.display = 'none';
    });

    // Load existing data from localStorage on page load
    function loadFromLocalStorage() {
        const driverSideDivs = document.querySelectorAll('.driver-side .side');
        const passengerSideDivs = document.querySelectorAll('.passenger-side .side');

        driverSideDivs.forEach(div => {
            const storedData = getFromLocalStorage(div.id);
            storedData.forEach(item => {
                addInfo(div, item.customerName, item.time);
            });
        });

        passengerSideDivs.forEach(div => {
            const storedData = getFromLocalStorage(div.id);
            storedData.forEach(item => {
                addInfo(div, item.customerName, item.time);
            });
        });
    }

    // Initialize the page
    displayInitialLabels();
    loadFromLocalStorage();

    // Event listeners for add buttons
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', handleAddButtonClick);
    });
});
