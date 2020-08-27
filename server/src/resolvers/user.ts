import {
    Resolver,
    InputType,
    Field,
    Mutation,
    Arg,
    Ctx,
    ObjectType,
} from 'type-graphql';
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

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    // Register User
    @Mutation(() => UserResponse)
    async register(
        @Arg('options', () => UsernamePasswordInput)
        options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [
                    {
                        field: 'Username',
                        message: 'Username length must be greater than 2.',
                    },
                ],
            };
        }
        if (options.password.length <= 6) {
            return {
                errors: [
                    {
                        field: 'Password',
                        message: 'Password length must be greater than 6.',
                    },
                ],
            };
        }
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword,
        });
        await em.persistAndFlush(user);
        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => UsernamePasswordInput)
        options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username });
        if (!user) {
            return {
                errors: [
                    {
                        field: 'Username',
                        message: 'That username doesn`t exist.',
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: 'Password',
                        message: 'Password incorrect.',
                    },
                ],
            };
        }

        return { user };
    }
}
