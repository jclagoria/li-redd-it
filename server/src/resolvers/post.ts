// @ts-ignore
import {Resolver, Query, Ctx, Arg, Int, Mutation} from "type-graphql";

import { Post } from "../entities/Post";
import { MyContext } from "../type";

@Resolver()
export class PostResolver {

    @Query(() => [Post])
    allPosts(@Ctx() {em}: MyContext): Promise<Post[]> {
        return em.find(Post, {disabled:false, deleteAt: null});
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg('id') id: number,
        @Ctx() {em}: MyContext): Promise<Post | null>
    {
        return em.findOne(Post, { id , disabled:false, deleteAt: null});
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
        const post = await em
            .findOne(Post, {id,
                deleteAt: null});

        if (!post) {
            return null;
        }

        post.title = title;

        await em.persistAndFlush(post);

        return post;
    }

    @Mutation(() => Post, {nullable: true})
    async deletePost(
        @Arg('id') id: number,
        @Ctx() {em}: MyContext): Promise<Post | null>
    {
        const post = await em
            .findOne(Post, {id,
                disabled: false, deleteAt: null});

        if (!post) {
            return null;
        }

        post.disabled = true;

        await em.persistAndFlush(post);

        return post;
    }

}
