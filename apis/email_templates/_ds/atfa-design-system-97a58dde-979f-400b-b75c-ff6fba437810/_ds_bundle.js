/* @ds-bundle: {"format":3,"namespace":"ATFADesignSystem_97a58d","components":[],"sourceHashes":{"ui_kits/marketing/Chrome.jsx":"74282f626e96","ui_kits/marketing/Screens.jsx":"105ea6a177b0"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ATFADesignSystem_97a58d = window.ATFADesignSystem_97a58d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/marketing/Chrome.jsx
try { (() => {
// Shared bits of the ATFA marketing UI kit.
// Depends on React 18 loaded globally. Exports to window for cross-script use.

const AtfaLogo = ({
  inverse = false,
  size = 22
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: 'Raleway',
    fontWeight: 700,
    fontSize: size,
    letterSpacing: '0.24em',
    color: inverse ? '#FBF8F8' : '#000'
  }
}, "ATFA", /*#__PURE__*/React.createElement("span", {
  style: {
    display: 'inline-block',
    width: size * 0.42,
    height: size * 0.42,
    borderRadius: '50%',
    background: '#DB522E'
  }
}));
const Eyebrow = ({
  children,
  style
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: 'Raleway',
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '0.5em',
    textTransform: 'uppercase',
    color: '#000',
    ...style
  }
}, children);
const Button = ({
  children,
  variant = 'primary',
  onClick,
  style
}) => {
  const base = {
    fontFamily: 'Raleway',
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    padding: '14px 26px',
    border: 0,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.2,0,0,1)',
    borderRadius: 2
  };
  const variants = {
    primary: {
      background: '#DB522E',
      color: '#FBF8F8'
    },
    secondary: {
      background: '#000',
      color: '#FBF8F8'
    },
    ghost: {
      background: 'transparent',
      color: '#000',
      border: '1px solid #000'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onClick: onClick,
    onMouseEnter: e => e.target.style.opacity = 0.82,
    onMouseLeave: e => e.target.style.opacity = 1
  }, children);
};
const Navbar = ({
  current,
  onNav
}) => {
  const links = ['Residencies', 'Salons', 'Exhibitions', 'Interviews', 'Editions'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '26px 52px',
      borderBottom: '1px solid #000',
      background: '#FBF8F8'
    }
  }, /*#__PURE__*/React.createElement(AtfaLogo, null), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 32
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    onClick: () => onNav(l),
    style: {
      cursor: 'pointer',
      fontFamily: 'Raleway',
      fontSize: 12,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#000',
      fontWeight: current === l ? 700 : 500,
      position: 'relative',
      borderBottom: 0
    }
  }, l, current === l && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      bottom: -10,
      transform: 'translateX(-50%)',
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#DB522E'
    }
  })))), /*#__PURE__*/React.createElement("a", {
    style: {
      fontFamily: 'Raleway',
      fontSize: 12,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      fontWeight: 700,
      color: '#000',
      cursor: 'pointer',
      borderBottom: 0
    }
  }, "Enquire \u2192"));
};
const Footer = () => /*#__PURE__*/React.createElement("footer", {
  style: {
    background: '#000',
    color: '#FBF8F8',
    padding: '60px 52px 40px'
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: 40,
    paddingBottom: 40,
    borderBottom: '1px solid rgba(251,248,248,0.12)'
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AtfaLogo, {
  inverse: true,
  size: 32
}), /*#__PURE__*/React.createElement("p", {
  style: {
    marginTop: 18,
    fontFamily: 'Raleway',
    fontSize: 14,
    lineHeight: 1.6,
    letterSpacing: '-0.02em',
    color: '#FBF8F8',
    opacity: 0.75,
    maxWidth: 340
  }
}, "Discovery and Development of African based art and design, one step at a time.")), [{
  h: 'Programs',
  items: ['Residencies', 'Salons', 'Exhibitions', 'Interviews', 'Editions']
}, {
  h: 'Studio',
  items: ['About', 'Artists', 'Press', 'Contact']
}, {
  h: 'Cities',
  items: ['Lagos', 'New York', 'Chicago']
}].map(c => /*#__PURE__*/React.createElement("div", {
  key: c.h
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: 'Raleway',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    color: '#FBC9B4',
    marginBottom: 14
  }
}, c.h), c.items.map(i => /*#__PURE__*/React.createElement("div", {
  key: i,
  style: {
    fontFamily: 'Raleway',
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
    cursor: 'pointer'
  }
}, i))))), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 26,
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    opacity: 0.6
  }
}, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 A Thing For Art"), /*#__PURE__*/React.createElement("span", null, "Every wall should hold a work of art.")));
Object.assign(window, {
  AtfaLogo,
  Eyebrow,
  Button,
  Navbar,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Screens.jsx
try { (() => {
// ATFA marketing screens: Home, Artists, Salons, Contact.

const Hero = () => /*#__PURE__*/React.createElement("section", {
  style: {
    position: 'relative',
    padding: '110px 52px 130px',
    background: '#FBF8F8',
    overflow: 'hidden'
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: 'absolute',
    inset: 0,
    background: 'url(../../assets/patterns/swirl.svg) center/1600px auto no-repeat',
    opacity: 0.05,
    pointerEvents: 'none'
  }
}), /*#__PURE__*/React.createElement(Eyebrow, null, "Lagos \xB7 New York \xB7 Chicago"), /*#__PURE__*/React.createElement("h1", {
  style: {
    fontFamily: 'Raleway',
    fontWeight: 900,
    fontSize: 112,
    lineHeight: 0.96,
    letterSpacing: '-0.05em',
    margin: '28px 0 0',
    maxWidth: 1100,
    position: 'relative'
  }
}, "Every wall should", /*#__PURE__*/React.createElement("br", null), "hold a work of art", /*#__PURE__*/React.createElement("span", {
  style: {
    color: '#DB522E'
  }
}, ".")), /*#__PURE__*/React.createElement("p", {
  style: {
    fontFamily: 'Raleway',
    fontSize: 20,
    lineHeight: 1.5,
    letterSpacing: '-0.02em',
    maxWidth: 560,
    marginTop: 32
  }
}, "A Thing For Art is obsessed with the discovery, development, and distribution of African art \u2014 through residencies, salons, exhibitions, interviews, and editions."), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    gap: 12,
    marginTop: 40
  }
}, /*#__PURE__*/React.createElement(Button, {
  variant: "primary"
}, "View Collection"), /*#__PURE__*/React.createElement(Button, {
  variant: "ghost"
}, "Book a Salon")));
const FeaturedWorks = () => {
  const works = [{
    title: 'Sunrise over Agege',
    artist: 'Azeez Adekola',
    tag: 'Oil on linen · 2025',
    bg: 'linear-gradient(135deg,#752712,#DB522E)'
  }, {
    title: 'Pitch at Midnight',
    artist: 'Gerry Nnubia',
    tag: 'Mixed media · 2024',
    bg: 'linear-gradient(135deg,#1A2229,#4C4C4C)'
  }, {
    title: 'Compound No. 7',
    artist: 'Ada Okonkwo',
    tag: 'Acrylic · 2026',
    bg: 'linear-gradient(135deg,#AD4327,#FBC9B4)'
  }, {
    title: 'After the Harmattan',
    artist: 'Femi Bankole',
    tag: 'Ink on paper · 2025',
    bg: 'linear-gradient(135deg,#000,#752712)'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 52px',
      background: '#FBF8F8',
      borderTop: '1px solid #000'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      color: '#DB522E'
    }
  }, "Editions \u2014 Spring 2026"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'Raleway',
      fontWeight: 700,
      fontSize: 52,
      letterSpacing: '-0.04em',
      marginTop: 14
    }
  }, "Currently on the wall")), /*#__PURE__*/React.createElement("a", {
    style: {
      fontFamily: 'Raleway',
      fontSize: 13,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      fontWeight: 700,
      color: '#000',
      cursor: 'pointer'
    }
  }, "All 214 works \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 28
    }
  }, works.map(w => /*#__PURE__*/React.createElement("div", {
    key: w.title,
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4/5',
      background: w.bg,
      boxShadow: '0 4px 16px rgba(67,24,13,0.22)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'url(../../assets/patterns/swirl.svg) center/cover',
      opacity: 0.14,
      mixBlendMode: 'overlay'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#5E5A5A',
      fontWeight: 700
    }
  }, w.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Raleway',
      fontWeight: 700,
      fontSize: 18,
      marginTop: 4,
      letterSpacing: '-0.03em'
    }
  }, w.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Raleway',
      fontSize: 14,
      color: '#000',
      marginTop: 2
    }
  }, w.artist))))));
};
const ProgramsBand = ({
  onNav
}) => {
  const progs = [{
    n: '01',
    name: 'Residencies',
    blurb: 'Studio time for emerging African practitioners.'
  }, {
    n: '02',
    name: 'Salons',
    blurb: 'Private rooms for galleries, collectors, critics.'
  }, {
    n: '03',
    name: 'Exhibitions',
    blurb: 'Architecture-forward public presentations.'
  }, {
    n: '04',
    name: 'Interviews',
    blurb: 'Long-form editorial over months, not minutes.'
  }, {
    n: '05',
    name: 'Editions',
    blurb: 'Prints, monographs, limited objects — .art imprint.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: '#000',
      color: '#FBF8F8',
      padding: '90px 52px'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      color: '#FBC9B4'
    }
  }, "Five Arms \xB7 One Objective"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'Raleway',
      fontWeight: 700,
      fontSize: 64,
      letterSpacing: '-0.05em',
      lineHeight: 1,
      marginTop: 16,
      maxWidth: 900
    }
  }, "Five ways we carry work into the world", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#DB522E'
    }
  }, ".")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5,1fr)',
      gap: 24,
      marginTop: 60
    }
  }, progs.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.n,
    onClick: () => onNav(p.name),
    style: {
      cursor: 'pointer',
      borderTop: '1px solid rgba(251,248,248,0.25)',
      paddingTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Raleway',
      fontSize: 12,
      letterSpacing: '0.22em',
      color: '#DB522E',
      fontWeight: 700
    }
  }, p.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Raleway',
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      marginTop: 10
    }
  }, p.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'Raleway',
      fontSize: 13,
      lineHeight: 1.5,
      opacity: 0.78,
      marginTop: 10
    }
  }, p.blurb)))));
};
const VoiceBand = () => /*#__PURE__*/React.createElement("section", {
  style: {
    background: '#FBC9B4',
    padding: '110px 52px',
    textAlign: 'center'
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1000,
    margin: '0 auto'
  }
}, /*#__PURE__*/React.createElement(Eyebrow, null, "Brand Voice"), /*#__PURE__*/React.createElement("blockquote", {
  style: {
    fontFamily: 'Raleway',
    fontWeight: 700,
    fontSize: 56,
    letterSpacing: '-0.05em',
    lineHeight: 1.1,
    margin: '26px 0 0'
  }
}, "\"We make cultural value ", /*#__PURE__*/React.createElement("em", {
  style: {
    color: '#752712',
    fontWeight: 500
  }
}, "legible, trackable,"), " and discussable", /*#__PURE__*/React.createElement("span", {
  style: {
    color: '#DB522E'
  }
}, ".\"")), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: 'Raleway',
    fontSize: 14,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    fontWeight: 700,
    marginTop: 36,
    opacity: 0.7
  }
}, "The narrator \u2014 not the appraiser.")));

// ── Artists index screen ────────────────────────────────
const ArtistsScreen = () => {
  const artists = [{
    name: 'Azeez Adekola',
    city: 'Lagos',
    medium: 'Painting',
    count: 14
  }, {
    name: 'Gerry Nnubia',
    city: 'Abuja',
    medium: 'Mixed Media',
    count: 8
  }, {
    name: 'Ada Okonkwo',
    city: 'New York',
    medium: 'Painting',
    count: 21
  }, {
    name: 'Femi Bankole',
    city: 'Lagos',
    medium: 'Drawing',
    count: 6
  }, {
    name: 'Nkiru Salako',
    city: 'Chicago',
    medium: 'Sculpture',
    count: 4
  }, {
    name: 'Obinna Udeh',
    city: 'Lagos',
    medium: 'Photography',
    count: 33
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '60px 52px',
      background: '#FBF8F8'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Artists \xB7 48 represented"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'Raleway',
      fontWeight: 700,
      fontSize: 88,
      letterSpacing: '-0.05em',
      margin: '18px 0 40px'
    }
  }, "Index."), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid #000'
    }
  }, ['Artist', 'City', 'Medium', 'Works', 'Enquire'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: 'left',
      padding: '16px 0',
      fontFamily: 'Raleway',
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      fontWeight: 700
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, artists.map(a => /*#__PURE__*/React.createElement("tr", {
    key: a.name,
    style: {
      borderBottom: '1px solid rgba(0,0,0,0.12)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '22px 0',
      fontFamily: 'Raleway',
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '-0.03em'
    }
  }, a.name), /*#__PURE__*/React.createElement("td", {
    style: {
      fontFamily: 'Raleway',
      fontSize: 15
    }
  }, a.city), /*#__PURE__*/React.createElement("td", {
    style: {
      fontFamily: 'Raleway',
      fontSize: 15
    }
  }, a.medium), /*#__PURE__*/React.createElement("td", {
    style: {
      fontFamily: 'Raleway',
      fontSize: 15,
      fontVariantNumeric: 'tabular-nums'
    }
  }, a.count), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'Raleway',
      fontSize: 12,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "View", /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#DB522E'
    }
  }))))))));
};

// ── Salons screen (event listing) ───────────────────────
const SalonsScreen = () => {
  const events = [{
    d: '14',
    m: 'JUN',
    yr: '2026',
    city: 'Lagos',
    title: 'Private Viewing — Adekola Residency',
    guests: '24 seats · by invitation'
  }, {
    d: '02',
    m: 'JUL',
    yr: '2026',
    city: 'New York',
    title: 'Editions Launch — Okonkwo Monograph',
    guests: '60 seats · RSVP'
  }, {
    d: '19',
    m: 'SEP',
    yr: '2026',
    city: 'Chicago',
    title: 'Critics Round — On African Abstraction',
    guests: '12 seats · closed'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '60px 52px',
      background: '#FBF8F8'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Salons \xB7 Upcoming"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'Raleway',
      fontWeight: 700,
      fontSize: 88,
      letterSpacing: '-0.05em',
      margin: '18px 0 40px'
    }
  }, "Come sit with the work."), events.map(e => /*#__PURE__*/React.createElement("article", {
    key: e.title,
    style: {
      display: 'grid',
      gridTemplateColumns: '160px 1fr auto',
      alignItems: 'center',
      gap: 40,
      padding: '30px 0',
      borderTop: '1px solid #000'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Raleway',
      fontWeight: 900,
      fontSize: 56,
      lineHeight: 1,
      letterSpacing: '-0.05em'
    }
  }, e.d), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Raleway',
      fontSize: 13,
      letterSpacing: '0.32em',
      textTransform: 'uppercase',
      fontWeight: 700,
      marginTop: 4
    }
  }, e.m, " ", e.yr)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Raleway',
      fontSize: 12,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      fontWeight: 700,
      color: '#DB522E'
    }
  }, e.city), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Raleway',
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: '-0.03em',
      marginTop: 6
    }
  }, e.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Raleway',
      fontSize: 14,
      color: '#5E5A5A',
      marginTop: 4
    }
  }, e.guests)), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Request Seat"))));
};

// ── Contact / enquire screen ────────────────────────────
const ContactScreen = () => {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '60px 52px',
      background: '#FBF8F8',
      minHeight: 600
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Enquire"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'Raleway',
      fontWeight: 700,
      fontSize: 72,
      letterSpacing: '-0.05em',
      margin: '18px 0 20px',
      lineHeight: 1
    }
  }, "Start a conversation", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#DB522E'
    }
  }, ".")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'Raleway',
      fontSize: 18,
      lineHeight: 1.5,
      letterSpacing: '-0.02em',
      maxWidth: 440
    }
  }, "Whether you're a gallery, a collector, or an artist seeking a residency \u2014 we'd like to hear from you."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      fontFamily: 'Raleway',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      fontWeight: 700,
      color: '#5E5A5A'
    }
  }, "Direct"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, "hello@athingforart.com"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      fontWeight: 700,
      color: '#5E5A5A'
    }
  }, "Studios"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, "Lagos \xB7 New York \xB7 Chicago"))), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, [['Name', 'Ada Okonkwo'], ['Email', 'you@studio.com'], ['Subject', 'Residency — Lagos 2026']].map(([l, ph]) => /*#__PURE__*/React.createElement("label", {
    key: l,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      fontWeight: 700
    }
  }, l), /*#__PURE__*/React.createElement("input", {
    placeholder: ph,
    required: true,
    style: {
      fontFamily: 'Raleway',
      fontSize: 16,
      padding: '14px 0',
      background: 'transparent',
      border: 0,
      borderBottom: '1px solid #000',
      outline: 'none'
    }
  }))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      fontWeight: 700
    }
  }, "Message"), /*#__PURE__*/React.createElement("textarea", {
    rows: 4,
    placeholder: "Tell us about the work\u2026",
    required: true,
    style: {
      fontFamily: 'Raleway',
      fontSize: 16,
      padding: '14px 0',
      background: 'transparent',
      border: 0,
      borderBottom: '1px solid #000',
      outline: 'none',
      resize: 'vertical'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Raleway',
      fontSize: 12,
      color: '#5E5A5A'
    }
  }, sent ? 'Thank you — we will reply within 3 working days.' : 'We reply within 3 working days.'), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, sent ? 'Sent' : 'Send Enquiry')))));
};
Object.assign(window, {
  Hero,
  FeaturedWorks,
  ProgramsBand,
  VoiceBand,
  ArtistsScreen,
  SalonsScreen,
  ContactScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Screens.jsx", error: String((e && e.message) || e) }); }

})();
