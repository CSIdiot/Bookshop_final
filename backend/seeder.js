import dotenv from 'dotenv'
import users from './data/users.js'
import books from './data/books.js'
import User from './models/userModel.js'
import Order from './models/orderModel.js'
import Book from './models/bookModel.js'
import connectDB from './config/db.js'

dotenv.config()
connectDB()

// insert samples to database
const importData = async () => {
  try {
    //empty sample in database
    await Order.deleteMany()
    await User.deleteMany()
	await Book.deleteMany()
    // implement sample insertion
    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id

	const sampleBooks = books.map((book) => {
	  return { ...book, user: adminUser }
	})
	
	await Book.insertMany(sampleBooks)

    console.log('sample inserted!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

// insert samples to database
const destroyData = async () => {
  try {
    // empty sample data
    await Order.deleteMany()
    await User.deleteMany()
	await Book.deleteMany()

    console.log('sample deleted!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

// judege functions 
if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}