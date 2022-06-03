import { ApolloServer} from "apollo-server";
import { typeDefs } from './schema';
import { Query, Mutation, Profile, Post, User } from './resolvers';
import { PrismaClient, Prisma } from "@prisma/client";
import { getUserFromToken } from "./utils/getUserFromToken";



//create db connection via Prisma
export const prisma = new PrismaClient();

export interface Context {
	prisma: PrismaClient<
	Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
	>;
	userInfo: { userId: number } | null
}

//create connection to ApolloServer
const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
		Mutation,
		Profile,
		Post,
		User
	},
	context: async ({ req }: any): Promise<Context> => {

		const userInfo = await getUserFromToken(req.headers.authorization)

		return {
			prisma,
			userInfo
		}
	}
});


//listen on Server
server.listen().then(({ url }) => {
	console.log(`Server ready on ${url}`)
});