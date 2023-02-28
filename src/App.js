import { useState, useEffect } from "react";
import "./css/App.css";
import Copy from "./Copy";
import Impressum from "./Impressum";
import { ReactComponent as Logo } from "./images/baumkrone-logo-bg.svg";
import { ReactComponent as NewMoon } from "./images/moons/Moon-Phases-01.svg";
import { ReactComponent as WaxCrescent } from "./images/moons/Moon-Phases-02.svg";
import { ReactComponent as FirstQuart } from "./images/moons/Moon-Phases-03.svg";
import { ReactComponent as WaxGibb } from "./images/moons/Moon-Phases-04.svg";
import { ReactComponent as FullMoon } from "./images/moons/Moon-Phases-05.svg";
import { ReactComponent as WaneGibb } from "./images/moons/Moon-Phases-06.svg";
import { ReactComponent as LastQuart } from "./images/moons/Moon-Phases-07.svg";
import { ReactComponent as WaneCrescent } from "./images/moons/Moon-Phases-08.svg";
import { ReactComponent as Pomologen } from "./images/pomologen-01.svg";
// https://github.com/mourner/suncalc

function App() {
  // Today's lunar month
  const [today, setToday] = useState("default");
  // Impressum component hidden by default
  const [impressum, setImpressum] = useState(false);
  // Mobile menu closed by default
  const [menuOpen, setMenuOpen] = useState(false);
  // Width of body in px
  const [width, setWidth] = useState(undefined);
  // Day or night in Berlin
  const [isDay, setIsDay] = useState(true);

  var SunCalc = require("suncalc");
  var timeNow = new Date();

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
    getLunarMonth();
    // Update isDay state
    checkIsDay();
  }, []);

  // Calculate which lunar month today is
  // Months are divided by New Moon
  // Then update today state with lunarMonth value
  function getLunarMonth() {
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    let month = months[timeNow.getMonth()];
    const moonObj = SunCalc.getMoonIllumination(timeNow);
    const moonAngle = moonObj.angle;
    const waxWane = moonAngle >= 0 ? "wanes" : "waxes";
    var lunarMonth = month + "-" + waxWane;
    setToday(lunarMonth);
  }

  // Calculate whether it's day or night in Berlin
  // Set theme based on today state (lunar month) and night/day
  function checkIsDay() {
    const nightBerlin = SunCalc.getTimes(timeNow, 52.520008, 13.404954);
    // const nightBerlin = SunCalc.getTimes(timeNow, 64.73424, 177.5103);
    const nightStarts = Number(nightBerlin.night);
    const nightEnds = Number(nightBerlin.nightEnd);
    const timeNumber = Number(timeNow);
    if (nightEnds <= timeNumber && timeNumber < nightStarts) {
      // Day
      setIsDay(true);
    } else if (timeNumber < nightEnds && nightEnds < nightStarts) {
      // Night
      setIsDay(false);
    } else {
      // Set day
      setIsDay(true);
    }
  }

  // Calculate moon phase and place icon in footer
  function getMoonPhase() {
    const moonObj = SunCalc.getMoonIllumination(timeNow);
    const moonFraction = moonObj.phase;
    if (moonFraction == 0) {
      // New Moon
      return <NewMoon />;
    }
    if (moonFraction > 0 && moonFraction < 0.25) {
      // Waxing Crescent
      return <WaxCrescent />;
    }
    if (moonFraction == 0.25) {
      // First Quarter
      return <FirstQuart />;
    }
    if (moonFraction > 0.25 && moonFraction < 0.5) {
      // Waxing Moon
      return <WaxGibb />;
    }
    if (moonFraction == 0.5) {
      // Full Moon
      return <FullMoon />;
    }
    if (moonFraction > 0.5 && moonFraction < 0.75) {
      // Waning Moon
      return <WaneGibb />;
    }
    if (moonFraction == 0.75) {
      // Last Quarter
      return <LastQuart />;
    }
    if (moonFraction > 0.75 && moonFraction < 1) {
      // Waning Crescent
      return <WaneCrescent />;
    }
  }

  // Called when user resizes window
  function handleResize() {
    // Update width state every time window is resized
    const body = document.querySelector("body");
    const width = body.offsetWidth;
    setWidth(width);
    nav = document.querySelector("#menu");
    // On desktop:
    if (width > 735) {
      // Reset margins and state
      // nav.style.marginLeft = "calc(var(--nav) + var(--padding))";
      nav.style.marginLeft = "var(--nav)";
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
    if (menuOpen && width < 735) {
      // Hide overflow
      body.style.overflow = "hidden";
      // Menu is closed or viewing on desktop:
    } else {
      // Set overflow back to auto
      body.style.overflowY = "auto";
    }
  }, [menuOpen]);

  // Runs every time menu nav buttons are clicked
  function handleMenu() {
    nav = document.querySelector("#menu");
    // On desktop:
    if (width > 735) {
      // Reset state
      setMenuOpen(false);
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
        handleMenu();
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
  }

  // Set impressum state to show/hide Impressum component
  function showImpressum() {
    setImpressum(true);
  }
  function hideImpressum() {
    setImpressum(false);
  }

  // Runs when nav buttons in header and footer are clicked
  const handleClick = (event, source) => {
    if (source === "IMPRESSUM") {
      showImpressum();
    } else {
      hideImpressum();
      handleMenu();
    }
  };

  const handleToggle = () => {
    console.log("toggled");
    setIsDay((prev) => !prev);
  }

  // Map menuData to construct navigation
  const Menu = menuData.map((li) => (
    <li key={li}>
      <a
        onClick={(event) => handleClick(event, { li })}
        href={`/#${li.split(" ").join("-").toLowerCase()}`}
      >
        {li}
      </a>
    </li>
  ));

  return (
    <div className={`App ${today + " " + (isDay ? "day" : "night")}`}>
      <header>
        <nav>
          <div id="mob-nav">
            <Logo />
            <button id="toggle" onClick={handleMenu}>
              {menuOpen ? <span>&rarr; MENU</span> : <span>&larr; MENU</span>}
            </button>
          </div>
          <ul id="menu">
            {Menu}
            <li id="mode">
              <label className="switch">
                <input
                  type="checkbox"
                  onClick={handleToggle}
                />
                <span className="slider"></span>
              </label>
            </li>
          </ul>
        </nav>
        <section>
          <p>
            <span>
              Jeder Baum ist einzigartig! Deshalb variieren die Preise für
              unsere Leistungen- je nachdem, wie groß die Aufgabe. Rufen Sie an,
              um einen gratis Beratungstermin auszumachen, vor Ort, an ihrem
              Baum!
            </span>
          </p>
        </section>
      </header>
      <main>
        <section style={impressum ? { display: "none" } : { display: "block" }}>
          <Copy />
        </section>
        <section style={impressum ? { display: "block" } : { display: "none" }}>
          <Impressum />
        </section>
      </main>
      <footer>
        <div className="col">
          <p id="copyright">
            Urheberrecht &copy; BaumKrone {new Date().getFullYear()}
          </p>
          <a
            href="/#impressum"
            onClick={(event) => handleClick(event, "IMPRESSUM")}
          >
            IMPRESSUM
          </a>
        </div>
        <div className="col">
          <Pomologen />
        </div>
        <div className="col">
          <p>
            Diese Website ist saisonal:{" "}
            <a
              target="_blank"
              href="https://github.com/mahouhou/baumkrone-berlin"
            >
              Auf Github ansehen
            </a>
          </p>
          <p>Heutige Mondphase: {getMoonPhase()}</p>
        </div>
        <div className="col">
          {/* <carbonbadge darkMode={true} /> */}
          <p>
            Design von{" "}
            <a target="_blank" href="https://cascading-styles.com">
              Cascading Styles
            </a>
          </p>
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
  "ÜBER UNS",
];
