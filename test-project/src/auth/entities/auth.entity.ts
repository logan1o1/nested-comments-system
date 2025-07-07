import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@Entity({name: 'userdata'})
export class Auth {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({nullable: false})
    email: string;

    @Column({ nullable: false,  })
    password: string;
}
