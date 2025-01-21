// Function to fetch reservations from the API
async function fetchReservations() {
    try {
        const token = sessionStorage.getItem('token'); // Retrieve the token from session storage
        const response = await fetch('http://localhost:8000/reservation/get-all', {
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

        const reservations = await response.json(); // Assuming the response is in JSON format
        createTableRows(reservations); // Call the function to create table rows with the fetched data
    } catch (error) {
        console.error('Error fetching reservations:', error);
        // Optionally display an error message to the user
    }
}

// Function to create table rows dynamically
function createTableRows(reservations) {
    const tbody = document.querySelector('tbody'); // Get the tbody element

    // Clear existing content if needed
    tbody.innerHTML = ''; // Optional: Clear previous rows

    reservations.forEach(reservation => {
        const tr = document.createElement('tr');

        // Format the createdAt date
        const createdAt = new Date(reservation.createdAt);
        const timeAgo = formatTimeAgo(createdAt); // Function to format time (you can implement this as needed)

        // Create table cells with dynamic data
        tr.innerHTML = `
            <td class="border-bottom-0">
                <h6 class="fw-semibold mb-1">${reservation.user.name}</h6>
                <span class="fw-normal">${reservation.user.role || 'N/A'}</span> <!-- Assuming user role might be included -->
            </td>
            <td class="border-bottom-0">
                <p class="mb-0 fw-normal">${reservation.space.name}</p>
            </td>
            <td class="border-bottom-0">
                <div class="d-flex align-items-center gap-2">
                <span class="badge ${reservation.status === 'true' ? 'bg-primary' : 'bg-danger'} rounded-3 fw-semibold">
                  ${reservation.status === 'true' ? 'Confirmado' : 'Não Confirmado'}
                </span>
                </div>
            </td>
            <td class="border-bottom-0">
                <h6 class="fw-semibold mb-0 fs-4">${timeAgo}</h6>
            </td>
            <td class="border-bottom-0">
              <div class="d-flex align-items-center gap-2">
                <a href="detalhes_reserva.html?uuid-reservation=${reservation.uuid}" id="detailsButton" class="badge bg-secondary rounded-3 fw-semibold">
                  <i class="ti ti-arrow-right"></i>
                </a>
              </div>
            </td>
        `;

        tbody.appendChild(tr); // Append the table row to the tbody
    });
}

// Function to format the createdAt date into a human-readable time ago format
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + " anos atrás";
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + " meses atrás";
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + " dias atrás";
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + " horas atrás";
    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + " minutos atrás";
    return "há poucos segundos";
}

// Call the fetch function to get reservations and populate the table
fetchReservations();
