exports.Category = {
	products: (parent, args, { products }) => {
		const { id: categoryId } = parent;
		const { filter } = args;

		let filteredCategoryProducts = products.filter(product => product.categoryId === categoryId)

			if (filter) {
				if (filter.onSale){
					filteredCategoryProducts = products.filter(product => {
						return product.onSale
					})
				}
			};

		return filteredCategoryProducts;
	}
};