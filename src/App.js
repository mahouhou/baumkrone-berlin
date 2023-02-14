import { useState, useEffect } from "react";
import './css/App.css';
import { ReactComponent as Logo } from './images/baumkrone-logo-bg.svg';
import Calendar from './Calendar';
import Copy from './Copy';
import Impressum from './Impressum';

function App() {
  // Today's saxon month
  const [today, setToday] = useState(0);
  // Impressum component hidden by default
  const [impressum, setImpressum] = useState(false);
  // Mobile menu closed by default
  const [menuOpen, setMenuOpen] = useState(false);
  // Width of body in px
  const [width, setWidth] = useState(undefined);

  // Variables used by startTouch and moveTouch event handlers
  var initialX = null;
  var initialY = null;
  // Variable used by handleResize and handleMenu functions
  var nav = null;

  // Set up event listeners when DOM is ready
  useEffect(() => {
    // Touch event listeners
    const container = document.querySelector(".App");
    container.addEventListener("touchstart", startTouch, false);
    container.addEventListener("touchmove", moveTouch, false);
    // Resize event listener
    window.addEventListener("resize", handleResize);
    // Update width state with current body width
    // in case window isn't ever resized
    const width = document.querySelector("body").offsetWidth;
    setWidth(width);
    // Update today state
    getSaxMon();
  }, []);

    // Get current Saxon month from Calendar component via DOM
    function getSaxMon() {
      const date = document.getElementById("saxon-date").innerHTML;
      const dateArray = date.split(' ');
      const month = dateArray[2];
      setToday(month);
    }

  // Called when user resizes window
  function handleResize() {
    // Update width state every time window is resized
    const body = document.querySelector("body");
    const width = body.offsetWidth;
    setWidth(width)
    nav = document.querySelector("#menu");
    // On desktop:
    if (width > 735) {
      // Reset margins and state
      nav.style.marginLeft = "calc(var(--nav) + var(--padding))";
      setMenuOpen(false);
    // On tablet and mobile:
    } else {
      // Close mobile menu
      nav.style.marginLeft = "100vw";
      setMenuOpen(false);
    }
  }

  // Prevent scrolling while mobile menu is open
  // Runs every time menuOpen state changes
  useEffect(() => {
    const body = document.querySelector("body");
    // Mobile menu is open:
    if (menuOpen && (width < 735)) {
      // Hide overflow
      body.style.overflow = "hidden";
    // Menu is closed or viewing on desktop:
    } else {
      // Set overflow back to auto
      body.style.overflowY = "auto";
    }
  }, [menuOpen])

  // Runs every time menu nav buttons are clicked
  function handleMenu() {
    nav = document.querySelector("#menu");
    // On desktop:
    if (width > 735) {
      // Reset state
      setMenuOpen(false)
    // On Tablet and mobile:
    } else {
      if (menuOpen) {
        // Close menu
        nav.style.marginLeft = "100vw";
        setMenuOpen(false);
      } else {
        // Open menu
        nav.style.marginLeft = "0";
        setMenuOpen(true);
      }
    }
  }

  // Get touch start coordinates
  function startTouch(e) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
  }

  // Calculate direction of touch interaction
  function moveTouch(e) {
    if (initialX === null) {
      return;
    }
    if (initialY === null) {
      return;
    }
    var currentX = e.touches[0].clientX;
    var currentY = e.touches[0].clientY;
    var diffX = initialX - currentX;
    var diffY = initialY - currentY;
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 0) {
        // swiped left
        handleMenu()
      } else {
        // swiped right
        // handleMenu()
        setMenuOpen(false);
        nav = document.querySelector("#menu");
        nav.style.marginLeft = "100vw";
      }  
    } else {
      // sliding vertically
      if (diffY > 0) {
        // swiped up
        console.log("swiped up");
      } else {
        // swiped down
        console.log("swiped down");
      }  
    }
    initialX = null;
    initialY = null;
    e.preventDefault();
  };

  // Set impressum state to show/hide Impressum component
  function showImpressum() {
    setImpressum(true)}
  function hideImpressum() {
    setImpressum(false)}

  // Runs when nav buttons in header and footer are clicked
  const handleClick = (event, source) => {
    if (source === "IMPRESSUM") {
      showImpressum();
    } else {
      hideImpressum();
      handleMenu();
    }
  }

  // Map menuData to construct navigation
  const Menu = menuData.map((li) => (
    <li key={li}>
      <a  onClick={(event) => handleClick(event, {li})} 
          href={`/#${li.split(" ").join("-").toLowerCase()}`}>
        {li}
      </a>
    </li>
  ));

  return (
    <div className="App">
      <header>
        <nav>
          <div id="mob-nav">
            <Logo />
            <button id="toggle" onClick={handleMenu}>
              {menuOpen ?
              <span>&rarr; MENU</span> : <span>&larr; MENU</span> }
            </button>
          </div>
          <ul id="menu">{Menu}</ul>
        </nav>
        <section>  
          <p><span>
            Jeder Baum ist einzigartig!
            Deshalb variieren die Preise für unsere Leistungen-
            je nachdem, wie groß die Aufgabe. Rufen Sie an,
            um einen gratis Beratungstermin auszumachen,
            vor Ort, an ihrem Baum!
          </span></p>
        </section>
      </header>
      <main>
        <section style={impressum ? {display: "none"} : {display: "block"}}>
          <Copy />
        </section>
        <section style={impressum ? {display: "block"} : {display: "none"}}>
          <Impressum />
        </section>
      </main>
      <footer>
        <div className="col">
          <p id="copyright">Urheberrecht &copy; BaumKrone {new Date().getFullYear()}</p>
          <a  href="/#impressum" 
              onClick={(event) => handleClick(event, "IMPRESSUM")}>
              IMPRESSUM 
          </a>
        </div>
        <div className="col">
          {/* <p>This website is seasonal: <a href="#">View on Github</a></p> */}
          <p>Das heutige sächsische Datum: <span id="saxon-date"><Calendar /></span></p>
        </div>
        <div className="col">
          {/* <div id="wcb" className="carbonbadge"></div> */}
          <p>Design von <a href="#">Cascading Styles</a></p>
        </div>
      </footer>
    </div>
  );
}

export default App;

const menuData = [
  "KONTAKT",
  "BAUMPFLEGE",
  "OBSTBAUMPFLEGE",
  "FÄLLUNG UND PFLANZUNG",
  "ÜBER UNS"
]
