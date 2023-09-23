import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn({ type: 'integer' })
    id!: number;

    @Column({ type: 'text' })
    name!: string;

    @Column({ type: 'text' })
    earnings!: string;

    @Column({ type: 'text' })
    country!: string;
}
