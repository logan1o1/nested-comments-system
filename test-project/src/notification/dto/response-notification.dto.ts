import type { UUID } from "crypto";

export class NotificationResponseDto {
    id: string;
    commentId: UUID;
    read: boolean;
    createdAt: Date;
    commentText?: string;
}