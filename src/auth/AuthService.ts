import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRoleEnum } from '../enums/UserRoleEnum';

const prisma = new PrismaClient();

interface MessageBusiness {
    httpCode: number;
    message: string;
    token?: string; // Optional token for successful login
    redirectUrl?: string; // Optional redirection URL for successful login
}

export class AuthService {

    // Método para login
    public async login(email: string, password: string): Promise<MessageBusiness> {
        try {
            // Verifica se o email foi passado
            if (!email) {
                return {
                    httpCode: 400,
                    message: "Email não fornecido"
                };
            }
            
            // Busca o usuário pelo e-mail
            const user = await prisma.user.findUnique({
                where: { email },
                include: { userType: true }, // Inclui o tipo de usuário
            });

            // Verifica se o usuário existe
            if (!user) {
                return {
                    httpCode: 404,
                    message: "Usuário não encontrado"
                };
            }

            // Verifica a senha
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                return {
                    httpCode: 401,
                    message: "Senha incorreta"
                };
            }

            // Verifica se o usuário está ativado
            if (!user.activated) {
                return {
                    httpCode: 403,
                    message: "Usuário inativo"
                };
            }

            // Define o link de redirecionamento com base no tipo de usuário
            let redirectLink = '';
            switch (user.userType.uuid) {
                case UserRoleEnum.ADMIN:
                    redirectLink = "http://127.0.0.1:5500/public/SMEU-UFPA-FRONT/src/html/admin/dashboard/dashboard.html";
                    break;
                case UserRoleEnum.ENPLOYEE:
                    redirectLink = "http://127.0.0.1:5500/public/SMEU-UFPA-FRONT/src/html/employee/calendar/calendar.html";
                    break;
                case UserRoleEnum.USER:
                    redirectLink = "http://127.0.0.1:5500/public/SMEU-UFPA-FRONT/src/html/user/calendar/calendar.html";
                    break;
                default:
                    redirectLink = "http://127.0.0.1:5500/public/SMEU-UFPA-FRONT/src/html/home.html"; // Default redirect if role is unrecognized
                    break;
            }

            // Gera o token JWT
            const secretKey = process.env.JWT_SECRET || 'secreta-chave';
            const token = jwt.sign(
                { uuid: user.uuid },
                secretKey,
                { expiresIn: '1h' }
            );

            // Retorna o token e o link de redirecionamento
            return {
                httpCode: 200,
                message: "Login bem-sucedido",
                token: "Bearer " + token,
                redirectUrl: redirectLink
            };

        } catch (error) {
            console.error("Erro ao fazer login", error);
            return {
                httpCode: 500,
                message: "Erro ao fazer login"
            };
        }
    }
}
