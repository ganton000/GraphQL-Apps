const { v4: uuid } = require("uuid");

exports.Mutation = {
	addCategory: (parent, { input }, { db }) => {
		const { name } = input;

		const newCategory = {
			id: uuid(),
			name
		}

		//adds new Category
		db.categories.push(newCategory);

		return newCategory;
	},

	addProduct: (parent, {input}, { db }) => {


		//mask to check if categoryId exists
		const checkCategoryId = obj => obj.id === input.categoryId;

		//add new product if categoryId exists in categories
		if (db.categories.some(checkCategoryId)) {

			const newProduct = {
				...input,
				id: uuid()
			}

			db.products.push(newProduct)

			return newProduct
		}

		return console.log(`Category id: ${input.categoryId} does not exist.`)
	},

	addReview: (parent, {input}, { db }) => {

		//check if productId exists
		const checkProductId = obj => obj.id === input.productId;

		if (db.products.some(checkProductId)) {
			const newReview = {
				...input,
				id: uuid()
			 }

			db.reviews.push(newReview);

			return newReview
		}

		return console.log(`Product id: ${input.productId} does not exist.`)
	},

	deleteCategory: (parent, { id }, {db: {categories, products, reviews} }) => {

		//mask to check for categorytId
		const checkCategoryId = obj => obj.id === id;

		//check if categoryId exists
		if (categories.some(checkCategoryId)) {

			//remove category
			categories = categories.filter(category => category.id !== id)

			//nullify deleted categoryId
			products = products.map(product => {
				if (product.categoryId === id) {
					return {
						...product,
						categoryId: null
					}
				} else { return product }
			})

			return true;

		} else {
			return false;
		}
	},
	deleteProduct: (parent, { id }, { db }) => {

		//mask to check if productId exists
		const checkProductId = obj => obj.id === id;

		//check if productId exists
		if (db.products.some(checkProductId)) {
			db.products = db.products.filter(product => product.id !== id)

			//cascade to reviews
			db.reviews = db.reviews.filter(review => review.productId !== id)

			return true;
		} else { return false }
	},
	deleteReview: (parent, { id }, { db }) => {

		//mask to check if reviewId exists
		const checkReviewId = obj => obj.id === id;

		//check if productId exists
		if (db.reviews.some(checkReviewId)) {
			db.reviews = db.reviews.filter(review => review.id !== id)

			return true;
		} else { return false; }
	},
	updateCategory: (parent, { id, input }, { db }) => {

		const checkCategoryId = obj => obj.id === id;
		//check if categoryId exists
		if (db.categories.some(checkCategoryId)) {
			//get index in array that needs to be updated
			const index = db.categories.findIndex(checkCategoryId)

			db.categories[index] = {
				...db.categories[index],
				...input
			};

			return db.categories[index];
		} else { return console.log(`Category id: ${id} does not exist.`) }
	},
	updateProduct: (parent, {id, input}, { db }) => {

			//get index in array that needs to be updated
			const index = db.products.findIndex(product => product.id === id);

			//if index does not exist
			if (index === -1) return null;

			db.products[index] = {
				...db.products[index],
				...input
			};

			return db.products[index];
	},
	updateReview: (parent, {id, input}, { db }) => {

		//get index in array that needs to be updated
		const index = db.reviews.findIndex(review => review.id === id);

		//if index does not exist
		if (index === -1) return null;

		db.reviews[index] = {
			...db.reviews[index],
			...input
		};

		return db.reviews[index];
	}
};