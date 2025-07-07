import type { UUID } from "crypto";

export class CreateCommentDto {
    userid: UUID;
    text: string;
    parentId?: UUID;
}
