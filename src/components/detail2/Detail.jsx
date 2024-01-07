import React from "react";
import "./detail.css";
import IMG1 from "../../assets/det1.png";
import IMG2 from "../../assets/det2.png";
import IMG3 from "../../assets/det3.png";
import IMG4 from "../../assets/det4.png";
import IMG5 from "../../assets/det5.png";
import IMG6 from "../../assets/det6.png";
import IMG7 from "../../assets/det7.png";
import IMG8 from "../../assets/det8.png";
import IMG9 from "../../assets/det9.png";
import IMG10 from "../../assets/det10.png";
import IMG11 from "../../assets/det11.png";

const data = [
  {
    id: 1,
    image: IMG1,
    title: "Home Page",
    description:
      "The Home page contains several examples of products available on the e-commerce website.",
  },
  {
    id: 2,
    image: IMG2,
    title: "Latest Product Page",
    description:
      "This page contains some of the latest products available on the e-commerce website.",
  },
  {
    id: 3,
    image: IMG3,
    title: "Header Page",
    description:
      "On the Header page there is a product menu to display all products available on the ecommerce website, search to find the desired product.",
  },
  {
    id: 4,
    image: IMG4,
    title: "Category Page",
    description:
      "This category page contains all products that can be accessed by all roles. At the top there is a filter that is useful for filtering categories based on product name.",
  },
  {
    id: 5,
    image: IMG5,
    title: "Product Detail Page",
    description:
      "The Product Detail page contains information on each product in the form of name, price, and description. This page also directly provides features for purchasing products via WhatsApp.",
  },
  {
    id: 6,
    image: IMG6,
    title: "Login Page",
    description:
      "The login page can only be accessed by the admin. When logging in, the admin must enter the email and password that has been registered previously.",
  },
  {
    id: 7,
    image: IMG7,
    title: "Dashboard Page -- Admin",
    description:
      "This dashboard page can only be accessed by the admin role. This dashboard page serves to facilitate the admin in managing the e-commerce website which consists of access to manage products.",
  },
  {
    id: 8,
    image: IMG8,
    title: "Profile Page",
    description:
      "This profile page serves to change data and change the admin password.",
  },
  {
    id: 9,
    image: IMG9,
    title: "Category Data Page",
    description:
      "This page serves to add, change and delete data based on categories",
  },
  {
    id: 10,
    image: IMG10,
    title: "Product Data Page",
    description:
      "This page serves to manage product data adding, deleting and changing data",
  },
  {
    id: 11,
    image: IMG11,
    title: "Product Data Page",
    description: "Display of Add product data page",
  },
];

const Detail = () => {
  return (
    <div className="container container-detailproject">
      <div className="detailproject_header">
        <h2>Website E-commerce</h2>
        <h5>MySQL || PHP 7 || HTML || CSS </h5>

        <p>
          This e-commerce website is made by applying HTML and CSS technology as
          a frontend, PHP for the backend, Web server using XAMPP, and MySQL as
          a database. frontend, PHP for backend, Web server using XAMPP, and
          MySQL as a database. Access rights that applied in this e-commerce
          website are divided into 2 roles, namely admin as a seller and user as
          a buyer. The features in this e-commerce website will be explained in
          detail as follows This e-commerce website will be explained in detail
          as follows.
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
