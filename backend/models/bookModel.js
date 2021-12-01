import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		required: true
	},
	comment: {
		type: String,
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
}, {
	timestamps: true,
})


const bookSchema = mongoose.Schema({

	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},

	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
	},
	price: {
		type: Number,
		required: true,
	},
	reviews: [reviewSchema],
	numReviews: {
		type: Number,
		required: true,
	},
	countInStock: {
		type: Number,
		required: true,
		default: 0,
	},
	publisher:{
		type: String,
		required: true,
	},
	publishDate:{
		type: String,
		required: true,
	},
	page:{
		type: Number,
		required: true,
	},
	author:{
		type: String,
		required: true,
	},
	language:{
		type: String,
		required: true,
	}
	
}, {
	timestamps: true,
})

const Book = mongoose.model('Book', bookSchema)

export default Book
