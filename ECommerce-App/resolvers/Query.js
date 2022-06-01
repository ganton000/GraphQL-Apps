//Define what data is returned
//three params: parent, args, context
//parent:
//args: object containing all params supplied
exports.Query = {
		products: (parent, args, { products }) => {

			const { filter } = args;
			let filteredProducts = products;

			if (filter) {
				if (filter.onSale){
					filteredProducts = products.filter(product => {
						return product.onSale
					})
				}
			};

			return filteredProducts

		},
		product: (parent, args, { products }) => {
			const { id } = args;

			const product = products.find(product => product.id === id)

			if (!product) return null;
			return product
		},
		categories: (parent, args, {categories}) => {
			return categories
		},
		category: (parent, args, { categories }) => {
			const { id } = args;

			return categories.find(category => category.id === id);
		}
};
