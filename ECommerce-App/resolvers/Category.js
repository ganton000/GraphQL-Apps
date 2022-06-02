exports.Category = {
	products: (parent, args, { db }) => {
		const { id: categoryId } = parent;
		const { filter } = args;

		let filteredCategoryProducts = db.products.filter(product => product.categoryId === categoryId)

			if (filter) {
				if (filter.onSale){
					filteredCategoryProducts = db.products.filter(product => {
						return product.onSale
					})
				}
			};

		return filteredCategoryProducts;
	}
};