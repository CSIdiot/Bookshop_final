### enviroment variables
create a .env file under root dir which includes:

NODE_ENV = development

PORT = 8888

MONGO_URI = (mongodb+srv://bookshop:DDxbwG1IvFeIvgpH@bookshop.y9kr1.mongodb.net/test?authSource=admin&replicaSet=atlas-xepdx8-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true)retryWrites=true&w=majority）

JWT_SECRET = 'abc123'

### install dependencies

```
npm install

cd frontend
npm install
```

### Run web

```
# run both backend and frontend
npm run dev

```


### database test

Use the following command to create a database to test user and product information, as well as all the data that can be used

```
# insert
npm run data:import
# delete
npm run data:destroy
```

```
test user data

admin@example.com (Admin)
123456

summer@example.com (Customer)
123456

henry@example.com (Customer)
123456
```
