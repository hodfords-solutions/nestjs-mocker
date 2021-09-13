import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";
import { TypeSelectionEnum } from "~mocks/enums/type-selection.enum";
import { FakerType } from "~mocks/interfaces/faker-type.interface";
import { ValidateIfOrExclude } from "~mocks/decorators/validate-if-or-exclude.decorator";

export class CreatePropertyDto {
  @ApiProperty()
  @IsNotEmpty()
  key?: string;

  @ApiProperty({
    enum: TypeSelectionEnum,
    default: TypeSelectionEnum.UUID,
  })
  @IsNotEmpty()
  type: TypeSelectionEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateIfOrExclude(({ type }) => type === TypeSelectionEnum.FAKER)
  fakerType?: FakerType;

  @ApiProperty({ required: false })
  @IsOptional()
  overrideValue?: string | number;

  @ApiProperty({ required: false })
  @IsOptional()
  defaultValue?: string | number;

  @ApiProperty({ default: true })
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  items: CreatePropertyDto[];
}
