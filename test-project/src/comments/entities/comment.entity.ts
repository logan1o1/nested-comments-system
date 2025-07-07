import type { UUID } from "crypto";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity({name: 'comments'})
@Tree('closure-table')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column({ type: 'uuid', nullable: true })
    userid: UUID | null;

    @Column()
    text: string;

    @CreateDateColumn({type: 'timestamp with time zone'})
    createdAt: Date;

    @TreeParent()
    parent?: Comment;

    @TreeChildren()
    children: Comment[];
}
