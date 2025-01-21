import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'; // Importa o Prisma Client

const prisma = new PrismaClient(); // Instancia o Prisma Client

interface TokenPayload {
    uuid: string;
    iat: number;
    exp: number;
}

export class AuthMiddleware {
    public static authenticateRoles(allowedRoles: string[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            //const token = req.cookies.token; // Pega o token do cookie

            const token = req.headers.authorization?.split(' ')[1]; // 'Bearer <token>'

            if (!token) {
                return res.status(401).json({ message: 'Token de autenticação não fornecido' });
            }

            try {
                const secretKey = process.env.JWT_SECRET || 'secreta-chave';
                const decoded = jwt.verify(token, secretKey) as TokenPayload;

                // Valida o usuário e sua role no banco de dados
                const user = await prisma.user.findUnique({
                    where: {
                        uuid: decoded.uuid, // O ID do usuário que você deseja buscar
                    },
                    select: {
                        uuid: true,        // Seleciona o uuid do usuário
                        activated: true,   // Seleciona o status de ativação do usuário
                        userType: {        // Inclui os campos específicos do UserType
                            select: {
                                uuid: true,    // Seleciona o uuid do tipo de usuário
                                typeUser: true // Seleciona o tipo de usuário
                            }
                        }
                    }
                });

                // Verifica se o usuário existe e se está ativado
                if (!user || !user.activated) {
                    return res.status(403).json({ message: 'Acesso não permitido para o seu tipo de usuário ou usuário não ativado' });
                }

                // Verifica se o tipo de usuário está permitido
                if (!allowedRoles.includes(user.userType.uuid)) {
                    return res.status(403).json({ message: 'Acesso não permitido para o seu tipo de usuário' });
                }

                // Adiciona as informações do usuário na requisição
                req.user = {
                    uuid: user.uuid,
                };

                next(); // Passa para o próximo middleware ou controlador
            } catch (error) {
                console.error('Erro na autenticação:', error);
                return res.status(403).json({ message: 'Token inválido ou expirado' });
            }
        };
    }
}
