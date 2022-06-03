import { Context } from '..';

export const Query = {
	me: async (
		_:any,
		__: any,
		{ prisma, userInfo } : Context
	) => {

		//check if user is authenticated
		if (!userInfo) return null;


		return prisma.user.findUnique({
			where: { id: userInfo.userId }
		});
	},
	posts: async (
		_: any,
		__: any,
		{ prisma }: Context
		) => {

		return prisma.post.findMany({
			where: { published: true },
			orderBy: [{
				createdAt: "desc"
			}]
		});
	},
	profile: async (
		_: any,
		{ userId } : {userId: string},
		{ prisma } : Context
	) => {

		return prisma.profile.findUnique({
			where: { userId: Number(userId)}
		});
	}
}