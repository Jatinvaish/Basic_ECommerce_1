import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>ECOMMERCE.</h1>
        <p>High Quality is our first priority</p>

        <p className="copRight">Copyrights 2021 &copy;  <a  href="http://instagram.com/jatin_vaishnav__2003">JaiminChauhan</a></p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="http://instagram.com/jatin_vaishnav__2003">Instagram</a>
        <a href="https://www.youtube.com/@SoftwareTechnology1719">Youtube</a>
        <a href="https://github.com/Jatinvaish/">GitHub</a>
      </div>
    </footer>
  );
};

export default Footer;
