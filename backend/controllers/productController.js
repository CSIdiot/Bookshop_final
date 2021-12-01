import asyncHandler from 'express-async-handler'
import Book from '../models/bookModel.js'

// get all books
const getProducts = asyncHandler(async (req, res) => {
	const pageSize = 8
	const page = Number(req.query.pageNumber) || 1
	const keyword = req.query.keyword ?
		{
			name: {
				$regex: req.query.keyword,
				$options: 'i',
			},
		} :
		{}

	//get books by keyword
	const count = await Book.countDocuments({
		...keyword
	})
	const products = await Book.find({
			...keyword
		})
		.limit(pageSize)
		.skip(pageSize * (page - 1))
	res.json({
		products,
		page,
		pages: Math.ceil(count / pageSize)
	})
})

// request single book
const getProductById = asyncHandler(async (req, res) => {
	const product = await Book.findById(req.params.id)
	if (product) {
		res.json(product)
	} else {
		res.status(404)
		throw new Error('can not find that book!')
	}
})

// delete a book
const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Book.findById(req.params.id)
	if (product) {
		await product.remove()
		res.json({
			message: 'successfully deleted'
		})
	} else {
		res.status(404)
		throw new Error('can not find that book!')
	}
})

// create book
const createProduct = asyncHandler(async (req, res) => {
	const {
		name,
		price,
		description,
		image,
		brand,
		category,
		countInStock,
		publisher,
		publishDate,
		page,
		author,
		language
	} = req.body
	const product = new Book()
	product.name = name
	product.price = price
	product.description = description
	product.image = image
	product.category = category
	product.countInStock = countInStock
	product.publisher = publisher;
	product.publishDate = publishDate;
	product.page = page;
	product.author = author;
	product.language = language
	product.numReviews = 0
	product.user = req.user._id
	const createdProduct = await product.save()
	res.status(201).json(createdProduct)
})

// update book content
const updateProduct = asyncHandler(async (req, res) => {
	const {
		name,
		price,
		description,
		image,
		brand,
		category,
		countInStock,
		publisher,
		publishDate,
		page,
		author,
		language
	} = req.body

	const product = await Book.findById(req.params.id)
	if (product) {
		product.name = name
		product.price = price
		product.description = description
		product.image = image
		product.category = category
		product.countInStock = countInStock
		product.publisher = publisher;
		product.publishDate = publishDate;
		product.page = page;
		product.author = author;
		product.language = language
		const updatedProduct = await product.save()
		res.status(201).json(updatedProduct)
	} else {
		res.status(404)
		throw new Error('can not find that book')
	}
})

// creact comment 
const createProductReview = asyncHandler(async (req, res) => {
	const {
		rating,
		comment
	} = req.body
	const product = await Book.findById(req.params.id)

	if (product) {
		// whether commented or not
		const alreadeReviewed = product.reviews.find(
			(review) => review.user.toString() === req.user._id.toString()
		)

		if (alreadeReviewed) {
			res.status(400)
			throw new Error('u have commented, can not comment twice')
		}

		// create new commnet
		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment,
			user: req.user._id,
		}
		product.reviews.push(review)
		// update rating and # comments
		product.numReviews = product.reviews.length
		product.rating =
			product.reviews.reduce((acc, review) => acc + review.rating, 0) /
			product.reviews.length

		await product.save()
		res.status(201).json({
			message: 'commented'
		})
	} else {
		res.status(404)
		throw new Error('can not find that book!')
	}
})

// request top 3 books
const getTopProducts = asyncHandler(async (req, res) => {
	const products = await Book.find({}).sort({
		price: 1
	}).limit(4)

	res.json(products)
})
export {
	getProducts,
	getProductById,
	deleteProduct,
	createProduct,
	updateProduct,
	createProductReview,
	getTopProducts,
}
