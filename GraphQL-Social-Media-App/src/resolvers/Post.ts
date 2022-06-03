import { Context } from "..";
import { userLoader } from "../loaders/userLoader";


interface PostParentType {
	authorId: number;
}

//return user data from Profile using foreign key
export const Post = {
	user: (
		parent : PostParentType,
		__: any,
		{ prisma } : Context
	) => {

		//reduce number of requests for similar id's
		//and batch/cache them via userLoader
		return userLoader.load(parent.authorId)
	},
}