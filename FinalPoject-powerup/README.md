# ShopFlow --- E-Commerce Website

ShopFlow is a small, client-side e-commerce website built with **HTML,
CSS, and vanilla JavaScript**. It lets users browse products loaded from
a public API, search and sort the catalog, inspect product details, save
favorites, manage a shopping cart, and complete a simulated checkout.
Orders are stored in the browser so they remain available after a
refresh.

-   [Features](#features)
-   [Technology stack](#technology-stack)
-   [Project structure](#project-structure)
-   [Pages and what they do](#pages-and-what-they-do)


## Features

The project requirements and planned features include:

-   Product data fetched from the DummyJSON public products API.
-   Product catalog with search, category filtering, sorting, and
    pagination.
-   Product detail view selected by a product ID in the URL.
-   Original price, discount percentage, and discounted final price.
-   Favorites saved in browser storage.
-   Shopping cart saved in browser storage, with quantity controls and
    stock limits.
-   Cart subtotal/total calculations and item count.
-   Simulated checkout with customer details and basic validation.
-   Previous orders saved in browser storage.
-   Loading, empty, and error states for product retrieval and empty
    cart/catalog cases.
-   Light and dark theme support.
-   Responsive layouts for desktop, tablet, and mobile.


## Technology stack

  -----------------------------------------------------------------------
  Technology                          Purpose
  ----------------------------------- -----------------------------------
  HTML5                               Page structure and forms

  CSS3                                Layout, styling,
                                      glassmorphism-inspired design,
                                      theme variables, responsive rules

  Vanilla JavaScript                  API requests, rendering, filtering,
                                      sorting, pagination,
                                      cart/favorites, validation

  DummyJSON Products API              Public sample product data

  `localStorage`                      Persistent cart, favorites, theme
                                      preference, and order history
  -----------------------------------------------------------------------


## Project structure

``` text
ShopFlow/
├── index.html
├── products.html
├── product.html
├── cart.html
├── checkout.html
├── css/
│   └── style.css
├── javascript/
│   ├── script.js
│   ├── common.js
│   ├── product.js
│   ├── cart.js
│   └── checkout.js
└── media/
    └── logo.svg
```


## Pages and what they do


### 1. Home --- `index.html`

**Purpose:** Introduce ShopFlow and give users a starting point for
discovering products.

Typical contents: - ShopFlow branding and navigation. - A short store
introduction and a hero section. - A call to action that takes users to the
catalog. - Featured products or product/category shortcuts. - Shared
cart and theme controls, where implemented.

### 2. Products / Catalog --- `products.html` or the catalog section of `index.html`

**Purpose:** Let users browse the product collection and narrow the
results.

Main responsibilities: - Fetch product data from DummyJSON. - Render
product cards containing product images, names, categories, ratings, and
prices. - Search products by title. - Filter by category. - Sort by
discounted final price, including low-to-high and high-to-low options. -
Paginate results. - Display loading, error, and no-results states.


The catalog implementation should use the API response's `total` value
to determine the number of pages. If filtering/sorting happens locally
instead, calculate the page count from the filtered result list and
slice that list for the current page. Choose one approach and keep it
consistent with the course requirements.

**Suggested user flow:** search or select a category → sort results →
open a product → add it to favorites or cart.

### 3. Product Details --- `product.html`

**Purpose:** Show complete information about one selected product.

The page reads the product ID from the URL

It can display: - Product title, image/gallery, brand, category, and
rating. - Description and price information. - Discount percentage and
discounted final price. - Stock availability and shipping information. -
Reviews, if supplied by the API. - Quantity input. - Add to Cart
button. - Add to Favorites / Remove from Favorites button.

The page should handle a missing or invalid ID and a product-fetch
failure with a helpful message rather than leaving a blank page.

**Quantity validation:** The requested quantity should be a whole number
of at least 1. The product must be in stock, and the requested quantity
plus the quantity already in the cart must not exceed the product's
stock. If the requested quantity is too high, show the user how many
additional units are available. The favorite button's label should
reflect the saved state when the page loads and update after the user
clicks it.

### 4. Cart --- `cart.html`

**Purpose:** Let users review and modify the items they intend to order.

For each cart line, the page can show: - Product thumbnail and title,
linked back to the details page. - Unit price (the discounted final
price). - Quantity with increase/decrease controls. - Line total
(`unit price × quantity`). - Remove button.

The order summary shows the total item quantity and cart total, with
links to checkout and back to browsing. A Clear Cart action removes all
lines after confirmation.

Expected behavior: - Increasing quantity cannot exceed the product's
stock. - Decreasing quantity cannot take a line below 1; the decrease
button can be disabled at 1. - Removing a line updates the rendered cart
and item badge. - Clearing the cart displays an empty-cart message and a
browse-products link. - Cart contents persist after refresh.

### 5. Checkout / Orders --- `checkout.html`

**Purpose:** Collect customer details for a simulated order and display
previous orders.

The page has two main sections:

**Checkout** - Shows a summary of the current cart and its total. -
Collects customer information such as name, email, phone, and delivery
address/city, according to the implemented form. - Validates required
fields and formats before accepting the order. - Offers a simulated
payment-method selection. It does not process real payments or need to
collect payment-card details. - Displays an order confirmation after
successful submission.

**Previous Orders** - Reads saved orders from browser storage. - Shows a
helpful empty state when no orders exist. - Displays each order's
identifier, date, customer/order information, items, and total. - May
use expandable order sections to show the full details.

When an order is placed successfully, the application should save an
order snapshot, clear the cart, update the cart badge, and show a
confirmation. Saving a snapshot means later changes to a product's API
price do not rewrite an already placed order.

If the cart is empty, the page should not allow an empty order to be
submitted. It should instead explain that the cart is empty and provide
a way back to the catalog. Previous orders should remain visible.

### Favorites

Favorites are a required feature, but the conversation does **not**
confirm that a dedicated Favorites page/view or favorite controls on
catalog cards were completed.

The shared favorite logic is intended to store product IDs. A complete
user flow should allow users to: - Favorite/unfavorite a product from
its details page. - See which products are already favorites. - Open a
Favorites view or filter the catalog to show only favorites. - Keep the
saved list after refreshing.

If the project does not have a separate Favorites page, document the
actual behavior implemented rather than claiming a page exists.

## Pages building process

### Intro page: index.html

Simple intro page for introduction page for the website

Has top nav bar to navigate to other pages.

Hero section with the logo, description about the website and a start shopping button that navigates you to the products page.

### Products/Catalog page: shop.html

This page fetches all the products from the dummyJson API and store it in allProducts variable. 

Then it handles the category filter, sorting and favourites, and displays limited amount of products (20) in every page using pagination.

you can filter the products by categoris, sort them by price (asc/desc) and show your favorites products.

every product card displays product image, title, price after and before discount, amount of discount and a button to add the product to favorits.

every product card is clickable, it navigates you to the product details page

### Product details: product.html

This page displays more deatails about the product you clicked.

It displays images about the product, title, category, rating, price detaled, description,users rivews and extra info...

You can select the quantity and add it to the cart, and add it to favorites

### Cart page: cart.html

This page displays the products from the cart array that is stored in the locale storage

You can remove product from cart, change quantity, clear cart and proceed to checkout in the checkout page.

### Checkout page: checkout.html

Shows the cart info, users enter thier information and place virtual order 

It also shows the orders history that is stored also in the locale storage