
// Selecting Elements
const form = document.getElementById('employeeForm');
const submitBtn = document.getElementById('submitBtn');
const skeletonLoader = document.getElementById('skeleton-loader');
const phoneInputField = document.querySelector("#telephone");
const detailsTableBody = document.querySelector("#detailsTable tbody");
const detailsSection = document.getElementById('detailsSection');
const detailsLink = document.getElementById('detailsLink');
let employeeData = [];

// Initialize intl-tel-input
const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: "auto",
    separateDialCode: true,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
    geoIpLookup: function(callback) {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                callback(data.country_code);
            })
            .catch(() => {
                callback('US');
            });
    },
});

// Helper Functions for Validation
function isAlphabetic(str) {
    return /^[A-Za-z\s]+$/.test(str);
}

function isValidPhone() {
    return phoneInput.isValidNumber();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPastDate(date) {
    const today = new Date();
    const inputDate = new Date(date);
    return inputDate <= today;
}

// Function to Hide Skeleton Loader
function hideSkeletonLoader() {
    setTimeout(() => {
        skeletonLoader.classList.add('hidden');
    }, 1500);
}

// Call hideSkeletonLoader when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', hideSkeletonLoader);

// Real-time Validation
form.addEventListener('input', function(e) {
    validateField(e.target);
});

// Validation helper function
function validateField(field) {
    const errorMessage = field.nextElementSibling;
    let valid = true;
    let message = '';

    // Phone field validation
    if (field.id === 'telephone') {
        if (phoneInputField.value.trim() === '') {
            valid = false;
            message = 'This field is required.';
        } else if (!isValidPhone()) {
            valid = false;
            message = 'Please enter a valid phone number.';
        }
    } else if (field.value.trim() === '') {
        valid = false;
        message = 'This field is required.';
    } else {
        switch(field.id) {
            case 'name':
                if (!isAlphabetic(field.value.trim())) {
                    valid = false;
                    message = 'Name should contain only letters and spaces.';
                }
                break;
            case 'email':
                if (!isValidEmail(field.value.trim())) {
                    valid = false;
                    message = 'Please enter a valid email address.';
                }
                break;
            case 'startDate':
                if (!isPastDate(field.value.trim())) {
                    valid = false;
                    message = 'Start date cannot be in the future.';
                }
                break;
        }
    }

    // Only display error messages if errorMessage element exists
    if (errorMessage) {
        errorMessage.style.display = valid ? 'none' : 'block';
        errorMessage.textContent = message;
    }
    field.classList.toggle('error', !valid);

    return valid;
}

// Form Submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isFormValid = true;

    // Validate all fields
    const fields = form.querySelectorAll('input, select');
    fields.forEach(field => {
        const isValid = validateField(field);
        if (!isValid) {
            isFormValid = false;
        }
    });

    if (isFormValid) {
        const formData = {
            name: document.getElementById('name').value,
            telephone: phoneInputField.value,
            email: document.getElementById('email').value,
            dob: document.getElementById('dob').value,
            position: document.getElementById('position').value,
            department: document.getElementById('department').value,
            startDate: document.getElementById('startDate').value,
        };

        // Add data to array and populate table
        employeeData.push(formData);
        populateTable();

        // Show loading indicator or perform submission actions
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Simulate form submission delay
        setTimeout(() => {
            alert('Form successfully validated!');
            form.reset();
            phoneInput.reset(); // Reset intl-tel-input
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';

            // Navigate to details section
            window.location.hash = 'detailsSection';
            detailsSection.style.display = 'block';
        }, 1500);
    }
});

// Populate the details table with employee data
function populateTable() {
    detailsTableBody.innerHTML = ''; // Clear previous entries
    employeeData.forEach(data => {
        const row = document.createElement('tr');
        Object.values(data).forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });
        detailsTableBody.appendChild(row);
    });
}

// Smooth scrolling to sections on navbar click
detailsLink.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('detailsSection').scrollIntoView({ behavior: 'smooth' });
});
