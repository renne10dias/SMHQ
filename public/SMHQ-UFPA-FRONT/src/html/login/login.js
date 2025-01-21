document.addEventListener("DOMContentLoaded", function() {
    // Adicionando um ouvinte de evento ao botão
    var submitButton = document.getElementById("login");
    submitButton.addEventListener("click", async function() {
        // Obtendo os valores dos campos de entrada
        var email = document.getElementById("email").value.trim();
        var password = document.getElementById("password").value.trim();

        // Verificando se todos os campos obrigatórios foram preenchidos
        if (email === '' || password === '') {
            alert("Por favor, preencha todos os campos!");
            return; // Exit early if fields are empty
        }

        // Objeto com os dados do formulário
        var formData = {
            email: email,
            password: password
        };

        var url = `http://localhost:8000/auth/login`;

        try {
            // Enviar os dados do formulário para o servidor
            const responseData = await enviarRequisicaoPOST(url, formData);

            // Verifica se a resposta contém um token
            if (responseData.token) {
                // Salvar o token no Session Storage
                sessionStorage.setItem('token', responseData.token); // Salva o token
                console.log('Token salvo no sessionStorage:', responseData.token);
            }

            // Verifica se existe uma URL de redirecionamento
            if (responseData.redirectUrl) {
                // Redireciona para a URL fornecida
                window.location.href = responseData.redirectUrl;
            }
        } catch (error) {
            // Tratar o erro de credenciais inválidas
            alert(error.message);
        }
    });
});

async function enviarRequisicaoPOST(url, data) {
    const options = {
        method: 'POST', // Método da requisição
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Corpo da requisição convertido para JSON
    };

    // Fazendo a requisição
    try {
        const response = await fetch(url, options);
        let responseData; // Variável para armazenar os dados da resposta
        if (!response.ok) {
            // Se a resposta não estiver OK, verificar o status
            responseData = await response.json(); // Retorna os dados da resposta como JSON
            alert(responseData.message);
            throw new Error(responseData.message); // Propaga o erro para o catch
        } else {
            responseData = await response.json(); // Retorna os dados da resposta como JSON
        }
        return responseData; // Retorna os dados da resposta
    } catch (error) {
        console.error('Erro:', error);
        throw error; // Propaga o erro para que seja tratado externamente
    }
}
