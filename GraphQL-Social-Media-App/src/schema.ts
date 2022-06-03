import { gql } from "apollo-server";

export const typeDefs = gql`
	type Query {
		me: User
		posts: [Post!]!
		profile(userId: ID!): Profile
	}

	type Mutation {
		postCreate(post: PostInput!): PostPayload!
		postUpdate(postId: ID!, post: PostInput!): PostPayload!
		postDelete(postId: ID!): PostPayload!
		postPublish(postId: ID!): PostPayload!
		postUnpublish(postId: ID!): PostPayload!
		signUp(credentials: CredentialsInput!, name: String!, bio: String!): AuthPayload!
		signIn(credentials: CredentialsInput!): AuthPayload!
	}

	type PostPayload {
		userErrors: [UserError!]!
		post: Post
	}

	type AuthPayload {
		userErrors: [UserError!]!
		token: String
	}

	type UserError {
		message: String!
	}

	type Post {
		id: ID!
		title: String!
		content: String!
		createdAt: String!
		published: Boolean!
		user: User!
	}

	type User {
		id: ID!
		name: String!
		email: String!
		posts: [Post!]!
	}

	type Profile {
		id: ID!
		bio: String!
		isMyProfile: Boolean!
		user: User!
	}

	input PostInput {
		title: String
		content: String
	}

	input CredentialsInput {
		email: String!
		password: String!
	}
`;