import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('Building')
export class BuildingEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    address: string;

    @Column()
    locationId: string;

    @Column({ nullable: true })
    postalCode: string;

    @Column()
    employeeCount: number;

    @Column({
        type: 'timestamp'
    })
    consumptionPeriodFrom: Date;

    @Column({
        type: 'timestamp'
    })
    consumptionPeriodTo: Date;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp'
    })
    updatedAt: Date;
}
