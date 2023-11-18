import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateReplyDto{
    @IsString()
    @IsNotEmpty()
    public reply: string;
}
export class UpdateReplyDto{
    @IsString()
    @IsOptional()
    public reply: string;
}