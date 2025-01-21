document.getElementById('createUserForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevenir o comportamento padrão de submissão do formulário

    // Capturar os valores dos campos do formulário
    const data = {
        name: document.getElementById('name').value,
        surname: document.getElementById('surname').value,
        email: document.getElementById('email').value,
        password: document.getElementById('passsword').value,
        user_types_id: document.getElementById('disabledSelect').value // Capturar o tipo de usuário selecionado (ID)
    };

    try {
        const token = sessionStorage.getItem('token'); // Recuperar o token de autenticação

        const response = await fetch('http://localhost:8000/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Definir o tipo de conteúdo como JSON
                'Authorization': `${token}` // Autorização, se for necessária
            },
            body: JSON.stringify(data) // Enviar os dados do formulário como JSON
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar o formulário: ' + response.statusText);
        }

        const result = await response.json();
        console.log(result);
        alert('Formulário enviado com sucesso!');

    } catch (error) {
        console.error('Erro ao enviar o formulário:', error);
        alert('Ocorreu um erro ao enviar o formulário.');
    }
});
