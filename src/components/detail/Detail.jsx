import React from "react";
import "./detail.css";
import IMG1 from "../../assets/ss1.png";
import IMG2 from "../../assets/ss3.png";
import IMG3 from "../../assets/ss4.png";
import IMG4 from "../../assets/ss5.png";
import IMG5 from "../../assets/ss6.png";
import IMG6 from "../../assets/ss7.png";
import IMG7 from "../../assets/ss8.png";
import IMG8 from "../../assets/ss9.png";
import IMG9 from "../../assets/ss10.png";
import IMG10 from "../../assets/ss11.png";
import IMG11 from "../../assets/ss12.png";
import IMG12 from "../../assets/ss13.png";
import IMG13 from "../../assets/ss14.png";
import IMG14 from "../../assets/ss15.png";
import IMG15 from "../../assets/ss16.png";

const data = [
  {
    id: 1,
    image: IMG1,
    title: "Home Page and Product Features",
    description:
      "This Home page can be accessed by all roles both admin and user. As well as containing several examples of products available on e-commerce websites. to make transactions are required to sign first This Home page can be accessed by all roles both admin and user. As well as containing several examples of products available on the e-commerce website. to make transactions are required to sign first",
  },
  {
    id: 2,
    image: IMG2,
    title: "Page Sign in",
    description:
      "On the right side of the website there is a Login menu, after clicking it will appear as shown above. When logging in, the user must enter the email and password that has been registered previously. After successful login, the e-commerce website can be accessed as a role user.",
  },
  {
    id: 3,
    image: IMG3,
    title: "Page Sign up",
    description:
      "The Sign up page requires data in the form of name, email, password and password confirmation which by default will be registered as a user role.",
  },
  {
    id: 4,
    image: IMG4,
    title: "Home Page and Product Features after Sign in",
    description:
      "After a successful login, the Home Page and Features Products page will reappear as shown above. transactions can be made.",
  },
  {
    id: 5,
    image: IMG5,
    title: "Product Search Page",
    description:
      "On the Search Product page, users can enter the keywords of the products they want to search for. Keywords entered can be based on category and product name.",
  },
  {
    id: 6,
    image: IMG6,
    title: "Products Page",
    description:
      "This Products page contains all products that can be accessed by all roles. At the top there is a filter that is useful for filtering products by category.",
  },
  {
    id: 7,
    image: IMG7,
    title: "Products Page",
    description:
      "At the bottom of the products page there is pagination which is useful for moving to another products page. Each products page consists of 10 products.",
  },
  {
    id: 8,
    image: IMG8,
    title: "Products Page",
    description:
      "When the cursor is over the product image, the product image will enlarge as shown above.",
  },
  {
    id: 9,
    image: IMG9,
    title: "Cart Products Page",
    description:
      "The Cart page contains features for adding and subtracting the number of products, the total price per product and the total price of all products in the cart. In addition, there is a remove product from cart feature and a checkout button to proceed to the confirm order stage.",
  },
  {
    id: 10,
    image: IMG10,
    title: "Shipping Address Page",
    description:
      "On the Shipping Address page, users are required to enter some personal data such as address, city of residence, district, sub-district and output.",
  },
  {
    id: 11,
    image: IMG11,
    title: "Shipping Address Page",
    description:
      "After entering the address, there will be a submit button and a description of the product to be ordered. If the information displayed is correct, the user can proceed to the payment process.",
  },
  {
    id: 12,
    image: IMG12,
    title: "Invoices page",
    description: "The invoice page contains transaction details",
  },
  {
    id: 13,
    image: IMG13,
    title: "Transaction History page",
    description: "If so, it will automatically direct to the transaction history",
  },
  {
    id: 14,
    image: IMG14,
    title: "Address Information Page",
    description: "This page contains detailed user address information",
  },
  {
    id: 15,
    image: IMG15,
    title: "Account Information Page",
    description: "This page contains user account information",
  },
];

const Detail = () => {
  return (
    <div className="container container-detailproject">
      <div className="detailproject_header">
        <h2>Website E-commerce</h2>
        <h5>MongoDB || Express JS || Node JS || React JS</h5>

        <p>
          This e-commerce website was created by applying MERN technology,
          namely React JS for frontend, redux for state management, Node JS and
          Express JS for backend and MongoDB as a database. The access rights
          applied in this e-commerce website are divided into 2 roles, namely as
          admin and user. While users have very limited access rights because
          there are some website features that can only be accessed if they are
          logged in (user role). The features in this e-commerce website will be
          explained in detail as follows.
        </p>
      </div>

      <div className="detailproject_content">
        {data.map(({ id, image, title, description }) => {
          return (
            <article key={id} className="content_item">
              <h3>{title}</h3>
              <div className="content_item-image">
                <img src={image} alt={title} />
              </div>
              <p>{description}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Detail;
