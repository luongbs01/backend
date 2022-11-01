import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Validate, ValidateNested } from "class-validator";
import { PrimaryColumnCannotBeNullableError } from "typeorm";

export class UpdateProfileDto {
  @ApiPropertyOptional({type: String})
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({type: String})
  @IsOptional()
  @IsString()
  location: string;

  @ApiPropertyOptional({type: String})
  @IsOptional()
  @IsString()
  bio: string;

  @ApiPropertyOptional({type: String})
  @IsOptional()
  @IsString()
  facebook: string;

  @ApiPropertyOptional({type: String})
  @IsOptional()
  @IsString()
  instagram: string;

  @ApiPropertyOptional({type: String})
  @IsOptional()
  @IsString()
  linkedin: string;
}

export default UpdateProfileDto;