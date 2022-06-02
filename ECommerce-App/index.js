const { ApolloServer } = require("apollo-server");
const { typeDefs } = require("./schema");
const { Mutation } = require("./resolvers/Mutation");
const { Query } = require("./resolvers/Query");
const { Product } = require("./resolvers/Product");
const { Category } = require("./resolvers/Category");
const { db } = require("./db");

//Scalar Types
//String, Int, Float, Boolean

//Instantiate the server
const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
		Mutation,
		Category,
		Product
	},
	context: {
		db
	}
});

server.listen().then(({ url }) =>{
	console.log(`Server is ready at url: ${url}`)
});