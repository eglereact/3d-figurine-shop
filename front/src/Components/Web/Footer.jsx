import { CiInstagram } from "react-icons/ci";
import { CiFacebook } from "react-icons/ci";
import * as l from "../../Constants/urls";

const Footer = () => {
  return (
    <footer className="bg-grey w-full mt-10 text-white">
      <section className="max-width">
        <div className="flex flex-col sm:flex-row justify-between pt-6 px-6">
          <div className="flex gap-28">
            <ul className="flex flex-col gap-2">
              <li className="uppercase text-2xl mb-2">Shop</li>
              <li className="footer-links">
                <a href={l.SITE_HOME}>Home</a>
              </li>
              <li className="footer-links">
                <a href={l.SITE_PRODUCTS}>Products</a>
              </li>
              <li className="footer-links">
                <a href="/#">Blog</a>
              </li>
              <li className="footer-links">
                <a href={l.SALE_PAGE}>Sale</a>
              </li>
            </ul>
            <ul className="flex flex-col gap-2">
              <li className="uppercase text-2xl mb-2">Navigate</li>
              <li className="footer-links">
                <a href="/#">Search</a>
              </li>
              <li className="footer-links">
                <a href="/#">FAQ</a>
              </li>
              <li className="footer-links">
                <a href="/#">Gifts </a>
              </li>
              <li className="footer-links">
                <a href="/#">Contacts</a>
              </li>
            </ul>
          </div>
          <div className="mt-6 sm:mt-0">
            <h2 className="uppercase text-2xl mb-2">Need help?</h2>
            <p>support@dndminiatureshop.com</p>
            <p>(555) 555-5555</p>
            <p>1 Park Ave, Kaunas</p>
            <div className="flex gap-2 text-4xl mt-2 ">
              <CiInstagram className="cursor-pointer hover:scale-105 transition duration-200 ease-in" />
              <CiFacebook className="cursor-pointer hover:scale-105 transition duration-200 ease-in" />
            </div>
          </div>
        </div>
        <div
          className="py-6 flex justify-center"
          data-aos="fade-up"
          data-aos-once={true}
        >
          <img src="/images/logo2.png" alt="logo" className="w-72" />
        </div>
        <p className="text-center py-2 text-sm uppercase">
          © {new Date().getFullYear()} DND miniature shop.
        </p>
      </section>
    </footer>
  );
};
export default Footer;
