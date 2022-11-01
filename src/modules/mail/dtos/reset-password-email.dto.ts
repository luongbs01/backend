import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordEmailDto {
  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;
}

export default ResetPasswordEmailDto;
