// Function to fetch spaces from the API
async function fetchSpaces() {
    try {
        const token = sessionStorage.getItem('token'); // Retrieve the token from session storage
        const response = await fetch('http://localhost:8000/sport-cout/getAllSportCout', {
            method: 'GET',
            headers: {
                'Authorization': `${token}`, // Add the token to the headers
                'Content-Type': 'application/json'
            }
        });

        // Check for 403 Forbidden status
        if (response.status === 403) {
            window.location.href = '../../login/index.html'; // Redirect to the login page or any desired URL
            return; // Exit the function to prevent further processing
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


        colDiv.innerHTML = `
            <div class="card overflow-hidden rounded-2">
                <div class="position-relative">
                    <a href="javascript:void(0)">
                        <img src="28182741-casa-plano-icone-casas-ilustracao-pequeno-casa-colorida-casa-plano-casas-ilustracao-vetor.jpg" class="card-img-top rounded-0" alt="${space.name}">
                    </a>
                    <a href="criar_reserva.html?uuid-reserva=${space.uuid}" class="bg-primary rounded-circle p-2 text-white d-inline-flex position-absolute bottom-0 end-0 mb-n3 me-3" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Add To Cart">
                        <i class="ti ti-plus"></i>
                    </a>
                </div>
                <div class="card-body pt-3 p-4">
                    <h6 class="fw-semibold fs-4">${space.name}</h6>
                    <div class="d-flex align-items-center justify-content-between">
                        <h6 class="fw-semibold fs-4 mb-0">Abre as: ${space.opening} <span class="ms-2 fw-normal text-muted fs-3">${status}</span></h6>
                        <h6 class="fw-semibold fs-4 mb-0">Fecha as: ${space.closest} <span class="ms-2 fw-normal text-muted fs-3">${status}</span></h6>
                    </div>
                </div>
            </div>
        `;

        rowDiv.appendChild(colDiv); // Append the column div to the row
    });
}

// Call the fetch function to get spaces and create cards
fetchSpaces();
