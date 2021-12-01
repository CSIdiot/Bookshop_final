import bcrypt from 'bcryptjs'
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'leijiang',
    email: 'leijiang@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'limenglin',
    email: 'limenglin@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
]

export default users
