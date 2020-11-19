import {DateType, PrimaryKey, Property} from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class BaseEntity {

    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({type: 'date'})
    createdAt = new Date();

    @Field(() => String, { nullable: true })
    @Property({ type: DateType, nullable: true, onUpdate: () => new Date()})
    updatedAt?: Date;

    @Field(() => String, { nullable: true })
    @Property({ type: DateType , nullable: true, onUpdate: () => new Date() })
    deleteAt?: Date;

    @Field(() => Boolean, { nullable: true })
    @Property({ type: 'boolean', default: false })
    disabled: boolean;


}
