import { ApolloServer} from "apollo-server";
import { typeDefs } from './schema';
import { Query, Mutation } from './resolvers';
import { PrismaClient, Prisma } from "@prisma/client";


//create db connection via Prisma
const prisma = new PrismaClient();

export interface Context {
	prisma: PrismaClient<
	Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
	>;
}

//create connection to ApolloServer
const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
		Mutation
	},
	context: {
		prisma
	}
});


//listen on Server
server.listen().then(({ url }) => {
	console.log(`Server ready on ${url}`)
});