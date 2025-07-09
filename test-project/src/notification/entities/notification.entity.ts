import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auth } from "../../auth/entities/auth.entity";
import { Comment } from "../../comments/entities/comment.entity";


@Entity({ name: 'notifications'})
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Auth, {eager: true})
    user: Auth;

    @ManyToOne(() => Comment)
    comment: Comment;

    @Column({ default: false})
    read: boolean

    @CreateDateColumn()
    createdAt: Date;
}
