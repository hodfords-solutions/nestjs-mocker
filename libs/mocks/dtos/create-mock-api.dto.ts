import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { RequestMethodEnum } from '../enums/request-method.enum';
import { CreatePropertyDto } from './create-property.dto';

export class CreateMockApiDto {
    @ApiProperty({
        enum: RequestMethodEnum,
        default: RequestMethodEnum.GET
    })
    @IsNotEmpty()
    @IsEnum(RequestMethodEnum)
    method: RequestMethodEnum;

    @ApiProperty()
    @IsNotEmpty()
    endpoint: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    delay?: number;

    @ApiProperty()
    @IsOptional()
    body?: CreatePropertyDto[];

    @ApiProperty()
    @IsNotEmpty()
    response: CreatePropertyDto[];
}
