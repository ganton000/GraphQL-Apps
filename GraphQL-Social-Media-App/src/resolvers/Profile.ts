import { Context } from '..';

interface ProfileParentType {
	id: number;
	bio: string;
	userId: number;
}

//return user data from Profile using foreign key
export const Profile = {
	user: (
		parent : ProfileParentType,
		__: any,
		{ prisma } : Context
	) => {
		return prisma.user.findUnique({
			where: { id: parent.userId }
		})
	},
}