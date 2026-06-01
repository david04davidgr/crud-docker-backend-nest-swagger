import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        access_token: any;
        user: {
            id: any;
            email: string;
            name: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: any;
        user: {
            id: any;
            email: string;
            name: string;
        };
    }>;
    private buildAuthResponse;
}
