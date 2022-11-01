import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  forgotPasswordEmail: string;
}

export default ForgotPasswordDto;
