import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../roles/role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'alumno@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'Alumno 1' })
  @IsString()
  name!: string;

  @ApiProperty({ enum: Role, example: Role.CLIENTE, required: false })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
