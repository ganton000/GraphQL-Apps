import { Context } from '../../index';
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JWT_SIGNATURE } from '../../keys';


interface SignUpArgs {
	credentials: {
		email: string;
		password: string;
	}
	name: string;
	bio: string;
}

interface SignInArgs {
	credentials: {
		email: string;
		password: string;
	}

}

interface UserPayload {
	userErrors: {
		message: string
	}[]
	token: string | null;
}


export const authResolvers = {
	signUp: async (
	_: any,
	{ credentials: { email, password }, name, bio }: SignUpArgs,
	{ prisma } : Context
	): Promise<UserPayload> => {

		const isEmail = validator.isEmail(email);

		if (!isEmail) {
			return {
				userErrors: [{
					message: "Invalid email address"
				}],
				token: null
			}
		}

		const isValidPassword = validator.isLength(password, {
			min: 5
		});

		if (!isValidPassword) {
			return {
				userErrors: [{
					message: "Invalid password"
				}],
				token: null
			}
		}

		if (!name || !bio) {
			return {
				userErrors: [{
					message: "Invalid name or bio"
				}],
				token: null
			}
		}

		//Hash password using bcrypt
		//2nd arg -> salt amount
		const hashedPassword = await bcrypt.hash(password, 10)

		//create user
		const user = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword
			}
		});

		//create profile of user
		await prisma.profile.create({
			data: {
				bio,
				userId: user.id
			}
		});

		const token = await JWT.sign({
			userId: user.id
		}, JWT_SIGNATURE, { expiresIn: 360000 })

		return {
			userErrors: [],
			token
		}

	},
	signIn: async (
		_: any,
		{ credentials: {email, password} }: SignInArgs,
		{ prisma }: Context
	): Promise<UserPayload> => {

		//look for user in db using email
		//in this case, emails are @unique via prisma schema
		const user = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (!user) {
			return {
				userErrors: [{
					message: "Invalid credentials"
				}],
				token: null
			}
		};

		const isPasswordMatch = await bcrypt.compare(password, user.password);

		if (!isPasswordMatch) {
			return {
				userErrors: [{
					message: "Invalid credentials"
				}],
				token: null
			}
		};

		return {
			userErrors: [],
			token: JWT.sign({
				userId: user.id
			}, JWT_SIGNATURE, { expiresIn: 360000 })
		}

	},
}
