// Replace with your Web App URL
const webAppUrl = "https://script.google.com/macros/s/AKfycbzN8hCfZngYQ4PMdrErQ5UD2p1T46k7iikeXKn0ynU/dev";

// Add event listener for form submission
document.getElementById('dataForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const comments = document.getElementById('comments').value;

    if (!name || !email || !age) {
        alert('Please fill out all required fields.');
        return;
    }

    const formData = { name, email, age, comments };
    const storedData = JSON.parse(localStorage.getItem('formData')) || [];
    storedData.push(formData);
    localStorage.setItem('formData', JSON.stringify(storedData));

    document.getElementById('response').innerText = 'Form data saved offline!';
    document.getElementById('dataForm').reset();
});

// Add event listener for Sync Button
document.getElementById('syncButton').addEventListener('click', async function () {
    const storedData = JSON.parse(localStorage.getItem('formData')) || [];

    if (storedData.length === 0) {
        alert('No data to sync!');
        return;
    }

    try {
        const response = await fetch(webAppUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(storedData),
        });

        if (response.ok) {
            alert('Data synced successfully!');
            localStorage.removeItem('formData');
        } else {
            const errorText = await response.text();
            alert(`Failed to sync data: ${errorText}`);
        }
    } catch (error) {
        alert('Error syncing data. Please check your internet connection.');
    }
});

// Add event listener for Download CSV Button
document.getElementById('downloadDataButton').addEventListener('click', function () {
    const storedData = JSON.parse(localStorage.getItem('formData')) || [];
    if (storedData.length === 0) {
        alert('No offline data available to download.');
        return;
    }

    // Convert data to CSV format
    const csvRows = [];
    const headers = ['Name', 'Email', 'Age', 'Comments'];
    csvRows.push(headers.join(',')); // Add headers

    storedData.forEach(row => {
        const values = [
            row.name,
            row.email,
            row.age,
            row.comments || '' // Handle empty comments
        ];
        csvRows.push(values.join(','));
    });

    const csvData = csvRows.join('\n');

    // Create a Blob object and download it
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'offline_data.csv';
    a.click();
});
