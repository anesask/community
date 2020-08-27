import { Resolver, InputType, Field, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '../entities/User';
import { MyContext } from 'src/types';
const argon2 = require('argon2');

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@Resolver()
export class UserResolver {
    // Register User
    @Mutation(() => User)
    async register(
        @Arg('options', () => UsernamePasswordInput)
        options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ) {
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword,
        });
        await em.persistAndFlush(user);
        return user;
    }
}
