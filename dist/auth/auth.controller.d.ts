import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
}
