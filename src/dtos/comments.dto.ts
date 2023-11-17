import { IsString, IsNotEmpty, MinLength, IsOptional, IsArray, IsUUID } from "class-validator";

export class CreateCommentDto{
    @IsString()
    @IsNotEmpty()
    public comment: string;
}
export class UpdateCommentDto{
    @IsString()
    @IsOptional()
    public comment: string;
}