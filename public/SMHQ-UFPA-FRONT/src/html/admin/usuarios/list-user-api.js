// Função para buscar os usuários da API
async function fetchUsers() {
    try {
        const token = sessionStorage.getItem('token'); // Recupera o token do session storage
        const response = await fetch('http://localhost:8000/user', {
            method: 'GET',
            headers: {
                'Authorization': `${token}`, // Adiciona o token ao cabeçalho
                'Content-Type': 'application/json'
            }
        });

        // Verifica se o status é 403 (proibido)
        if (response.status === 403) {
            window.location.href = '../../login/index.html'; // Redireciona para a página de login
            return; // Sai da função para evitar o processamento adicional
        }

        if (!response.ok) {
            throw new Error('Erro na resposta da rede: ' + response.statusText);
        }

        const users = await response.json(); // Supondo que a resposta esteja no formato JSON
        createTableRows(users); // Chama a função para criar as linhas da tabela com os dados recebidos
    } catch (error) {
        console.error('Erro ao buscar os usuários:', error);
        // Opcional: exibe uma mensagem de erro ao usuário
    }
}

// Função para criar as linhas da tabela dinamicamente
function createTableRows(users) {
    const tbody = document.querySelector('tbody'); // Obtém o elemento tbody

    // Limpa o conteúdo existente, se necessário
    tbody.innerHTML = ''; // Limpa o conteúdo anterior

    users.forEach(user => {
        const tr = document.createElement('tr');

    
    

        // Cria as células da tabela com os dados dinâmicos
        tr.innerHTML = `
           

            <td class="border-bottom-0">
                <h6 class="fw-semibold mb-1">${user.name}</h6>
                <span class="fw-normal">${user.userType || 'N/A'}</span> <!-- Assuming user role might be included -->
            </td>

            <td class="border-bottom-0">
                <p class="mb-0 fw-normal">${user.email}</p>
            </td>
            <td class="border-bottom-0">
                <h6 class="fw-semibold mb-0 fs-4">${user.created_at}</h6> <!-- Exibindo o tempo desde a criação -->
            </td>
            <td class="border-bottom-0">
                <div class="d-flex align-items-center gap-2">
                    <a href="detalhes_reserva.html?uuid-reservation=${user.uuid}" id="detailsButton" class="badge bg-secondary rounded-3 fw-semibold">
                        <i class="ti ti-arrow-right"></i>
                    </a>
                </div>
            </td>
        `;

        tbody.appendChild(tr); // Adiciona a linha à tabela
    });
}

// Função para formatar a data de criação em um formato de "há x tempo"

// Chama a função para buscar os usuários e popular a tabela
fetchUsers();
