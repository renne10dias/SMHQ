document.getElementById('createSpaceForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Create a FormData object
    const formData = new FormData();

    // Get each input element by ID and append its value to the FormData
    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;
    const capacity = parseInt(document.getElementById('capacity').value, 10); // Convert to integer
    const type = document.getElementById('type').value;
    const equipment = document.getElementById('equipment').value;
    const file = document.getElementById('file').files[0]; // Get the first file if there are multiple

    // Append the values to FormData
    formData.append('name', name);
    formData.append('location', location);
    formData.append('capacity', capacity); // Append as integer
    formData.append('type', type);
    formData.append('equipment', equipment);
    if (file) {
        formData.append('file', file); // Only append if a file is selected
    }

    // Log the FormData entries to the console
    for (const [key, value] of formData.entries()) {
        console.log(key, value);
    }

    // Retrieve the token from session storage
    const token = sessionStorage.getItem('token'); // Use the key you stored the token with
    console.log(token);

    // Send the form data to the API
    fetch('http://localhost:8000/spaces', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `${token}` // Add the token to the Authorization header
        }
    })
    .then(response => {
        if (response.status === 403) {
            // Redirect to another page if access is forbidden
            window.location.href = '../../login/index.html'; // Change this to your desired URL
            return; // Exit the function
        }

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert("Criado com sucesso");
        
        // Clear the form after successful submission
        document.getElementById('createSpaceForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, display an error message
    });
});
