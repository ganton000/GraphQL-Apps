const { ApolloServer } = require("apollo-server");
const { typeDefs } = require("./schema");
const { Query } = require("./resolvers/Query");
const { Product } = require("./resolvers/Product");
const { Category } = require("./resolvers/Category");
const { products, categories, reviews } = require("./db");

//Scalar Types
//String, Int, Float, Boolean

//Instantiate the server
const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
		Category,
		Product
	},
	context: {
		categories,
		products,
		reviews
	}
});

server.listen().then(({ url }) =>{
	console.log(`Server is ready at url: ${url}`)
});