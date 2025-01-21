$(document).ready(function() {
  // Function to fetch events from the API
  async function fetchEventsFromAPI() {
    try {
      const token = sessionStorage.getItem('token'); // Retrieve the token from session storage
      const response = await fetch('http://localhost:8000/reservation/list-all-reservations', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`, // Add the token to the headers
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const eventsFromAPI = await response.json();
      return eventsFromAPI;
    } catch (error) {
      console.error('Error fetching events:', error);
      return []; // Return an empty array if there's an error
    }
  }

  // Initialize FullCalendar
  async function initializeCalendar() {
    const eventsFromAPI = await fetchEventsFromAPI(); // Fetch events

    var calendar = $("#calendar").fullCalendar({
      header: {
        left: "title",
        center: "agendaDay,agendaWeek,month",
        right: "prev,next today"
      },
      editable: true,
      firstDay: 1,
      selectable: true,
      defaultView: "month",
      axisFormat: "h:mm",
      allDaySlot: false,
      selectHelper: true,
      events: eventsFromAPI.flatMap(function(event) {
        return event.shift.map(function(shift) {
          // Determine className based on status
          var eventClass = "";
          if (event.status === "false") {
            eventClass = "important"; // Class for red events
          } else if (event.status === "true") {
            eventClass = "success"; // Class for green events
          }

          return {
            title: `Reserva: ${event.details}, Turno: ${shift.nameShift}`,
            start: new Date(event.startDate).toISOString(), // Convert to ISO format
            end: new Date(event.endDate).toISOString(), // Convert to ISO format
            allDay: true, // Make the event an all-day event
            className: eventClass,
            shift: event.shift // Include shift data for modal
          };
        });
      }),
      eventClick: function(event) {
        // Populate the modal with event details
        $('#calendar_event_name').val(event.title);
        $('#kt_calendar_datepicker_start_date').val(event.start.toISOString().substring(0, 10));
        $('#kt_calendar_datepicker_end_date').val(event.end.toISOString().substring(0, 10));

        // Reset all checkboxes
        $('#manha').prop('checked', false);
        $('#tarde').prop('checked', false);
        $('#noite').prop('checked', false);

        // Check if event.shift is defined
        if (event.shift) {
          event.shift.forEach(shift => {
            if (shift.uuid === "04fd1c01-64aa-4715-afcf-54e6ff0197fe") {
              $('#manha').prop('checked', true);
            } else if (shift.uuid === "12345678-90ab-cdef-1234-567891abcdef") {
              $('#tarde').prop('checked', true);
            } else if (shift.uuid === "abcdef12-3456-7890-abcd-ef1334567890") {
              $('#noite').prop('checked', true);
            }
          });
        } else {
          console.warn('Shift is undefined for this event:', event);
        }

        // Show the modal
        $('#eventModal').modal('show');
      }
    });
  }

  // Call the function to initialize the calendar
  initializeCalendar();
});
