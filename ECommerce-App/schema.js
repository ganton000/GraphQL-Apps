const { gql } = require("apollo-server");

exports.typeDefs = gql`
	type Query {
		products(filter: ProductsFilterInput): [Product!]!
		product(id: ID!): Product
		categories: [Category!]!
		category(id: ID!): Category
	}

	#specify what attributes from Product we want back
	type Product {
		id: ID!
		name: String!
		description: String!
		image: String!
		quantity: Int!
		price: Float!
		onSale: Boolean!
		category: Category
		reviews: [Review]!
	}

	type Category {
		id: ID!
		name: String!
		products(filter: ProductsFilterInput): [Product!]!
	}

	type Review {
		id: ID!
		date: String!
		title: String!
		comment: String!
		rating: Int!
	}

	#creates object to use as filter params
	input ProductsFilterInput {
		onSale: Boolean
	}
`;