// Function to get query parameter from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Function to fetch reservation data from the API
async function fetchReservationData() {
  try {
    const uuid = getQueryParam('uuid-reservation');
    const token = sessionStorage.getItem('token'); // Retrieve the token from session storage
    const response = await fetch(`http://localhost:8000/reservation/get-reservation/${uuid}`, {
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
    
    const reservationData = await response.json();
    populateReservationDetails(reservationData);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

// Function to populate the reservation details dynamically
function populateReservationDetails(data) {
  // Populate Space Details
  document.getElementById('spaceImage').src = data.space.files[0].path;
  document.getElementById('spaceName').textContent = data.space.name;
  document.getElementById('spaceDetails').textContent = "computador, datashow, cadeiras"; // Customize if needed

  // Populate Reservation Details
  document.getElementById('reservationTitle').textContent = data.details; // Can be dynamic
  document.getElementById('reservationStart').textContent = `Data de início: ${new Date(data.startDate).toLocaleDateString()}`;
  document.getElementById('reservationEnd').textContent = `Data de término: ${new Date(data.endDate).toLocaleDateString()}`;
  document.getElementById('reservationStatus').textContent = `Status: ${data.status === "true" ? "Confirmado" : "Não confirmado"}`;
  document.getElementById('reservationShift').textContent = `Turno: ${data.shift.nameShift}`;

  // Populate User Details
  document.getElementById('userName').textContent = data.user.name;
  document.getElementById('userEmail').textContent = data.user.email;

  // Show or hide the Confirmar Reserva button based on status
  const confirmButton = document.getElementById('confirmReservationButton');
  if (data.status !== "true") {
    confirmButton.style.display = 'block'; // Show button if status is not true
    confirmButton.onclick = () => changeReservationStatus(data.uuid); // Set the onclick event
  } else {
    confirmButton.style.display = 'none'; // Hide button if status is true
  }
}

// Function to change reservation status
async function changeReservationStatus(uuid) {
  try {
    const token = sessionStorage.getItem('token'); // Retrieve the token from session storage
    const response = await fetch(`http://localhost:8000/reservation/confirm-reservation/${uuid}`, {
      method: 'GET', // Use GET for changing status
      headers: {
        'Authorization': `${token}`, // Add the token to the headers
        'Content-Type': 'application/json' // This may be optional for GET requests
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

    const result = await response.json();
    if (result.success) { // Assuming your API returns a success field
      alert("Reserva confirmada com sucesso!");
      window.location.reload(); // Reload the page once status is confirmed
    } else {
      alert(result.message); // Handle errors returned by API
      window.location.reload();
    }
  } catch (error) {
    console.error('There was a problem with the change status operation:', error);
  }
}

// Call the fetch function to get reservation data when the page loads
fetchReservationData();
