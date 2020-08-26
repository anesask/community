import { Resolver, Query, Ctx, Int, Arg, Mutation } from 'type-graphql';
import { MyContext } from 'src/types';
import { Post } from '../entities/Post';

@Resolver()
export class PostResolver {
    // Get Posts
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    // Get Post
    @Query(() => Post, { nullable: true })
    post(
        @Arg('id', () => Int) id: number,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        return em.findOne(Post, { id });
    }

    // Create Post
    @Mutation(() => Post)
    async createPost(
        @Arg('title') title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = em.create(Post, { title });
        await em.persistAndFlush(post);
        return post;
    }

    // Update Post
    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, { nullable: true }) title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, { id });
        if (!post) {
            return null;
        }
        if (typeof title !== 'undefined') {
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post;
    }

    // Delete Post
    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext
    ): Promise<boolean> {
        await em.nativeDelete(Post, { id });
        return true;
    }
}
