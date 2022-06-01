exports.Product = {
	category: (parent, args, { categories }) => {
		const { categoryId } = parent

		return categories.find(category => category.id === categoryId)
	},
	reviews: (parent, args, { reviews }) => {
		const { id } = parent

		return reviews.filter(review => review.productId === id )
	}
};