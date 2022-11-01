import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmEmailDto {
  @ApiProperty({required: true, type: String})
  @IsString()
  @IsNotEmpty()
  token: string;
}

export default ConfirmEmailDto;