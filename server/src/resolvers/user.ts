import {Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver} from "type-graphql";
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

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {

    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user?: User;
}

@Resolver()
export class UserResolver {

    @Mutation(() => UserResponse)
    async register(
        @Arg('options', ()=> UserNamePasswordInput) options: UserNamePasswordInput,
        @Ctx() {em}: MyContext): Promise<UserResponse>
    {
        if(options.username.length <= 2) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "Username must be greater than 2"
                    },
                ],
            };
        }

        if(options.password.length <= 2) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Password must be greater than 2"
                    },
                ],
            };
        }

        const hashedpassword = await argon2.hash(options.password);

        const user = em.create(User, {
            username: options.username,
            password: hashedpassword
        });

        try {
            await em.persistAndFlush(user);
        } catch (error) {
            if (error.code === "23505") {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "Username already taken",
                        },
                    ],
                };
            }
        }

        return {
            user
        };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: UserNamePasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {
            username: options.username,
            deleteAt: null,
            disabled: false});
        if(!user){
            return {
                errors: [
                    {
                        field: "username",
                        message: "that username doesn't exist",
                    },
                ],
            };
        }

        const valid = await argon2.verify(user.password, options.password);
        if(!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Invalid password",
                    },
                ],
            };
        }

        return {
            user,
        };
    }

}
