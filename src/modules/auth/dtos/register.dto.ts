import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    required: true
  }) 
  @IsEmail()
  @IsNotEmpty()
  @Matches(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    {message: 'Email is not valid'}
  )
  email: string; 

  @ApiProperty({
    required: true
  }) 
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
    {message: 'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'}
  )
  password: string;
}

export default RegisterDto;