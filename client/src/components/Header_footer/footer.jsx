import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation(); // Get the current location

  return (
    <footer className="">
      <div>
        <h4>Intac Connect</h4>
      </div>
    </footer>
  );
};

export default Footer;
