// @ts-ignore
import {Resolver, Query, Ctx, Arg, Int, Mutation} from "type-graphql";

import { Post } from "../entities/Post";
import { MyContext } from "../type";

@Resolver()
export class PostResolver {

    @Query(() => [Post])
    allPosts(@Ctx() {em}: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg('id') id: number,
        @Ctx() {em}: MyContext): Promise<Post | null>
    {
        return em.findOne(Post, { id });
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title') title: string,
        @Ctx() {em}: MyContext): Promise<Post>
    {
        const newPost = em.create(Post, {title});
        await em.persistAndFlush(newPost);

        return newPost;
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg('id') id: number,
        @Arg('title') title: string,
        @Ctx() {em}: MyContext): Promise<Post | null>
    {
        const post = await em.findOne(Post, {id});

        if (!post) {
            return null;
        }

        post.title = title;

        await em.persistAndFlush(post);

        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number,
        @Ctx() {em}: MyContext): Promise<boolean>
    {
        const post = await em.findOne(Post, {id});

        if (!post) {
            return false;
        }

        try {
            await em.nativeDelete(Post, { id });
            return true;
        } catch (err) {
            return false;
        }


    }

}
