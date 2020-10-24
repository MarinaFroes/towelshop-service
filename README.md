# Ecommerce Fullstack project

See Screenshots bellow.

<h2 align="center">Home page</h2>

<p align="center"><img src="./screenshots/HOME.png" alt="" title="home-page" width="50%"></p>

<h2 align="center">Home page with search</h2>

<p align="center"><img src="./screenshots/SEARCH.png" alt="" title="home-page" width="50%"></p>

<h2 align="center">Our History Page</h2>

<p align="center"><img src="./screenshots/OUR_HISTORY.png" alt="" title="home-page" width="50%"></p>

<h2 align="center">Login Page</h2>

<p align="center"><img src="./screenshots/LOGIN.png" alt="" title="home-page" width="50%"></p>

<h2 align="center">Account Page Admin</h2>

<p align="center"><img src="./screenshots/ACCOUNT_ADMIN.png" alt="" title="home-page" width="50%"></p>

<h2 align="center">Account Page User</h2>

<p align="center"><img src="./screenshots/ACCOUNT_USER.png" alt="" title="home-page" width="50%"></p>

<h2 align="center">User Edit Page</h2>

<p align="center"><img src="./screenshots/USER_EDIT.png" alt="" title="home-page" width="50%"></p>

<h2 align="center">Product Page</h2>

<p align="center"><img src="./screenshots/PRODUCT.png" alt="" title="home-page" width="50%"></p>

<h2 align="center">Manage Products Page</h2>

<p align="center"><img src="./screenshots/MANAGE_PRODUCT.png" alt="" title="home-page" width="50%"></p>

<h2 align="center">Edit Product Page</h2>

<p align="center"><img src="./screenshots/EDIT_PRODUCT.png" alt="" title="home-page" width="50%"></p>

<h2 align="center">Cart Page</h2>

<p align="center"><img src="./screenshots/CART.png" alt="" title="home-page" width="50%"></p>

<h2 align="center">Not Found Page</h2>

<p align="center"><img src="./screenshots/NOT_FOUND.png" alt="" title="home-page" width="50%"></p>

# Project Requirements

## REST API lecture

- [x] Website has products and users
- [x] Products - Have different attributes: ID, name, description, categories, variants, sizes
- [x] Users - Attributes: ID, first name, last name, email
- [x] Admin - Special users with certain privileges

### Use cases:

- Products:
- [x] Get list of all products with/without pagination
- [x] Get list of products, filtering (search) by: name, categories, variant, size
- [x] Get a product by ID
- Admin:
- [x] Add a new product, update info of a product, remove a product
- [x] Ban a user, unban a user
- Users:
- [x] Sign up a new user (username, password, first name, last name, email)
- [x] Sign in user with username/password
- [x] Update user profile (first name, last name, email)
- [ ] Forget password request - <em>NOT IMPLEMENTED</em>
- [ ] Change password (username, old password, new password) - <em>NOT IMPLEMENTED</em>

## Mongo DB lecture

- [x] Design & practice the data model for the E-commerce system that you have designed the APIs for
- [x] Data modeling (e.g, shapes of documents in each collection), relationships (embedded document or reference)
- [ ] CRUD operations using different operators ($set, $in, $inc, $and/\$or etc) - <em>PARTIALLY IMPLEMENTED</em>
- [ ] Index, aggregation with different stages ($match, $project, $sort, $group, \$lookup) - <em>NOT IMPLEMENTED</em>

## Express lecture

- Implement the backend REST API for the Library or E-Commerce system
  - [ ] Consistent error handling - <em>NEED IMPROVEMENT</em>
  - [x] Use versioning
  - [x] Use JSON for response

## Testing lecture

- Add unit test to your backend assignment - <em>PARTIALLY IMPLEMENTED</em>
  - [ ] Test coverage should be 100% for all the APIs
  - [ ] Test for controllers
  - [ ] Test for services

## Security lecture

- [x] Integrate the Google login to your backend
- [x] If the user logs in with your personal email, make him an admin
- [x] Otherwise, make him a normal user

## PostgreSQL lecture

- Convert your E-commerce assignment from MongoDB to PostgreSQL - <em>NOT IMPLEMENTED</em>
  - [ ] Define tables/indexes/keys
  - [ ] Create queries for different scenarios (e.g, APIs)
  - [ ] Create one .sql file with all table definitions, queries, indices etc. Don’t have to convert the code
