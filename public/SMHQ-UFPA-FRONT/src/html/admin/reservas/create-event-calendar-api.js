$(document).ready(function() {
    // Event listener for submit button click
    $('#submitButtonIdAWithResponsible').on('click', function(e) {
        e.preventDefault(); // Prevent the default form submission

        

         // Get values from the modal form
         const name = $("#calendar_event_name").val();
         const address = $("#calendar_event_address").val();
         const phone = $("#calendar_event_phone").val();
         const email = $("#calendar_event_email").val();
         const observations = $("#calendar_event_observations").val();
         const initHour =  moment($("#kt_calendar_datepicker_start_date_cadastro").val()).toISOString();
         const endHour = moment($("#kt_calendar_datepicker_end_date_cadastro").val()).toISOString();
         const sportsCoutUuid = getQueryParam("uuid-reserva");


        


 
         // Create a JSON object with the modal data
         const eventDetails = {
             name,
             address,
             phone,
             email,
             observations,
             initHour,
             endHour,
             sportsCoutUuid
         };
 
         // Log the JSON object to the console
         console.log(eventDetails);

        // Log reservation data for debugging
        console.log('JSON da Reserva:', JSON.stringify(eventDetails, null, 2));

        // Retrieve the token from session storage
        const token = sessionStorage.getItem('token'); // Use the key you stored the token with

        fetch('http://localhost:8000/reservation', { // Adjust for your creation endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}` // Add the token to the Authorization header
            },
            body: JSON.stringify(eventDetails),
        })
        .then(response => {
            return response.json().then(data => {
                if (response.status === 403) {
                    // Redirect to another page if access is forbidden
                    window.location.href = '../../login/index.html'; // Change this to your desired URL
                    return; // Exit the function
                }

                if (!response.ok) {
                    // Check HTTP status codes for more specific feedback
                    switch (response.status) {
                        case 404:
                            alert(data.message); // Show specific error alert
                            break;
                        case 203:
                            alert(data.message); // Show specific error alert
                            break;
                        case 500:
                            alert(data.message); // Show server error alert
                            break;
                        default:
                            throw new Error('An unexpected error occurred. Please try again.');
                    }
                } else {
                    alert(data.message); // Show success message
                    location.reload(); // Reload the page after success
                }
                return data; // Return data for further handling if needed
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(error.message); // Show custom error alert
        });

        // Close the modal after submission
        $('#dateRangeModal').modal('hide');
    });

    // Function to fetch events from the API
    async function fetchEventsFromAPI() {
        try {
            const token = sessionStorage.getItem('token'); // Retrieve the token from session storage
            const response = await fetch(`http://localhost:8000/reservation/listReservationsBySportsCoutUuid/${getQueryParam("uuid-reserva")}`, {
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
                throw new Error('Network response was not ok');
            }
    
            const eventsFromAPI = await response.json(); // Assuming the response is in JSON format
            return eventsFromAPI;
        } catch (error) {
            console.error('Error fetching events:', error);
            return []; // Return an empty array if there's an error
        }
    }
    
    // Function to get the query parameter by name
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Initialize the FullCalendar
    async function initializeCalendar() {
        // Fetch events from the API
        const eventsFromAPI = await fetchEventsFromAPI();
    
        // Initialize the calendar
        $("#calendar").fullCalendar({
            timezone: "local", // Garantir que o calendário use o fuso horário local
            header: {
                left: "title",
                center: "agendaDay,agendaWeek,month", // Disponíveis: dia, semana e mês
                right: "prev,next today"
            },
            editable: true,
            firstDay: 1,
            selectable: true, // Permitir seleção
            selectHelper: true,
            defaultView: "agendaWeek", // Define o modo semanal como padrão
            axisFormat: "h:mm",
            allDaySlot: false,
    
            // Restrict selection to a single day and validate duration
            select: function (start, end) {
                const startDate = moment(start).local(); // Converter para o fuso local
                const endDate = moment(end).local();
    
                const currentDate = moment().startOf("day");
    
                if (startDate.isBefore(currentDate)) {
                    $("#calendar").fullCalendar("unselect");
                    alert("Não é possível selecionar um dia no passado!");
                    return;
                }
    
                if (!startDate.isSame(endDate, "day")) {
                    $("#calendar").fullCalendar("unselect");
                    alert("Seleção de múltiplos dias não é permitida!");
                    return;
                }
    
                const durationInHours = endDate.diff(startDate, "hours", true);
    
                if (durationInHours > 1) {
                    $("#calendar").fullCalendar("unselect");
                    alert("Reservas não podem ter mais de 1 hora de duração!");
                    return;
                }
    
                $("#kt_calendar_datepicker_start_date").val(startDate.format("YYYY-MM-DDTHH:mm"));
                $("#kt_calendar_datepicker_end_date").val(endDate.format("YYYY-MM-DDTHH:mm"));

                $("#kt_calendar_datepicker_start_date_cadastro").val(startDate.format("YYYY-MM-DDTHH:mm"));
                $("#kt_calendar_datepicker_end_date_cadastro").val(endDate.format("YYYY-MM-DDTHH:mm"));


                
                $(document).ready(function () {
                    const searchInput = $("#cadastro_name");
                    const suggestionsList = $("#cadastro_suggestions");
                    const submitButton = $("#submitButtonIdAddResponsible");
                    let debounceTimeout;
                    
                    searchInput.on("input", function () {
                        clearTimeout(debounceTimeout);
                        debounceTimeout = setTimeout(() => {
                            const query = $(this).val().trim();
                            if (query) {
                                searchResponsibles(query);
                            } else {
                                suggestionsList.hide();
                            }
                        }, 300);
                    });
                
                    async function searchResponsibles(query) {
                        suggestionsList.empty().append('<li class="list-group-item text-muted">Carregando...</li>').show();
                
                        try {
                            const response = await fetch(`http://localhost:8000/reservation/searchResponsiblesByName/${query}`);
                            if (!response.ok) throw new Error("Erro ao buscar responsáveis");
                
                            const results = await response.json();
                            renderSuggestions(results);
                        } catch (error) {
                            console.error("Erro ao buscar responsáveis:", error);
                            suggestionsList.empty().append('<li class="list-group-item text-danger">Erro ao carregar sugestões</li>').show();
                        }
                    }
                
                    function renderSuggestions(results) {
                        suggestionsList.empty();
                
                        if (results.length === 0) {
                            suggestionsList.append('<li class="list-group-item text-muted">Nenhum responsável encontrado</li>').show();
                            return;
                        }
                
                        results.forEach((responsible) => {
                            const listItem = `
                                <li 
                                    class="list-group-item list-group-item-action" 
                                    data-uuid="${responsible.uuid}" 
                                    data-name="${responsible.name}"
                                >
                                    <strong>${responsible.name}</strong><br>
                                    <small>${responsible.email || "Sem e-mail"}</small>
                                </li>
                            `;
                            suggestionsList.append(listItem);
                        });
                
                        suggestionsList.show();
                    }
                
                    suggestionsList.on("click", ".list-group-item-action", function () {
                        const selectedName = $(this).data("name");
                        const selectedUuid = $(this).data("uuid");
                
                        searchInput.val(selectedName);
                        suggestionsList.hide();
                
                        if ($("#cadastro_responsible_uuid").length === 0) {
                            searchInput.after(`<input type="hidden" id="cadastro_responsible_uuid" value="${selectedUuid}">`);
                        } else {
                            $("#cadastro_responsible_uuid").val(selectedUuid);
                        }
                    });
                
                    $(document).on("click", function (e) {
                        if (!$(e.target).closest("#cadastro_name, #cadastro_suggestions").length) {
                            suggestionsList.hide();
                        }
                    });
                
                    // Função para enviar a requisição POST quando o botão for clicado
                    submitButton.on("click", async function () {
                        const initHour =  moment($("#kt_calendar_datepicker_start_date").val()).toISOString();
                        const endHour = moment($("#kt_calendar_datepicker_end_date").val()).toISOString();
                        const observations = "Novo";  // Substitua com o valor adequado
                        const sportsCoutUuid = getQueryParam("uuid-reserva");  // Substitua com o valor adequado
                        const responsibleCoutUuid = $("#cadastro_responsible_uuid").val();  // Obter o UUID do responsável selecionado
                
                        // Verifique se o UUID do responsável foi selecionado
                        if (!responsibleCoutUuid) {
                            alert("Por favor, selecione um responsável.");
                            return;
                        }
                
                        const requestData = {
                            initHour,
                            endHour,
                            observations,
                            sportsCoutUuid,
                            responsibleCoutUuid
                        };

                        console.log(requestData)
                
                        try {
                            const response = await fetch("http://localhost:8000/reservation/createReservationAddResponsible", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(requestData)
                            });
                        
                            // Tenta parsear o corpo da resposta para obter a mensagem da API
                            const data = await response.json();
                        
                            if (!response.ok) {
                                // Verifica os códigos HTTP e exibe mensagens apropriadas
                                switch (response.status) {
                                    case 401:
                                        alert(data.message || "Não autorizado. Verifique suas credenciais.");
                                        break;
                                    case 203:
                                        alert(data.message || "Não autorizado. Verifique suas credenciais.");
                                        break;
                                    case 409:
                                        alert(data.message || "Conflito de dados. Por favor, verifique os valores enviados.");
                                        break;
                                    case 500:
                                        alert(data.message || "Erro interno do servidor. Tente novamente mais tarde.");
                                        break;
                                    default:
                                        alert(data.message || "Ocorreu um erro inesperado. Por favor, tente novamente.");
                                }
                            } else {
                                // Sucesso
                                alert(data.message || "Reserva criada com sucesso!");
                                location.reload(); // Recarrega a página após o sucesso
                            }
                        } catch (error) {
                            // Tratamento para erros de rede ou outras exceções
                            console.error("Erro ao enviar dados:", error);
                            alert("Erro ao conectar ao servidor. Verifique sua conexão e tente novamente.");
                        }
                        
                    });
                });
                
                
                
    
                $("#dateRangeModal").modal("show");
            },



            
    
            // Evento ao clicar em uma reserva
            eventClick: async function (event) {
                try {


                    
                    // Fazer a requisição para obter os detalhes do evento
                    const response = await fetch(`http://localhost:8000/reservation/getReservationsWithResponsibleAndSportsCout/${event.extendedProps.uuid}`);
                    if (!response.ok) {
                        throw new Error("Erro ao buscar detalhes da reserva");
                    }
            
                    const reservationDetailsArray = await response.json(); // Supondo que a resposta seja um array
            
                    console.log("Reservation Details Array:", reservationDetailsArray);
            
                    // Limpar o conteúdo anterior do modal
                    $("#eventDetailsModal .modal-body").empty();
            
                    // Iterar sobre cada reserva e preencher os detalhes no modal
                    reservationDetailsArray.forEach((reservationDetails) => {
                        const responsible = reservationDetails.responsible || {};
                        const sportsCout = reservationDetails.sportsCout || {};
            
                        const modalContent = `
                            <p><strong>Título:</strong> ${reservationDetails.observations || "Reserva"}</p>
                            <p><strong>Início:</strong> ${moment(reservationDetails.initHour).format("DD/MM/YYYY HH:mm")}</p>
                            <p><strong>Término:</strong> ${moment(reservationDetails.endHour).format("DD/MM/YYYY HH:mm")}</p>
                            <hr>
                            <h6>Responsável</h6>
                            <p><strong>Nome:</strong> ${responsible.name || "Não informado"}</p>
                            <p><strong>Email:</strong> ${responsible.email || "Não informado"}</p>
                            <p><strong>Telefone:</strong> ${responsible.phone || "Não informado"}</p>
                            <p><strong>Endereço:</strong> ${responsible.address || "Não informado"}</p>
                            <hr>
                            <h6>Quadra</h6>
                            <p><strong>Nome:</strong> ${sportsCout.name || "Não informado"}</p>
                            <p><strong>Abertura:</strong> ${sportsCout.opening ? moment(sportsCout.opening).format("HH:mm") : "Não informado"}</p>
                            <p><strong>Fechamento:</strong> ${sportsCout.closest ? moment(sportsCout.closest).format("HH:mm") : "Não informado"}</p>
                        `;
            
                        $("#eventDetailsModal .modal-body").append(modalContent);
                    });
            
                    // Adicionar evento ao botão "Cancelar Reserva"
                    $("#cancelReservation").off("click").on("click", function () {
                        // Abrir o modal para inserir o motivo
                        $("#cancelReasonModal").modal("show");
                    });
            
                    // Adicionar evento ao botão "Confirmar" no modal de motivo
                    $("#confirmCancelReservation").off("click").on("click", async function () {
                        const cancelReason = $("#cancelReasonInput").val();
            
                        if (!cancelReason.trim()) {
                            alert("Por favor, insira o motivo do cancelamento.");
                            return;
                        }
            
                        try {
                            // Obter os IDs necessários dos dados do evento
                            const reservationUuid = event.extendedProps.uuid;
                            const sportsCoutUuid = event.extendedProps.sportsCoutUuid;
                            const responsibleUuid = event.extendedProps.responsibleUuid;
            
                            // Verificar se todos os UUIDs estão disponíveis
                            if (!reservationUuid || !sportsCoutUuid || !responsibleUuid) {
                                alert("Erro: Informações insuficientes para cancelar a reserva.");
                                return;
                            }
            
                            // Fazer a requisição PUT para atualizar o status
                            const response = await fetch(
                                `http://localhost:8000/reservation/updateEnabledStatus/${reservationUuid}/${sportsCoutUuid}/${responsibleUuid}`,
                                {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        newStatus: false,
                                        observations: cancelReason, // Incluindo o motivo no corpo da requisição
                                    }),
                                }
                            );
            
                            if (!response.ok) {
                                throw new Error("Erro ao cancelar a reserva.");
                            }
            
                            alert("Reserva cancelada com sucesso!");
                            location.reload(); // Reload the page after success
            
                            // Fechar os modais
                            $("#cancelReasonModal").modal("hide");
                            $("#eventDetailsModal").modal("hide");
            
                            // Atualizar o calendário para refletir a alteração
                            $("#calendar").fullCalendar("refetchEvents");
                        } catch (error) {
                            console.error("Erro ao cancelar a reserva:", error);
                            alert("Erro ao cancelar a reserva. Por favor, tente novamente mais tarde.");
                        }
                    });
            
                    // Mostrar o modal de detalhes do evento
                    $("#eventDetailsModal").modal("show");

                    
                } catch (error) {
                    console.error("Erro ao buscar os detalhes da reserva:", error);
                    alert("Erro ao carregar os detalhes da reserva. Tente novamente mais tarde.");
                }
            },

            
            
            
            
            
    
            // Define events
            events: eventsFromAPI.map((event) => ({
                title: `${event.observations || "Sem Observações"}`,
                start: event.initHour,
                end: event.endHour,
                allDay: false,
                className: event.enabled ? "success" : "important",
                extendedProps: {
                    uuid: event.uuid,
                    sportsCoutUuid: event.sportsCoutUuid,
                    responsibleUuid: event.responsibleUuid,
                    observations: event.observations
                }
            }))
        });
    }
    
    
    
    
    // Helper function to get query parameters from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    
    
    
    
    
    

    // Call the function to initialize the calendar
    initializeCalendar();
});
