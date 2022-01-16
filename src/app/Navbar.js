import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <section>
      {/* <h1>Redux Essentials</h1> */}

      <div className="navContent">
        <div className="navLinks"></div>
        <Link to="/">Posts</Link>
      </div>
    </section>
  </nav>
);

export default Navbar;
