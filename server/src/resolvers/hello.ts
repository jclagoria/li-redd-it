import {Query, Resolver} from "type-graphql";

@Resolver()
export class HelloResolver {

    @Query(() => String)
    firstHello() {
        return "Hi Juan, are u ok?";
    }

}
