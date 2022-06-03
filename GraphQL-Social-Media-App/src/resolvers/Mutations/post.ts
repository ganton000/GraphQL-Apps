import { Post, Prisma } from '@prisma/client';
import { Context } from '../../index';
import { canUserMutatePost } from '../../utils/canUserMutatePost';

interface PostArgs {
	post: {
		title?: string;
		content?: string;
	}
}

interface PostPayloadType {
	userErrors: {
		message: string
	}[];
	post: Post | Prisma.Prisma__PostClient<Post> | null
}


export const postResolvers = {
	postCreate: async (
		_: any,
		{post}: PostArgs,
		{ prisma, userInfo }: Context
		): Promise<PostPayloadType> => {

		const { title, content } = post

		//check user is Authenticated
		if (!userInfo) {
			return {
				userErrors: [{
					message: "Forbidden access (unauthenticated)."
				}],
				post: null
			}
		};

		// validation
		if (!title || !content) {
			return {
				userErrors: [{
					message: "You must provide a title and content to create a post."
				}],
				post: null
			}
		}

		return {
			userErrors: [],
			post: prisma.post.create({
				data: {
					title,
					content,
					authorId: userInfo.userId
				},
			})
		}
	},
	postUpdate: async (
		_: any,
		{ post, postId }: {postId: string, post: PostArgs["post"]},
		{ prisma, userInfo } : Context
		): Promise<PostPayloadType> => {

			const {title, content} = post;

			//check user is Authenticated
			if (!userInfo) {
				return {
					userErrors: [{
						message: "Forbidden access (unauthenticated)."
					}],
					post: null
				}
			};

			const error = await canUserMutatePost({
				userId: userInfo.userId,
				postId: Number(postId),
				prisma
			});

			if (error) return error;

			const existingPost = await prisma.post.findUnique({
				where: { id: Number(postId) }
			})

			if (!title && !content) {
			return {
				userErrors: [
				{
					message: "Need to have at least one field to update"
				}],
				post: null
				}
			};

			if (!existingPost) {
				return {
					userErrors: [
					{
						message: `Post id: ${postId} does not exist!`
					}],
					post: null
					}
				};

			let payloadToUpdate = { title, content }

			if (!title) delete payloadToUpdate.title
			if (!content) delete payloadToUpdate.content

			return {
				userErrors: [],
				post: prisma.post.update({
					data: {
						...payloadToUpdate
					},
					where: {
						id: Number(postId)
					}
				})
			}
		},
		postDelete: async (
			_: any,
			{ postId }: {postId: string},
			{ prisma, userInfo }: Context
			): Promise<PostPayloadType> => {

			//check user is Authenticated
			if (!userInfo) {
				return {
					userErrors: [{
						message: "Forbidden access (unauthenticated)."
					}],
					post: null
				}
			};

			const error = await canUserMutatePost({
				userId: userInfo.userId,
				postId: Number(postId),
				prisma
			});

			//ensures authenticated user's ID matches post's userId
			if (error) return error;

				const post = await prisma.post.findUnique({
					where: {
						id: Number(postId)
					}
				})

				if (!post) {
					return {
						userErrors: [{
							message: "Post does not exist!"
						}],
						post: null
					}
				};

				await prisma.post.delete({
					where: { id: Number(postId) }
				})

				return {
					userErrors: [],
					post
				};
		}
}