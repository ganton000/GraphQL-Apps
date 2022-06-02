//Define what data is returned
//three params: parent, args, context
//parent:

//args: object containing all params supplied
exports.Query = {
		products: (parent, { filter }, { db }) => {


			let filteredProducts = db.products;

			if (filter) {
				const { onSale, avgRating } = filter;

				if (onSale){
					filteredProducts = db.products.filter(product => {
						return product.onSale
					})
				};

				//rating within 1-5 range
				if ([1,2,3,4,5].includes(avgRating)) {
					filteredProducts = filteredProducts.filter(product => {
						let sumRating = 0
						let numOfReviews = 0;
						db.reviews.forEach(review => {
							if (review.productId === product.id) {
							sumRating += review.rating;
							numOfReviews++;
							}
						})
						const avgProductRating = sumRating/numOfReviews;

						return avgProductRating >= avgRating
					})
				};
			};

			return filteredProducts

		},
		product: (parent, args, { db }) => {
			const { id } = args;

			const product = db.products.find(product => product.id === id)

			if (!product) return null;
			return product
		},
		categories: (parent, args, { db }) => {
			return db.categories
		},
		category: (parent, args, { db }) => {
			const { id } = args;

			return db.categories.find(category => category.id === id);
		}
};
