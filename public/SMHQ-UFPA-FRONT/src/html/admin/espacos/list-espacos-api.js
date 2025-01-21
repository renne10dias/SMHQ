// Function to fetch spaces from the API
async function fetchSpaces() {
    try {
        // Retrieve the token from session storage
        const token = sessionStorage.getItem('token'); // Use the key you stored the token with
        console.log(token);

        const response = await fetch('http://localhost:8000/spaces', {
            method: 'GET', // Specify the method
            headers: {
                'Content-Type': 'application/json', // Set the content type
                'Authorization': `${token}` // Add the token to the Authorization header
            }
        });

        // Check if the response is 403 Forbidden
        if (response.status === 403) {
            // Redirect to another page if access is forbidden
            window.location.href = '../../login/index.html'; // Change this to your desired URL
            return; // Exit the function
        }

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const spaces = await response.json(); // Assuming the response is in JSON format
        createCards(spaces); // Call the function to create cards with the fetched data
    } catch (error) {
        console.error('Error fetching spaces:', error);
        // Optionally display an error message to the user
    }
}

// Function to create cards dynamically
function createCards(spaces) {
    const rowDiv = document.getElementById('spacesContainer'); // Get the row element by ID

    // Clear existing content if needed
    rowDiv.innerHTML = ''; // Optional: Clear previous cards

    spaces.forEach(space => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-sm-6 col-xl-3';

        // Get the image path from the files array
        const imageUrl = space.files.length > 0 ? space.files[0].path : ''; // Fallback if no image exists
        const status = space.activityStatus ? 'Ativo' : 'Inativo'; // Set status text based on activityStatus

        colDiv.innerHTML = `
            <div class="card overflow-hidden rounded-2">
                <div class="position-relative">
                    <a href="javascript:void(0)">
                        <img src="${imageUrl}" class="card-img-top rounded-0" alt="${space.name}">
                    </a>
                    <a href="espacos_detalhes.html?uuid=${space.uuid}" class="bg-primary rounded-circle p-2 text-white d-inline-flex position-absolute bottom-0 end-0 mb-n3 me-3" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Add To Cart">
                        <i class="ti ti-pencil fs-4"></i>
                    </a>
                </div>
                <div class="card-body pt-3 p-4">
                    <h6 class="fw-semibold fs-4">${space.name}</h6>
                    <div class="d-flex align-items-center justify-content-between">
                        <h6 class="fw-semibold fs-4 mb-0">Tipo: ${space.type} <span class="ms-2 fw-normal text-muted fs-3">${status}</span></h6>
                    </div>
                </div>
            </div>
        `;

        rowDiv.appendChild(colDiv); // Append the column div to the row
    });
}

// Call the fetch function to get spaces and create cards
fetchSpaces();
