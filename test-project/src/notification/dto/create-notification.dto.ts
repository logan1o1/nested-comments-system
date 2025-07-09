import type { UUID } from "crypto";

export class CreateNotificationDto {
    userId: UUID;
    commentId: UUID;
}
