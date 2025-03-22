import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useMatch, useLocation, useResolvedPath, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { Navbar, Nav, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faInfoCircle, faReceipt, faSignOutAlt, faBolt, faUser, faMobileAlt, faSignal, faTv, faPlug, faCompass, faShoppingCart, faHeart, faShoppingBag, faCogs, faWallet, faGaugeHigh, faUnlockKeyhole, faUserCheck, faRightLeft, 
  faListCheck, faArrowRightToBracket, faArrowUpFromBracket, 
  faShapes, faBagShopping, faLink, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Context from '../Context';
import { useUserContext } from './UserRoleContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navigation() {
  const [showNav, setShowNav] = useState(false);
  const { user, setUser } = useContext(Context);
  const { userData, currentUser } = useUserContext();
  const location = useLocation();
  const history = useNavigate();

  const [show, setShow] = useState(false);
  // const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);




  const logout = () => {
    const isLogout = window.confirm('Do you want to log out ?');
    if (isLogout) {
      const auth = getAuth();
      signOut(auth)
      .then(() => {
        console.log('User signed out');
        // You can also redirect the user or perform other actions upon sign-out.
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
      // remove local storage.
      localStorage.removeItem('auth');
      // redirect to login page.
      history('/login');
    }
  }
const initializeTooltip = (element) => {
  if (element) {
    const tooltip = new window.bootstrap.Tooltip(element, {
      placement: 'top', // Adjust placement as needed
      title: element.title,
    });
  }
};


  const CustomLink = ({ to, children, ...props }) => {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
      <li className={isActive ? 'active' : ''}>
        <Link to={to} {...props}>
          {children}
        </Link>
      </li>
    );
  };


  
  const menuIconStyle = {
    backgroundColor: 'transparent',
    color: '#262A36',
    padding: '10px',
    borderRadius: '12px',
    fontSize: '24px', // Adjust size as needed
  };


  const getPosition = () => {
    if (window.innerWidth < 576) {
      return { left: "11%", transform: "translate(10%, -50%)" }; // Extra small screens (mobile)
    } else if (window.innerWidth < 768) {
      return { left: "12%", transform: "translate(10%, -50%)" }; // Small screens (larger mobile)
    } else if (window.innerWidth < 992) {
      return { left: "15%", transform: "translate(-50%, -50%)" }; // Medium screens (tablets)
    }
    return { left: "26.5%", transform: "translate(-24%, -50%)" }; // Large screens (desktops)
  };

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/login":
        return "Login";
      case "/signup":
        return "Sign Up";
      case "/withdraw":
        return "Withdraw";
      case "/transactions":
        return "Transactions";
      case "/deposit":
        return "Deposit";
      case "/upload":
        return "Upload NFT";
      case "/mints":
        return "Minted NFTs";
      case "/buy-project":
        return "Buy Project";
      case "/link-wallet":
        return "Link Wallet";
      case "/my-projects":
        return "My Projects";
      case "/profile":
        return "Profile";
      case "/admin":
        return "Admin Panel";
      default:
        return "NFT Broker"; // Default title
    }
  };
  
  

  return (
    <>
    <ToastContainer />
        {showNav && (
        <div className="backdrop"></div>
      )}

      {/* Navbar with toggle button */}
      <Navbar variant="dark" expand="lg" style={{minHeight: '60px'}} className={`scrolled fixed-top shadow-blur  ${location.pathname === '/login' || location.pathname === '/signup' ? 'd-none' : ''}`}>
      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        className='d-lg-none'
        onClick={handleShow}
        style={{
          display: 'flex',
          alignItems: 'center',
          border: 'none', // Remove the border
          boxShadow: 'none', // Remove any box shadow if it's present
        }}
      >
        <FontAwesomeIcon icon={faBars} style={menuIconStyle} />
      </Navbar.Toggle>

        {/* <Navbar.Brand href="#home" style={{ display: 'flex', alignItems: 'center' }}>
          {scrolled ? (
          <>
          G<span style={{color: '#E7772F'}}>o</span> SUBME
          </>
          ):
          (
            <>
            <img src={logo} alt='gosubme_logo' style={logoStyle} />
            </>
          )} 
        </Navbar.Brand> */}
        <h3
          className="text-dark"
          style={{
            position: "absolute",
            top: "50%",
            ...getPosition(), // Dynamically apply styles
          }}
        >
          {getTitle()} {/* Dynamic title based on route */}
        </h3>

      </Navbar>

           {/* Offcanvas for small screens */}
<Offcanvas show={show} onHide={handleClose} placement="start" className={location.pathname === '/login' || location.pathname === '/signup' ? 'd-none' : 'd-lg-none offcanvas'}>
  <Offcanvas.Header className='offcanvas-header'>
    {/* <Offcanvas.Title>G<span style={{color: '#E7772F'}}>o</span> SUBME</Offcanvas.Title> */}
    <img className="img-fluid" src="asdf.PNG" width="60px" height="60px" alt="Logo" />
    <span className="gradient-text">DeepSea</span>
  </Offcanvas.Header>
  <Offcanvas.Body className='offcanvas-body' style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ flexGrow: 1 }}>
    <Nav className="flex-column">
      <Nav.Link as={Link} to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faGaugeHigh} className={`nav-icon ${location.pathname === '/dashboard' ? 'active' : ''}`} />
        Dashboard
      </Nav.Link>
      <Nav.Link as={Link} to="/upload" className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faArrowUpFromBracket} className={`nav-icon ${location.pathname === '/upload' ? 'active' : ''}`} />
        Upload NFT
      </Nav.Link>
      
      <Nav.Link as={Link} to="/mints" className={`nav-link ${location.pathname === '/mints' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faShapes} className={`nav-icon ${location.pathname === '/mints' ? 'active' : ''}`} />
        Minted NFTs
      </Nav.Link>
      <Nav.Link as={Link} to="/deposit" className={`nav-link ${location.pathname === '/deposit' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faArrowRightToBracket} className={`nav-icon ${location.pathname === '/deposit' ? 'active' : ''}`} />
        Deposit
      </Nav.Link>
      <Nav.Link as={Link} to="/withdraw" className={`nav-link ${location.pathname === '/withdraw' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faRightLeft} className={`nav-icon ${location.pathname === '/withdraw' ? 'active' : ''}`} />
        Withdraw
      </Nav.Link>
      <Nav.Link as={Link} to="/buy-project" className={`nav-link ${location.pathname === '/buy-project' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faBagShopping} className={`nav-icon ${location.pathname === '/buy-project' ? 'active' : ''}`} />
        Buy NFT
      </Nav.Link>
      <Nav.Link as={Link} to="/transactions" className={`nav-link ${location.pathname === '/transactions' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faListCheck} className={`nav-icon ${location.pathname === '/transactions' ? 'active' : ''}`} />
        Transaction History
      </Nav.Link>
      <Nav.Link as={Link} to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faUser} className={`nav-icon ${location.pathname === '/profile' ? 'active' : ''}`} />
        Profile
      </Nav.Link>
    </Nav>
    </div>
    <Nav.Link onClick={logout} className="nav-link logout-btn">
      <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
      Logout
    </Nav.Link>
  </Offcanvas.Body>
</Offcanvas>

<div className={`sidebar ${location.pathname === '/login' || location.pathname === '/signup' ? 'd-none' : 'd-none d-lg-block'}`}>
  <Navbar.Brand href="#home" className="offcanvas-header">
    <img className="img-fluid" src="asdf.PNG" width="60px" height="60px" alt="Logo" />
    <span className="gradient-text">DeepSea</span>
  </Navbar.Brand>

  <div style={{ flexGrow: 1 }}>
    <Nav className="flex-column">
    <Nav.Link as={Link} to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faGaugeHigh} className={`nav-icon ${location.pathname === '/dashboard' ? 'active' : ''}`} />
        Dashboard
      </Nav.Link>
      <Nav.Link as={Link} to="/upload" className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faArrowUpFromBracket} className={`nav-icon ${location.pathname === '/upload' ? 'active' : ''}`} />
        Upload NFT
      </Nav.Link>
      
      <Nav.Link as={Link} to="/mints" className={`nav-link ${location.pathname === '/mints' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faShapes} className={`nav-icon ${location.pathname === '/mints' ? 'active' : ''}`} />
        Minted NFTs
      </Nav.Link>
      <Nav.Link as={Link} to="/deposit" className={`nav-link ${location.pathname === '/deposit' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faArrowRightToBracket} className={`nav-icon ${location.pathname === '/deposit' ? 'active' : ''}`} />
        Deposit
      </Nav.Link>
      <Nav.Link as={Link} to="/withdraw" className={`nav-link ${location.pathname === '/withdraw' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faRightLeft} className={`nav-icon ${location.pathname === '/withdraw' ? 'active' : ''}`} />
        Withdraw
      </Nav.Link>
      <Nav.Link as={Link} to="/buy-project" className={`nav-link ${location.pathname === '/buy-project' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faBagShopping} className={`nav-icon ${location.pathname === '/buy-project' ? 'active' : ''}`} />
        Buy NFT
      </Nav.Link>
      <Nav.Link as={Link} to="/transactions" className={`nav-link ${location.pathname === '/transactions' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faListCheck} className={`nav-icon ${location.pathname === '/transactions' ? 'active' : ''}`} />
        Transaction History
      </Nav.Link>
      <Nav.Link as={Link} to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faUser} className={`nav-icon ${location.pathname === '/profile' ? 'active' : ''}`} />
        Profile
      </Nav.Link>
    </Nav>
  </div>

  <Nav.Link onClick={logout} className="nav-link logout-btn">
    <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
    Logout
  </Nav.Link>
</div>

    </>
  );
}

export default Navigation;
