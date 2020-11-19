import {Arg, Ctx, Field, InputType, Mutation, Resolver} from "type-graphql";
import argon2 from "argon2";

import { MyContext } from "src/type";
import { User } from "../entities/User";

@InputType()
class UserNamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}


@Resolver()
export class UserResolver {


    @Mutation(() => User)
    async register(
        @Arg('options', ()=> UserNamePasswordInput) options: UserNamePasswordInput,
        @Ctx() {em}: MyContext): Promise<User>
    {
        const hashedpassword = await argon2.hash(options.password);
        const user = em.create(User, {
            username: options.username,
            password: hashedpassword});
        await em.persistAndFlush(user);
        return user;
    }

}
