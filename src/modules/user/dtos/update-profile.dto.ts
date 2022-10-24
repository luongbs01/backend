import { IsOptional, IsString, Validate, ValidateNested } from "class-validator";
import { PrimaryColumnCannotBeNullableError } from "typeorm";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  facebook: string;

  @IsOptional()
  @IsString()
  instagram: string;

  @IsOptional()
  @IsString()
  linkedin: string;
}

export default UpdateProfileDto;