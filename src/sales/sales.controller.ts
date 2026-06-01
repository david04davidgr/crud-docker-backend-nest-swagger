import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/roles/role.enum';
import { Roles } from '../auth/roles/roles.decorator';
import { CheckoutDto } from './dto/checkout.dto';
import { SalesService } from './sales.service';

type AuthRequest = Request & {
  user: {
    sub: string;
    email: string;
    name: string;
    role: Role;
  };
};

@ApiTags('sales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('checkout')
  @Roles(Role.CLIENTE)
  checkout(@Req() req: AuthRequest, @Body() dto: CheckoutDto) {
    return this.salesService.checkout(req.user.sub, dto);
  }

  @Get('sales')
  @Roles(Role.ADMINISTRADOR)
  findAll() {
    return this.salesService.findAll();
  }
}
