import { ApiExpress } from "./api/express/ApiExpress";
import { ReservationRoutes } from "./api/express/routes/ReservationRoutes";
import { SportCoutRoutes } from "./api/express/routes/SportCoutRoutes";


function main() {
    const api = ApiExpress.getInstance(); // Obtém a instância do ApiExpress

    // Instancia a classe e registra as rotas automaticamente
    ReservationRoutes.registerRoutes(ApiExpress.getInstance());
    SportCoutRoutes.registerRoutes(ApiExpress.getInstance());
    

    // Início do servidor
    api.start(8000);
}

main();
