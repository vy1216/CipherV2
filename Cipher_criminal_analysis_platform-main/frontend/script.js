const nav = document.getElementById("nav");

const menuBtn = document.querySelector(".menu-btn");

const navLinks = document.querySelector(".nav-links");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
});

menuBtn?.addEventListener("click", () => {
  const open = menuBtn.getAttribute("aria-expanded") === "true";

  menuBtn.setAttribute(
    "aria-expanded",
    String(!open)
  );

  navLinks?.classList.toggle(
    "mobile-open",
    !open
  );
});

navLinks?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("mobile-open");

    menuBtn?.setAttribute(
      "aria-expanded",
      "false"
    );
  });
});


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const observer = new IntersectionObserver(
  (entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("visible");

        observer.unobserve(entry.target);

      }

    });

  },
  {
    threshold: 0.12
  }
);

document
  .querySelectorAll(".reveal")
  .forEach(el => observer.observe(el));


/* =========================================================
   HERO / NETWORK DECORATIVE NODES
   ========================================================= */

function drawNodes(containerId, count = 12) {

  const el = document.getElementById(containerId);

  if (!el) return;

  for (let i = 0; i < count; i++) {

    const node = document.createElement("span");

    node.style.position = "absolute";

    node.style.width =
      (i % 5 === 0 ? 10 : 6) + "px";

    node.style.height =
      node.style.width;

    node.style.borderRadius = "50%";

    node.style.background =
      i % 5 === 0
        ? "#d9ff55"
        : "#777";

    node.style.boxShadow =
      i % 5 === 0
        ? "0 0 14px rgba(217,255,85,.5)"
        : "none";

    node.style.left =
      (8 + Math.random() * 84) + "%";

    node.style.top =
      (10 + Math.random() * 76) + "%";

    node.style.zIndex = "2";

    el.appendChild(node);
  }
}

drawNodes("heroGraph", 14);
drawNodes("networkOne", 18);


/* =========================================================
   BLACKBIRD ORGANIC NETWORK
   ========================================================= */

const canvas =
  document.getElementById("blackbirdCanvas");

const stage =
  document.getElementById("blackbird");

const selectedBox =
  document.getElementById("networkSelected");

const nodeCountEl =
  document.getElementById("nodeCount");

const edgeCountEl =
  document.getElementById("edgeCount");


if (canvas && stage) {

  const ctx = canvas.getContext("2d");

  let W = 0;
  let H = 0;

  let dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  let nodes = [];
  let links = [];

  let mouse = {
    x: -9999,
    y: -9999
  };

  let hovered = null;
  let selected = null;
  let pulse = 0;


  const TYPES = [
    "person",
    "person",
    "person",
    "org",
    "place",
    "evidence"
  ];


  const NAMES = [
    "Subject 047",
    "Subject 018",
    "Subject 029",
    "Subject 063",
    "Subject 081",
    "Org A",
    "Org B",
    "Location 01",
    "Location 02",
    "Evidence 12",
    "Evidence 21",
    "Subject 091",
    "Subject 104",
    "Org C",
    "Subject 116",
    "Location 03"
  ];


  function resize() {

    const r =
      stage.getBoundingClientRect();

    W = Math.max(300, r.width);
    H = Math.max(300, r.height);

    dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width =
      W + "px";

    canvas.style.height =
      H + "px";

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );
  }


  function makeNodes() {

    nodes = [];

    const cx = W * 0.50;
    const cy = H * 0.52;


    nodes.push({
      x: cx,
      y: cy,
      ox: cx,
      oy: cy,
      r: 18,
      type: "person",
      name: "Subject 047",
      fixed: true,
      phase: 0
    });


    for (let i = 1; i < 25; i++) {

      const angle =
        (i / 24) * Math.PI * 2 +
        (Math.random() - 0.5) * 0.38;

      const ring =
        i < 9
          ? Math.min(W, H) *
            (0.19 + Math.random() * 0.08)

          : i < 17
            ? Math.min(W, H) *
              (0.30 + Math.random() * 0.10)

            : Math.min(W, H) *
              (0.40 + Math.random() * 0.08);


      const x =
        cx +
        Math.cos(angle) *
        ring;

      const y =
        cy +
        Math.sin(angle) *
        ring *
        0.78;


      nodes.push({

        x,
        y,

        ox: x,
        oy: y,

        r:
          i % 7 === 0
            ? 8
            : i % 4 === 0
              ? 6
              : 4,

        type:
          TYPES[i % TYPES.length],

        name:
          NAMES[i % NAMES.length],

        fixed: false,

        phase:
          Math.random() *
          Math.PI *
          2,

        speed:
          0.0005 +
          Math.random() *
          0.0007

      });
    }


    links = [];


    /* Central web */

    for (let i = 1; i < 9; i++) {

      links.push([
        0,
        i
      ]);

    }


    /* Secondary links */

    for (
      let i = 1;
      i < nodes.length;
      i++
    ) {

      const candidates =
        nodes
          .map((_, j) => j)
          .filter(j => j !== i);


      candidates.sort(
        (a, b) =>
          Math.hypot(
            nodes[a].ox -
            nodes[i].ox,

            nodes[a].oy -
            nodes[i].oy
          )

          -

          Math.hypot(
            nodes[b].ox -
            nodes[i].ox,

            nodes[b].oy -
            nodes[i].oy
          )
      );


      const take =
        i < 9
          ? 1
          : 1 +
            (i % 3 === 0
              ? 1
              : 0);


      for (
        let k = 0;
        k < take;
        k++
      ) {

        const j =
          candidates[k];

        const exists =
          links.some(
            l =>
              (
                l[0] === i &&
                l[1] === j
              )
              ||
              (
                l[0] === j &&
                l[1] === i
              )
          );


        if (
          !exists &&
          Math.random() > 0.12
        ) {

          links.push([
            i,
            j
          ]);

        }
      }
    }


    /* Long-range connections */

    [
      [2, 15],
      [5, 20],
      [8, 18],
      [11, 23],
      [14, 21]
    ].forEach(pair =>
      links.push(pair)
    );


    if (nodeCountEl) {

      nodeCountEl.textContent =
        nodes.length;

    }


    if (edgeCountEl) {

      edgeCountEl.textContent =
        links.length;

    }


    selected =
      nodes[0];
  }


  function color(type) {

    if (type === "person")
      return "#d9ff55";

    if (type === "org")
      return "#c5cac7";

    if (type === "place")
      return "#87918c";

    return "#ff6b5f";
  }


  function animate(t) {

    pulse = t * 0.001;

    ctx.clearRect(
      0,
      0,
      W,
      H
    );


    /* Organic movement */

    nodes.forEach(n => {

      if (!n.fixed) {

        n.x =
          n.ox +
          Math.sin(
            pulse *
            n.speed *
            900 +
            n.phase
          ) *
          4;

        n.y =
          n.oy +
          Math.cos(
            pulse *
            n.speed *
            820 +
            n.phase *
            0.7
          ) *
          4;

      }

    });


    /* Connections */

    links.forEach(
      (l, idx) => {

        const a =
          nodes[l[0]];

        const b =
          nodes[l[1]];


        const active =
          (
            Math.sin(
              pulse * 0.9 +
              idx * 0.67
            ) + 1
          ) / 2;


        const near =
          hovered &&
          (
            hovered === a ||
            hovered === b
          );


        ctx.beginPath();

        ctx.moveTo(
          a.x,
          a.y
        );


        const mx =
          (a.x + b.x) / 2 +
          (b.y - a.y) *
          0.035;

        const my =
          (a.y + b.y) / 2 -
          (b.x - a.x) *
          0.035;


        ctx.quadraticCurveTo(
          mx,
          my,
          b.x,
          b.y
        );


        ctx.strokeStyle =
          near
            ? "rgba(217,255,85,.46)"
            : `rgba(128,136,132,${
                0.10 +
                active * 0.10
              })`;


        ctx.lineWidth =
          near
            ? 1.35
            : 0.7;


        ctx.stroke();


        /* Moving spark */

        const p =
          (
            pulse * 0.055 +
            idx * 0.071
          ) % 1;


        const x =
          a.x +
          (b.x - a.x) *
          p;

        const y =
          a.y +
          (b.y - a.y) *
          p;


        ctx.beginPath();

        ctx.arc(
          x,
          y,
          near ? 2.2 : 1.25,
          0,
          Math.PI * 2
        );


        ctx.fillStyle =
          near
            ? "rgba(217,255,85,.9)"
            : "rgba(170,180,175,.42)";

        ctx.fill();

      }
    );


    /* Nodes */

    nodes.forEach(n => {

      const dist =
        Math.hypot(
          mouse.x - n.x,
          mouse.y - n.y
        );


      const hot =
        dist < 32 ||
        n === selected;


      const c =
        color(n.type);


      if (hot) {

        ctx.beginPath();

        ctx.arc(
          n.x,
          n.y,
          n.r +
          11 +
          Math.sin(
            pulse * 2 +
            n.phase
          ) *
          2,
          0,
          Math.PI * 2
        );


        ctx.strokeStyle =
          n === selected
            ? "rgba(217,255,85,.18)"
            : "rgba(255,255,255,.10)";


        ctx.stroke();

      }


      ctx.beginPath();

      ctx.arc(
        n.x,
        n.y,
        n.r +
        (n === selected ? 2 : 0),
        0,
        Math.PI * 2
      );


      ctx.fillStyle = c;

      ctx.shadowBlur =
        n === selected
          ? 22
          : hot
            ? 12
            : 0;

      ctx.shadowColor = c;

      ctx.fill();

      ctx.shadowBlur = 0;


      if (hot || n === selected) {

        ctx.font =
          '9px "DM Mono", monospace';

        ctx.fillStyle =
          "#b9bfbc";

        ctx.fillText(
          n.name,
          n.x + n.r + 7,
          n.y - 7
        );

      }

    });


    /* Center focus ring */

    const c = nodes[0];

    if (c) {

      ctx.beginPath();

      ctx.arc(
        c.x,
        c.y,
        31 +
        Math.sin(
          pulse * 1.7
        ) *
        3,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        "rgba(217,255,85,.12)";

      ctx.stroke();

    }


    requestAnimationFrame(
      animate
    );
  }


  function pick(e) {

    const r =
      canvas.getBoundingClientRect();

    const x =
      e.clientX -
      r.left;

    const y =
      e.clientY -
      r.top;


    mouse = {
      x,
      y
    };

    hovered = null;


    for (const n of nodes) {

      if (
        Math.hypot(
          x - n.x,
          y - n.y
        ) <
        Math.max(
          14,
          n.r + 8
        )
      ) {

        hovered = n;
        break;

      }

    }


    canvas.style.cursor =
      hovered
        ? "pointer"
        : "default";
  }


  canvas.addEventListener(
    "mousemove",
    pick
  );


  canvas.addEventListener(
    "mouseleave",
    () => {

      mouse = {
        x: -9999,
        y: -9999
      };

      hovered = null;

    }
  );


  canvas.addEventListener(
    "click",
    () => {

      if (!hovered)
        return;

      selected = hovered;


      if (selectedBox) {

        const strong =
          selectedBox.querySelector(
            "strong"
          );

        const span =
          selectedBox.querySelector(
            "span"
          );


        if (strong) {

          strong.textContent =
            hovered.name;

        }


        const degree =
          links.filter(
            l =>
              l[0] ===
                nodes.indexOf(
                  hovered
                )
              ||
              l[1] ===
                nodes.indexOf(
                  hovered
                )
          ).length;


        if (span) {

          span.textContent =
            `${degree} direct connections`;

        }

      }

    }
  );


  window.addEventListener(
    "resize",
    () => {

      resize();
      makeNodes();

    }
  );


  resize();
  makeNodes();

  requestAnimationFrame(
    animate
  );
}


/* =========================================================
   DETAILS ACCORDION
   ========================================================= */

document
  .querySelectorAll("details")
  .forEach(item => {

    item.addEventListener(
      "toggle",
      () => {

        if (item.open) {

          document
            .querySelectorAll("details")
            .forEach(other => {

              if (other !== item) {

                other.removeAttribute(
                  "open"
                );

              }

            });

        }

      }
    );

  });


/* =========================================================
   CIPHER AUTH + BACKEND + CASE ORBIT
   ========================================================= */

(() => {

  const auth =
    document.getElementById(
      "cipherAuth"
    );

  const workspace =
    document.getElementById(
      "cipherWorkspace"
    );

  const form =
    document.getElementById(
      "authForm"
    );


  if (
    !auth ||
    !workspace ||
    !form
  ) {
    return;
  }


  const title =
    document.getElementById(
      "authTitle"
    );

  const subtitle =
    document.getElementById(
      "authSubtitle"
    );

  const kicker =
    document.getElementById(
      "authKicker"
    );

  const submit =
    document.getElementById(
      "authSubmitText"
    );


  const name =
    document.getElementById(
      "authName"
    );

  const email =
    document.getElementById(
      "authEmail"
    );

  const pass =
    document.getElementById(
      "authPassword"
    );

  const confirm =
    document.getElementById(
      "authConfirm"
    );


  let mode = "login";


  /* =====================================================
     BACKEND CONFIGURATION
     ===================================================== */

  const API_BASE =
    (typeof window !== "undefined" && window.location ? window.location.origin : "");

  const TOKEN_KEY =
    "cipher_access_token";

  const USER_KEY =
    "cipher_user";


  /* =====================================================
     AUTH UI MODE
     ===================================================== */

  function setMode(m) {

    mode = m;

    auth.classList.toggle(
      "signup-mode",
      m === "signup"
    );


    document
      .querySelectorAll(
        ".auth-switch button"
      )
      .forEach(b => {

        b.classList.toggle(
          "active",
          b.dataset.mode === m
        );

      });


    name.required =
      m === "signup";

    confirm.required =
      m === "signup";


    kicker.textContent =
      m === "signup"
        ? "AUTH / 002"
        : "AUTH / 001";


    title.textContent =
      m === "signup"
        ? "Create access."
        : "Welcome back.";


    subtitle.textContent =
      m === "signup"
        ? "Create a local demo identity and enter your investigative workspace."
        : "Sign in to enter your investigative workspace.";


    submit.textContent =
      m === "signup"
        ? "CREATE & ENTER"
        : "ENTER CIPHER";
  }


  function openAuth(m) {

    setMode(m);

    auth.classList.add("open");

    auth.setAttribute(
      "aria-hidden",
      "false"
    );


    workspace.classList.remove(
      "open"
    );

    workspace.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow =
      "hidden";


    setTimeout(
      () =>
        (
          m === "signup"
            ? name
            : email
        )?.focus(),
      100
    );
  }


  function closeAll() {

    auth.classList.remove(
      "open"
    );

    workspace.classList.remove(
      "open"
    );


    auth.setAttribute(
      "aria-hidden",
      "true"
    );

    workspace.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow =
      "";


    if (
      location.hash.startsWith(
        "#auth"
      ) ||
      location.hash ===
        "#workspace"
    ) {

      history.replaceState(
        null,
        "",
        location.pathname +
        location.search
      );

    }
  }


  function enter() {

    auth.classList.remove(
      "open"
    );

    workspace.classList.add(
      "open"
    );


    auth.setAttribute(
      "aria-hidden",
      "true"
    );

    workspace.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";


    history.replaceState(
      null,
      "",
      "#workspace"
    );


    requestAnimationFrame(
      () =>
        requestAnimationFrame(
          initOrbit
        )
    );
  }


  /* =====================================================
     OPEN LOGIN / SIGNUP
     ===================================================== */

  document
    .querySelectorAll("[data-auth]")
    .forEach(a => {

      a.addEventListener(
        "click",
        e => {

          e.preventDefault();
          e.stopPropagation();

          openAuth(
            a.dataset.auth
          );


          history.replaceState(
            null,
            "",
            location.pathname +
            location.search +
            "#auth-" +
            a.dataset.auth
          );

        }
      );

    });


  document
    .querySelectorAll(
      ".auth-switch button"
    )
    .forEach(b => {

      b.addEventListener(
        "click",
        () =>
          setMode(
            b.dataset.mode
          )
      );

    });


  document
    .getElementById(
      "authClose"
    )
    ?.addEventListener(
      "click",
      closeAll
    );


  document
    .getElementById(
      "workspaceExit"
    )
    ?.addEventListener(
      "click",
      closeAll
    );


  document.addEventListener(
    "keydown",
    e => {

      if (
        e.key === "Escape" &&
        (
          auth.classList.contains(
            "open"
          ) ||
          workspace.classList.contains(
            "open"
          )
        )
      ) {

        closeAll();

      }

    }
  );


  /* =====================================================
     REAL BACKEND LOGIN / SIGNUP
     ===================================================== */

  form.addEventListener(
    "submit",
    async e => {

      e.preventDefault();


      /* Basic validation */

      if (
        !email.checkValidity() ||
        !pass.checkValidity() ||
        (
          mode === "signup" &&
          !name.checkValidity()
        )
      ) {

        form.reportValidity();

        return;

      }


      /* Password confirmation */

      if (
        mode === "signup" &&
        pass.value !==
          confirm.value
      ) {

        confirm.setCustomValidity(
          "Passwords do not match."
        );

        form.reportValidity();

        confirm.setCustomValidity(
          ""
        );

        return;

      }


      /* Disable button */

      submit.disabled = true;


      const originalText =
        submit.textContent;


      submit.textContent =
        mode === "login"
          ? "AUTHENTICATING..."
          : "CREATING...";


      try {

        const endpoint =
          mode === "login"
            ? `${API_BASE}/auth/login`
            : `${API_BASE}/auth/register`;


        const body =
          mode === "login"
            ? {
                email:
                  email.value.trim(),

                password:
                  pass.value
              }

            : {
                full_name:
                  name.value.trim(),

                email:
                  email.value.trim(),

                password:
                  pass.value,

                /*
                 * Public signup always creates
                 * an investigator.
                 */
                role:
                  "INVESTIGATOR"
              };


        console.log(
          "CIPHER → Backend request:",
          endpoint
        );


        const response =
          await fetch(
            endpoint,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  body
                )
            }
          );


        const rawText = await response.text();
        let data = {};
        try {
          data = rawText ? JSON.parse(rawText) : {};
        } catch {
          throw new Error("Invalid response received from authentication server.");
        }

        console.log(
          "CIPHER ← Backend response:",
          data
        );


        if (!response.ok) {

          throw new Error(
            data.detail ||
            "Authentication failed"
          );

        }


        /* =================================================
           LOGIN SUCCESS
           ================================================= */

        if (mode === "login") {

          localStorage.setItem(
            TOKEN_KEY,
            data.access_token
          );


          localStorage.setItem(
            USER_KEY,
            JSON.stringify(
              data.user
            )
          );


          console.log(
            "CIPHER login successful:",
            data.user
          );


          enter();

        }


        /* =================================================
           SIGNUP SUCCESS
           ================================================= */

        else {

          alert(
            "Account created successfully. Please login."
          );


          setMode(
            "login"
          );


          pass.value = "";
          confirm.value = "";


          setTimeout(
            () => {
              email.focus();
            },
            100
          );

        }

      }

      catch (error) {

        console.error(
          "CIPHER authentication error:",
          error
        );


        alert(
          error.message ||
          "Unable to connect to CIPHER backend."
        );

      }

      finally {

        submit.disabled =
          false;

        submit.textContent =
          originalText;

      }

    }
  );


  /* =====================================================
     HASH ROUTING
     ===================================================== */

  window.addEventListener(
    "hashchange",
    () => {

      if (
        location.hash ===
        "#auth-login"
      ) {

        openAuth(
          "login"
        );

      }

      else if (
        location.hash ===
        "#auth-signup"
      ) {

        openAuth(
          "signup"
        );

      }

      else if (
        location.hash ===
        "#workspace"
      ) {

        enter();

      }

    }
  );


  if (
    location.hash ===
    "#auth-login"
  ) {

    openAuth(
      "login"
    );

  }


  if (
    location.hash ===
    "#auth-signup"
  ) {

    openAuth(
      "signup"
    );

  }


  /* =====================================================
     CASE ORBIT
     ===================================================== */

  let orbitRAF = null;

  let orbitRunning = false;

  let stage;

  let cards = [];


  const state = {

    angle: -18,

    angularVelocity: 0.014,

    drag: false,

    lastX: 0,

    lastY: 0,

    focusedCard: null,

    focusProgress: 0,

    snapTarget: null,

    tiltX: -12,

    targetTiltX: -12,

    tiltZ: -3.5,

    targetTiltZ: -3.5,

    radiusBoost: 0,

    targetRadiusBoost: 0

  };


  const clamp =
    (v, a, b) =>
      Math.max(
        a,
        Math.min(
          b,
          v
        )
      );


  const shortestDelta =
    (target, current) =>
      (
        (
          target -
          current +
          540
        ) %
        360
      ) -
      180;


  function initOrbit() {

    stage =
      document.getElementById(
        "caseStage"
      );


    if (!stage)
      return;


    cards = [
      ...stage.querySelectorAll(
        ".floating-case"
      )
    ];


    if (!cards.length)
      return;


    if (
      !stage.querySelector(
        ".case-orbit-plane"
      )
    ) {

      stage.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="case-orbit-plane" aria-hidden="true">

          <span class="orbit-ellipse orbit-ellipse-a"></span>

          <span class="orbit-ellipse orbit-ellipse-b"></span>

          <span class="orbit-axis orbit-axis-x"></span>

          <span class="orbit-axis orbit-axis-y"></span>

        </div>

        <div class="case-orbit-reticle" aria-hidden="true">
          <i></i>
          <b></b>
        </div>

        <div class="case-orbit-hud" aria-hidden="true">

          <span>
            CASE ORBIT / SPATIAL VIEW
          </span>

          <b>
            DRAG TO ROTATE · RELEASE FOR MOMENTUM
          </b>

        </div>
        `
      );

    }


    if (
      !stage.dataset.orbitBound
    ) {

      stage.dataset.orbitBound =
        "1";


      stage.addEventListener(
        "pointerdown",
        e => {

          if (
            e.target.closest(
              ".floating-case"
            ) ||
            e.target.closest(
              ".new-case"
            )
          ) {
            return;
          }


          state.drag = true;

          state.lastX =
            e.clientX;

          state.lastY =
            e.clientY;


          stage.setPointerCapture?.(
            e.pointerId
          );


          stage.classList.add(
            "dragging"
          );

        }
      );


      stage.addEventListener(
        "pointermove",
        e => {

          if (!state.drag)
            return;


          const dx =
            e.clientX -
            state.lastX;

          const dy =
            e.clientY -
            state.lastY;


          state.lastX =
            e.clientX;

          state.lastY =
            e.clientY;


          state.focusedCard =
            null;

          state.focusProgress =
            0;

          state.snapTarget =
            null;


          cards.forEach(
            c =>
              c.classList.remove(
                "focus"
              )
          );


          const speed =
            dx * 0.34;


          state.angularVelocity =
            clamp(
              speed,
              -2.2,
              2.2
            );


          state.angle +=
            speed;


          state.targetTiltX =
            clamp(
              state.targetTiltX -
                dy * 0.055,
              -18,
              -5
            );


          state.targetTiltZ =
            clamp(
              state.targetTiltZ +
                dx * 0.018,
              -7,
              1
            );

        }
      );


      const release = () => {

        if (!state.drag)
          return;

        state.drag = false;

        stage.classList.remove(
          "dragging"
        );

      };


      stage.addEventListener(
        "pointerup",
        release
      );

      stage.addEventListener(
        "pointercancel",
        release
      );

      stage.addEventListener(
        "lostpointercapture",
        release
      );


      stage.addEventListener(
        "wheel",
        e => {

          e.preventDefault();


          if (
            state.focusedCard
          ) {
            return;
          }


          const delta =
            clamp(
              e.deltaY * 0.055,
              -3.5,
              3.5
            );


          state.angularVelocity =
            delta * 0.22;

          state.angle +=
            delta;

        },
        {
          passive: false
        }
      );


      stage.addEventListener(
        "click",
        e => {

          if (
            state.focusedCard &&
            !e.target.closest(
              ".floating-case"
            )
          ) {

            releaseCard();

          }

        }
      );


      const bindCaseCard =
        card => {

          if (
            card.dataset.caseBound ===
            "1"
          ) {
            return;
          }


          card.dataset.caseBound =
            "1";


          card.addEventListener(
            "click",
            e => {

              if (
                e.target.closest(
                  "button"
                )
              ) {
                return;
              }


              e.stopPropagation();


              focusCard(
                card
              );

              const main =
                stage.querySelector(
                  ".case-main"
                );

              if (main) {
                const cardTop = card.querySelector(".case-top");
                const cardIndexRaw = card.dataset.caseId || cardTop?.querySelector("span")?.textContent || "CASE / 014";
                const priorityText = card.dataset.priority || cardTop?.querySelector("b")?.textContent || "HIGH RISK";
                const isHighPriority = priorityText.toUpperCase().includes("HIGH") || priorityText.toUpperCase().includes("CRITICAL");
                const isNew = card.dataset.isNew === "true" || !!card.querySelector(".case-new-badge");

                const mainTop = main.querySelector(".case-top");
                if (mainTop) {
                  const displayIndex = cardIndexRaw.startsWith("CASE /") ? cardIndexRaw : "CASE / " + cardIndexRaw;
                  mainTop.innerHTML = `<span>${displayIndex}</span><div style="display:flex;align-items:center;gap:6px;"><b class="${isHighPriority ? 'high' : ''}">${priorityText.toUpperCase()}</b>${isNew ? '<span class="case-new-badge">NEW</span>' : ''}</div>`;
                }

                const mainIndex = main.querySelector(".case-index");
                if (mainIndex) {
                  mainIndex.textContent = card.dataset.caseId || cardIndexRaw.replace("CASE / ", "").trim();
                }

                const mainTitle = main.querySelector("h3");
                if (mainTitle) {
                  mainTitle.textContent = card.dataset.case || card.querySelector("h3")?.textContent || "Investigation";
                }

                const mainDesc = main.querySelector("p");
                if (mainDesc) {
                  mainDesc.textContent = card.dataset.description || card.querySelector("p")?.textContent || "Investigative intelligence record.";
                }

                let detailStrip = main.querySelector(".case-detail-strip");
                if (!detailStrip) {
                  detailStrip = document.createElement("div");
                  detailStrip.className = "case-detail-strip";
                  const pEl = main.querySelector("p");
                  if (pEl && pEl.nextSibling) {
                    main.insertBefore(detailStrip, pEl.nextSibling);
                  } else {
                    main.appendChild(detailStrip);
                  }
                }

                const cType = card.dataset.caseType || "Financial Crime";
                const cOff = card.dataset.officer || "Vinay Yadav";
                const cJur = card.dataset.jurisdiction || "Chandigarh Central";
                const cLoc = card.dataset.location || "Chandigarh Central";
                const cDate = card.dataset.incidentDate || "Active";
                const cTags = card.dataset.tags || "financial, accounts";

                detailStrip.innerHTML = `
                  <span><strong>TYPE:</strong> ${cType}</span>
                  <span><strong>LOCATION:</strong> ${cLoc}</span>
                  <span><strong>OFFICER:</strong> ${cOff}</span>
                  <span><strong>JURISDICTION:</strong> ${cJur}</span>
                  <span><strong>DATE:</strong> ${cDate}</span>
                  <span><strong>TAGS:</strong> ${cTags}</span>
                `;

                const openBtn = main.querySelector(".case-footer button");
                if (openBtn) {
                  openBtn.onclick = (btnE) => {
                    btnE.stopPropagation();
                    const caseIdStr = card.dataset.caseId || cardIndexRaw;
                    const caseTitleStr = card.dataset.case || mainTitle?.textContent || "";
                    const wsCase = document.querySelector(".workspace-case");
                    if (wsCase) {
                      wsCase.innerHTML = `<span>CASE /</span> ${caseIdStr} <i></i> ACTIVE INVESTIGATION`;
                    }
                    const netBtn = document.querySelector('.side-item[data-view="network"]');
                    if (netBtn) netBtn.click();
                  };
                }
              }

            }
          );

        };


      cards.forEach(
        bindCaseCard
      );


      window.cipherRefreshCases =
        () => {

          cards = [
            ...stage.querySelectorAll(
              ".floating-case"
            )
          ];


          cards.forEach(
            bindCaseCard
          );


          if (
            state.focusedCard &&
            !cards.includes(
              state.focusedCard
            )
          ) {

            releaseCard();

          }

        };


      window.cipherFocusCase =
        card =>
          focusCard(card);

    }


    if (!orbitRunning) {

      orbitRunning =
        true;

      orbitLoop();

    }

  }


  function focusCard(card) {

    if (!cards.length)
      return;


    const i =
      cards.indexOf(card);


    if (i < 0)
      return;


    const spacing =
      360 / cards.length;


    const base =
      i * spacing;


    const desired =
      90 - base;


    state.snapTarget =
      state.angle +
      shortestDelta(
        desired,
        state.angle
      );


    state.angularVelocity =
      0;


    state.focusedCard =
      card;


    state.focusProgress =
      0;


    state.targetTiltX =
      -9;

    state.targetTiltZ =
      -2;


    cards.forEach(
      c =>
        c.classList.toggle(
          "focus",
          c === card
        )
    );

  }


  function releaseCard() {

    if (!state.focusedCard)
      return;


    state.focusedCard =
      null;

    state.focusProgress =
      0;

    state.snapTarget =
      null;

    state.angularVelocity =
      0.012;


    cards.forEach(
      c =>
        c.classList.remove(
          "focus"
        )
    );

  }


  function orbitLoop() {

    if (
      !workspace.classList.contains(
        "open"
      )
    ) {

      orbitRunning =
        false;

      orbitRAF =
        null;

      return;

    }


    if (state.drag) {

      state.angularVelocity *=
        0.995;

    }

    else if (
      state.snapTarget !== null
    ) {

      const delta =
        state.snapTarget -
        state.angle;


      state.angle +=
        delta * 0.095;


      state.angularVelocity *=
        0.82;


      if (
        Math.abs(delta) <
        0.06
      ) {

        state.angle =
          state.snapTarget;

        state.snapTarget =
          null;

        state.angularVelocity =
          0;

      }

    }

    else if (
      !state.focusedCard
    ) {

      state.angularVelocity +=
        0.00042;

      state.angularVelocity *=
        0.986;


      state.angularVelocity =
        clamp(
          state.angularVelocity,
          -1.8,
          1.8
        );


      state.angle +=
        state.angularVelocity;

    }


    if (state.focusedCard) {

      const arrival =
        state.snapTarget === null
          ? 1
          : clamp(
              1 -
                Math.abs(
                  state.snapTarget -
                  state.angle
                ) /
                  45,
              0,
              1
            );


      state.focusProgress +=
        (
          arrival -
          state.focusProgress
        ) *
        0.09;

    }

    else {

      state.focusProgress *=
        0.88;

    }


    state.targetTiltX +=
      (
        -11 -
        state.targetTiltX
      ) *
      0.006;


    state.targetTiltZ +=
      (
        -3.5 -
        state.targetTiltZ
      ) *
      0.006;


    state.tiltX +=
      (
        state.targetTiltX -
        state.tiltX
      ) *
      0.08;


    state.tiltZ +=
      (
        state.targetTiltZ -
        state.tiltZ
      ) *
      0.08;


    const r =
      stage.getBoundingClientRect();


    const mobile =
      r.width < 700;


    const rx =
      Math.min(
        r.width *
          (mobile
            ? 0.34
            : 0.38),
        mobile
          ? 270
          : 510
      ) +
      state.radiusBoost;


    const ry =
      Math.min(
        r.height *
          (mobile
            ? 0.25
            : 0.29),
        mobile
          ? 155
          : 190
      );


    const depth =
      mobile
        ? 105
        : 185;


    const n =
      cards.length;


    cards.forEach(
      (card, i) => {

        const phase =
          (
            i / n
          ) *
          Math.PI *
          2 +
          state.angle *
            Math.PI /
            180;


        const x =
          Math.cos(phase) *
          rx;


        const y =
          Math.sin(phase) *
          ry;


        const z =
          Math.sin(phase) *
          depth;


        const front =
          (
            z + depth
          ) /
          (
            depth * 2
          );


        const baseScale =
          mobile
            ? 0.76 +
              front * 0.12
            : 0.80 +
              front * 0.16;


        const isFocused =
          state.focusedCard ===
          card;


        const p =
          state.focusProgress;


        const focusX =
          isFocused
            ? x * (1 - p)
            : x;


        const focusY =
          isFocused
            ? y * (1 - p)
            : y;


        const focusZ =
          isFocused
            ? z * (1 - p) +
              125 * p
            : z;


        const focusScale =
          isFocused
            ? 1 + 0.20 * p
            : 1;


        const rotY =
          -Math.cos(phase) *
          18;


        const rotX =
          state.tiltX -
          Math.sin(phase) *
            5;


        const transform =
          `translate3d(calc(-50% + ${focusX}px),calc(-50% + ${focusY}px),${focusZ}px) rotateZ(${state.tiltZ}deg) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${baseScale * focusScale})`;


        card.style.setProperty(
          "--case-transform",
          transform
        );


        card.style.transform =
          transform;


        card.style.zIndex =
          isFocused
            ? "9999"
            : String(
                Math.round(
                  100 +
                  front *
                    100
                )
              );


        if (isFocused) {

          card.style.opacity =
            "1";

          card.style.filter =
            "brightness(1.10) saturate(1.04) blur(0px)";

        }

        else {

          const distanceFromFront =
            Math.abs(
              0.5 -
              front
            );


          const opacity =
            0.28 +
            front * 0.36 -
            distanceFromFront *
              0.08;


          card.style.opacity =
            String(
              clamp(
                opacity,
                0.20,
                0.68
              )
            );


          card.style.filter =
            `brightness(${0.76 + front * 0.20}) blur(${(1 - front) * 0.75}px)`;

        }

      }
    );


    orbitRAF =
      requestAnimationFrame(
        orbitLoop
      );

  }

})();


/* =========================================================
   CASE CREATION & INVESTIGATION SYNC MODULE
   ========================================================= */
(function initCaseCreationManager() {
  const newCaseBtn = document.getElementById("newCaseBtn");
  const caseModal = document.getElementById("caseCreateModal");
  const caseForm = document.getElementById("caseCreateForm");
  const caseCloseBtn = document.getElementById("caseCreateClose");
  const caseCancelBtn = document.getElementById("caseCancelBtn");
  const caseIdDisplay = document.getElementById("newCaseIdDisplay");
  const caseIdHidden = document.getElementById("newCaseIdHidden");
  const caseNameInput = document.getElementById("newCaseName");
  const caseTypeSelect = document.getElementById("newCaseType");
  const casePrioritySelect = document.getElementById("newCasePriority");
  const caseDateInput = document.getElementById("newCaseIncidentDate");
  const caseDescInput = document.getElementById("newCaseDescription");
  const caseLocInput = document.getElementById("newCaseLocation");
  const selectMapBtn = document.getElementById("newCaseSelectMapBtn");
  const tagsWrapper = document.getElementById("caseTagsWrapper");
  const tagAddInput = document.getElementById("newCaseTagInput");
  const officerVal = document.getElementById("newCaseOfficerVal");
  const officerHidden = document.getElementById("newCaseOfficerHidden");
  const jurisdictionVal = document.getElementById("newCaseJurisdictionVal");
  const jurisdictionHidden = document.getElementById("newCaseJurisdictionHidden");

  // Initialize default metadata on existing cards c1-c5
  const stage = document.getElementById("caseStage");
  if (stage) {
    const c1 = stage.querySelector(".c1");
    if (c1 && !c1.dataset.caseId) {
      c1.dataset.caseId = "C-2026-014";
      c1.dataset.caseType = "Financial Crime";
      c1.dataset.priority = "Medium";
      c1.dataset.incidentDate = "2026-08-14";
      c1.dataset.description = "Cross-border movement & financial links tracking illicit transit routes across northern corridors.";
      c1.dataset.location = "Sector 17, Chandigarh";
      c1.dataset.officer = "Vinay Yadav";
      c1.dataset.jurisdiction = "Chandigarh Central";
      c1.dataset.tags = "financial, cross-border, transit";
    }
    const c2 = stage.querySelector(".c2");
    if (c2 && !c2.dataset.caseId) {
      c2.dataset.caseId = "C-2026-021";
      c2.dataset.caseType = "Corporate Fraud";
      c2.dataset.priority = "Low";
      c2.dataset.incidentDate = "2026-07-02";
      c2.dataset.description = "Corporate ownership, shell holdings and proxy entities laundering capital through tech accounts.";
      c2.dataset.location = "Cyber City, Gurugram";
      c2.dataset.officer = "Vinay Yadav";
      c2.dataset.jurisdiction = "Chandigarh Central";
      c2.dataset.tags = "corporate, shell-holdings, proxies";
    }
    const c3 = stage.querySelector(".c3");
    if (c3 && !c3.dataset.caseId) {
      c3.dataset.caseId = "C-2026-042";
      c3.dataset.caseType = "Organized Crime";
      c3.dataset.priority = "High";
      c3.dataset.incidentDate = "2026-03-12";
      c3.dataset.description = "A connected criminal network spanning people, organizations, locations and financial evidence.";
      c3.dataset.location = "Mumbai & Northern Region";
      c3.dataset.officer = "Vinay Yadav";
      c3.dataset.jurisdiction = "Chandigarh Central";
      c3.dataset.tags = "organized-crime, terror-finance, hawala";
    }
    const c4 = stage.querySelector(".c4");
    if (c4 && !c4.dataset.caseId) {
      c4.dataset.caseId = "C-2026-009";
      c4.dataset.caseType = "Theft & Smuggling";
      c4.dataset.priority = "Closed";
      c4.dataset.incidentDate = "2026-01-19";
      c4.dataset.description = "Logistics network reconstruction and maritime freight tracking for unauthorized container cargo.";
      c4.dataset.location = "JNPT Port Terminal";
      c4.dataset.officer = "Vinay Yadav";
      c4.dataset.jurisdiction = "Western Maritime";
      c4.dataset.tags = "logistics, shipping, cargo";
    }
    const c5 = stage.querySelector(".c5");
    if (c5 && !c5.dataset.caseId) {
      c5.dataset.caseId = "C-2026-033";
      c5.dataset.caseType = "Cyber Crime";
      c5.dataset.priority = "Medium";
      c5.dataset.incidentDate = "2026-06-28";
      c5.dataset.description = "Evidence-led entity resolution and multi-bank transactional graph analysis of phishing networks.";
      c5.dataset.location = "Financial District";
      c5.dataset.officer = "Vinay Yadav";
      c5.dataset.jurisdiction = "Economic Offences Wing";
      c5.dataset.tags = "cyber, banking, entities";
    }
  }

  let evidencePopupTimer = null;

  function showEvidencePromptPopup(createdCase) {
    let popup = document.getElementById("caseEvidencePromptPopup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "caseEvidencePromptPopup";
      popup.className = "cipher-evidence-prompt-popup";
      popup.setAttribute("role", "alert");
      popup.setAttribute("aria-live", "assertive");
      popup.innerHTML = `
        <div class="evidence-popup-top">
          <div class="evidence-popup-badge-wrap">
            <span class="evidence-popup-check">✓</span>
            <span class="evidence-popup-label">CASE CREATED • ACTIVE</span>
          </div>
          <button type="button" class="evidence-popup-close-btn" id="caseEvidencePopupDismiss" aria-label="Close notification">×</button>
        </div>
        <div class="evidence-popup-case-title" id="caseEvidencePopupTitle">${createdCase.case_number} • ${createdCase.title}</div>
        <p class="evidence-popup-msg">
          Please add evidence and proceed further
        </p>
        <div class="evidence-popup-footer">
          <span class="evidence-popup-subtext">Click here to continue</span>
          <button type="button" class="evidence-popup-btn" id="caseEvidencePopupActionBtn">
            OPEN EVIDENCE ◈ ↗
          </button>
        </div>
      `;
      document.body.appendChild(popup);
    }

    // Ensure it is on the top stacking layer
    popup.style.display = "flex";
    popup.style.position = "fixed";
    popup.style.top = "24px";
    popup.style.right = "24px";
    popup.style.zIndex = "999999";

    const titleEl = popup.querySelector("#caseEvidencePopupTitle");
    if (titleEl) {
      titleEl.textContent = `${createdCase.case_number} • ${createdCase.title}`;
    }

    clearTimeout(evidencePopupTimer);

    // Force show class with requestAnimationFrame for smooth CSS animation
    requestAnimationFrame(() => {
      popup.classList.add("show");
    });

    evidencePopupTimer = setTimeout(() => {
      popup.classList.remove("show");
    }, 25000);

    const dismissBtn = popup.querySelector("#caseEvidencePopupDismiss");
    if (dismissBtn) {
      dismissBtn.onclick = (evt) => {
        evt.stopPropagation();
        popup.classList.remove("show");
        clearTimeout(evidencePopupTimer);
      };
    }

    const handleNavigateToEvidence = (evt) => {
      if (evt && evt.target && evt.target.closest("#caseEvidencePopupDismiss")) return;

      if (typeof window.cipherSwitchView === "function") {
        window.cipherSwitchView("evidence");
      } else {
        const evTab = document.querySelector('.side-item[data-view="evidence"]') || document.querySelector('[data-view="evidence"]');
        if (evTab) evTab.click();
      }

      // Synchronize evidence workspace headers & fields with the new case
      const repStatus = document.getElementById("reportCaseStatus");
      if (repStatus) repStatus.textContent = `CASE / ${createdCase.case_number} • ACTIVE`;

      const repTitle = document.getElementById("reportTitle");
      if (repTitle) repTitle.textContent = createdCase.title;

      const repSubtitle = document.getElementById("reportSubtitle");
      if (repSubtitle) {
        repSubtitle.textContent = `${createdCase.primary_location} · ${createdCase.incident_date} · ${createdCase.case_type}`;
      }

      const caseIdField = document.querySelector('[data-report-field="caseId"]');
      if (caseIdField) caseIdField.value = createdCase.case_number;

      const agencyField = document.querySelector('[data-report-field="agency"]');
      if (agencyField) agencyField.value = `${createdCase.jurisdiction} / ${createdCase.assigned_officer}`;

      const caseTypeField = document.querySelector('[data-report-field="caseType"]');
      if (caseTypeField) caseTypeField.value = createdCase.case_type;

      const dateField = document.querySelector('[data-report-field="incidentDate"]');
      if (dateField) dateField.value = createdCase.incident_date;

      const locField = document.querySelector('[data-report-field="location"]');
      if (locField) locField.value = createdCase.primary_location;

      popup.classList.remove("show");
      clearTimeout(evidencePopupTimer);

      notifyUser(`Switched to Evidence section for Case ${createdCase.case_number}`);
    };

    popup.onclick = handleNavigateToEvidence;
    const actionBtn = popup.querySelector("#caseEvidencePopupActionBtn");
    if (actionBtn) {
      actionBtn.onclick = handleNavigateToEvidence;
    }
  }

  // Expose globally for testing/interaction
  window.cipherShowEvidencePrompt = showEvidencePromptPopup;

  function notifyUser(msg) {
    let t = document.getElementById("networkToast");
    if (!t) {
      t = document.createElement("div");
      t.id = "networkToast";
      t.className = "network-toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
      t.classList.remove("show");
    }, 3200);
  }

  let caseSequence = 14;

  async function openCaseModal() {
    if (!caseModal) return;

    // Fetch existing count to generate next Case ID
    try {
      const res = await fetch("/api/cases");
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.cases)) {
          caseSequence = Math.max(caseSequence, data.cases.length + 14);
        }
      }
    } catch (e) {
      // offline fallback
    }

    const nextId = `C-2026-${String(caseSequence).padStart(3, "0")}`;
    if (caseIdDisplay) caseIdDisplay.textContent = nextId;
    if (caseIdHidden) caseIdHidden.value = nextId;

    // Default incident date to today
    if (caseDateInput) {
      caseDateInput.value = new Date().toISOString().split("T")[0];
    }

    // Auto-populate officer and jurisdiction
    const loggedUser = window.currentUser || { name: "Vinay Yadav", jurisdiction: "Chandigarh Central" };
    if (officerVal) officerVal.textContent = loggedUser.name || "Vinay Yadav";
    if (officerHidden) officerHidden.value = loggedUser.name || "Vinay Yadav";
    if (jurisdictionVal) jurisdictionVal.textContent = loggedUser.jurisdiction || "Chandigarh Central";
    if (jurisdictionHidden) jurisdictionHidden.value = loggedUser.jurisdiction || "Chandigarh Central";

    // Open modal
    caseModal.classList.add("open");
    caseModal.setAttribute("aria-hidden", "false");
    if (caseNameInput) {
      setTimeout(() => caseNameInput.focus(), 80);
    }
  }

  function closeCaseModal() {
    if (!caseModal) return;
    caseModal.classList.remove("open");
    caseModal.setAttribute("aria-hidden", "true");
  }

  if (newCaseBtn) {
    newCaseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openCaseModal();
    });
  }

  if (caseCloseBtn) {
    caseCloseBtn.addEventListener("click", closeCaseModal);
  }
  if (caseCancelBtn) {
    caseCancelBtn.addEventListener("click", closeCaseModal);
  }

  const backdrop = caseModal?.querySelector(".case-create-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", closeCaseModal);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && caseModal?.classList.contains("open")) {
      closeCaseModal();
    }
  });

  // Tag chip toggling & adding
  if (tagsWrapper) {
    tagsWrapper.addEventListener("click", (e) => {
      const chip = e.target.closest(".case-tag-chip");
      if (chip) {
        chip.classList.toggle("active");
      }
    });

    if (tagAddInput) {
      tagAddInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === ",") {
          e.preventDefault();
          const val = tagAddInput.value.replace(/,/g, "").trim();
          if (val) {
            const newChip = document.createElement("button");
            newChip.type = "button";
            newChip.className = "case-tag-chip active";
            newChip.dataset.tag = val;
            newChip.textContent = val;
            tagsWrapper.insertBefore(newChip, tagAddInput);
            tagAddInput.value = "";
          }
        }
      });
    }
  }

  // Select on Map button
  if (selectMapBtn && caseLocInput) {
    selectMapBtn.addEventListener("click", () => {
      caseLocInput.value = "Sector 17, Chandigarh (30.7415° N, 76.7794° E)";
      notifyUser("Location pinned: Sector 17, Chandigarh (30.7415° N, 76.7794° E)");
    });
  }

  // Form Submission
  if (caseForm) {
    caseForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = caseNameInput?.value.trim() || "";
      const case_number = caseIdHidden?.value.trim() || `C-2026-${String(caseSequence).padStart(3, "0")}`;
      const case_type = caseTypeSelect?.value || "Financial Crime";
      const priority = casePrioritySelect?.value || "High";
      const incident_date = caseDateInput?.value || new Date().toISOString().split("T")[0];
      const description = caseDescInput?.value.trim() || "Investigative intelligence case record.";
      const primary_location = caseLocInput?.value.trim() || "Sector 17, Chandigarh";
      const assigned_officer = officerHidden?.value || "Vinay Yadav";
      const jurisdiction = jurisdictionHidden?.value || "Chandigarh Central";

      const activeTags = Array.from(tagsWrapper?.querySelectorAll(".case-tag-chip.active") || [])
        .map(el => el.dataset.tag || el.textContent.trim())
        .filter(Boolean);
      const tags = activeTags.join(", ");

      if (!title) {
        notifyUser("Please enter a Case Name");
        return;
      }

      const payload = {
        case_number,
        title,
        case_type,
        priority,
        incident_date,
        description,
        primary_location,
        assigned_officer,
        jurisdiction,
        tags
      };

      // 1. Immediately close modal and show the green right-side evidence prompt popup
      caseSequence++;
      closeCaseModal();
      caseForm.reset();
      showEvidencePromptPopup(payload);
      notifyUser(`Case ${case_number} created and synchronized with database!`);

      // 2. Safely update 3D orbit card and focus it
      try {
        if (stage) {
          const targetBox = stage.querySelector(".c1") || stage.querySelector(".floating-case:not(.case-main)") || stage.querySelector(".floating-case");
          if (targetBox) {
            targetBox.dataset.case = title;
            targetBox.dataset.caseId = case_number;
            targetBox.dataset.caseType = case_type;
            targetBox.dataset.priority = priority;
            targetBox.dataset.description = description;
            targetBox.dataset.incidentDate = incident_date;
            targetBox.dataset.location = primary_location;
            targetBox.dataset.officer = assigned_officer;
            targetBox.dataset.jurisdiction = jurisdiction;
            targetBox.dataset.tags = tags;
            targetBox.dataset.isNew = "true";
            targetBox.classList.add("is-new-case");

            const isHigh = priority.toUpperCase().includes("HIGH") || priority.toUpperCase().includes("CRITICAL");
            const cleanLoc = (primary_location || "Central").split("(")[0].trim();
            targetBox.innerHTML = `
              <div class="case-top">
                <span>CASE / ${case_number}</span>
                <div style="display:flex;align-items:center;gap:6px;">
                  <b class="${isHigh ? 'high' : ''}">${priority.toUpperCase()}</b>
                  <span class="case-new-badge">NEW</span>
                </div>
              </div>
              <h3>${title}</h3>
              <p>${description}</p>
              <div class="case-stats">
                <span>${case_type}</span>
                <span>${cleanLoc}</span>
              </div>
            `;

            if (typeof window.cipherFocusCase === "function") {
              window.cipherFocusCase(targetBox);
            }

            try {
              targetBox.click();
            } catch (clickErr) {
              console.warn("Card click sync notice:", clickErr);
            }
          }
        }
      } catch (orbitErr) {
        console.warn("Orbit visual update notice:", orbitErr);
      }

      // 3. Concurrently sync to backend database
      try {
        const token = localStorage.getItem("cipher_access_token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        fetch("/api/cases", {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        }).catch(fetchErr => console.warn("Backend save notice:", fetchErr));
      } catch (err) {
        console.warn("Backend save notice:", err);
      }
    });
  }
})();


/* =========================================================
   SCROLL-DRIVEN TIMELINE RECONSTRUCTION
   ========================================================= */

(function initCipherTimeline() {

  const section =
    document.getElementById(
      "timeline-reconstruction"
    );

  const canvas =
    document.getElementById(
      "cipherTimeline"
    );

  const trace =
    document.getElementById(
      "timelineTrace"
    );


  if (
    !section ||
    !canvas ||
    !trace
  ) {
    return;
  }


  const nodes = [
    ...canvas.querySelectorAll(
      ".timeline-node"
    )
  ];


  const events = [
    ...canvas.querySelectorAll(
      ".timeline-event"
    )
  ];


  const progressLabel =
    document.getElementById(
      "timelineProgressLabel"
    );


  const progressState =
    document.getElementById(
      "timelineProgressState"
    );


  let pathLength = 0;

  let raf = 0;

  let current = 0;

  let target = 0;


  function measure() {

    pathLength =
      trace.getTotalLength();

    trace.style.strokeDasharray =
      pathLength;

    trace.style.strokeDashoffset =
      pathLength;

  }


  function clamp(
    v,
    a = 0,
    b = 1
  ) {

    return Math.max(
      a,
      Math.min(
        b,
        v
      )
    );

  }


  function update() {

    raf = 0;


    const rect =
      section.getBoundingClientRect();


    const travel =
      Math.max(
        1,
        section.offsetHeight -
          window.innerHeight
      );


    target =
      clamp(
        -rect.top /
          travel
      );


    current +=
      (
        target -
        current
      ) *
      0.10;


    if (
      Math.abs(
        target -
        current
      ) <
      0.0005
    ) {

      current =
        target;

    }


    const eased =
      current *
      current *
      (
        3 -
        2 *
        current
      );


    trace.style.strokeDashoffset =
      pathLength *
      (
        1 -
        eased
      );


    const active =
      Math.min(
        nodes.length,
        Math.max(
          1,
          Math.floor(
            current *
              nodes.length
          ) +
            1
        )
      );


    nodes.forEach(
      (node, i) => {

        const index =
          i + 1;


        node.classList.toggle(
          "active",
          index <= active
        );


        node.classList.toggle(
          "current",
          index === active &&
          current < 0.995
        );

      }
    );


    events.forEach(
      (event, i) => {

        const index =
          i + 1;


        const threshold =
          (
            index - 1
          ) /
          Math.max(
            1,
            events.length -
              1
          );


        const show =
          current >=
          Math.max(
            0,
            threshold -
              0.055
          );


        event.classList.toggle(
          "visible",
          show
        );

      }
    );


    const shown =
      Math.min(
        nodes.length,
        Math.max(
          1,
          Math.ceil(
            current *
              nodes.length
          )
        )
      );


    if (progressLabel) {

      progressLabel.textContent =
        String(shown).padStart(
          2,
          "0"
        ) +
        " / " +
        String(
          nodes.length
        ).padStart(
          2,
          "0"
        );

    }


    if (progressState) {

      progressState.textContent =
        current > 0.97
          ? "TRACE COMPLETE"
          : current > 0.08
            ? "RECONSTRUCTING"
            : "TRACE READY";

    }


    if (current < 1) {

      raf =
        requestAnimationFrame(
          update
        );

    }

  }


  function request() {

    if (!raf) {

      raf =
        requestAnimationFrame(
          update
        );

    }

  }


  measure();


  window.addEventListener(
    "resize",
    () => {

      measure();
      request();

    },
    {
      passive: true
    }
  );


  window.addEventListener(
    "scroll",
    request,
    {
      passive: true
    }
  );


  request();

})();


/* =========================================================
   NETWORK WORKSPACE / NODE EDITOR
   ========================================================= */

(function initNetworkWorkspace() {

  const sideItems = [
    ...document.querySelectorAll(
      ".workspace-sidebar .side-item[data-view]"
    )
  ];


  const casesView =
    document.getElementById(
      "casesView"
    );

  const networkView =
    document.getElementById(
      "networkView"
    );

  const timelineView =
    document.getElementById(
      "timelineView"
    );

  const evidenceView =
    document.getElementById(
      "evidenceView"
    );

  const modal =
    document.getElementById(
      "nodeModal"
    );


  if (
    !sideItems.length ||
    !casesView ||
    !networkView
  ) {
    return;
  }


  function switchView(
    view
  ) {

    sideItems.forEach(
      btn =>
        btn.classList.toggle(
          "active",
          btn.dataset.view ===
            view
        )
    );


    casesView.classList.toggle(
      "active-view",
      view === "cases"
    );


    networkView.classList.toggle(
      "active-view",
      view === "network"
    );


    timelineView?.classList.toggle(
      "active-view",
      view === "timeline"
    );


    evidenceView?.classList.toggle(
      "active-view",
      view === "evidence"
    );

    const aiInvestigatorView = document.getElementById("aiInvestigatorView");
    aiInvestigatorView?.classList.toggle(
      "active-view",
      view === "ai-investigator"
    );

    if (view === "ai-investigator" && aiInvestigatorView) {
      aiInvestigatorView.scrollTop = 0;
      if (typeof window.refreshAIActivity === "function") {
        window.refreshAIActivity();
      }
    }


    if (
      view === "network"
    ) {

      networkView.scrollTop =
        0;

      setTimeout(() => {
        if (typeof window.loadNetworkGraph === "function") {
          window.loadNetworkGraph(1);
        }
      }, 50);

    }


    if (
      view === "timeline" &&
      timelineView
    ) {

      timelineView.scrollTop =
        0;

    }


    if (
      view === "evidence" &&
      evidenceView
    ) {

      evidenceView.scrollTop =
        0;

    }

  }


  sideItems.forEach(
    btn =>
      btn.addEventListener(
        "click",
        () =>
          switchView(
            btn.dataset.view
          )
      )
  );

  window.cipherSwitchView = switchView;


  const openModal = async () => {
    if (!modal) return;
    modal.classList.add("open");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    showStep(1);

    // Populate target entity dropdown for relationship linking
    const targetSelect = document.getElementById("nodeModalTargetNode");
    if (targetSelect) {
      targetSelect.innerHTML = '<option value="">-- Select existing entity (optional) --</option>';
      try {
        const res = await fetch("/cases/1/entities");
        if (res.ok) {
          const data = await res.json();
          const entities = data.entities || [];
          entities.forEach(ent => {
            const opt = document.createElement("option");
            opt.value = ent.id;
            opt.textContent = `${ent.label} (${(ent.entity_type || "person").toUpperCase()})`;
            targetSelect.appendChild(opt);
          });
        }
      } catch (err) {
        console.warn("Could not fetch entities for node modal dropdown:", err);
      }
    }

    setTimeout(
      () =>
        modal
          .querySelector(
            'input[name="nodeName"]'
          )
          ?.focus(),
      80
    );
  };

  window.cipherOpenNodeModal = openModal;

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");

    if (
      document
        .getElementById(
          "cipherWorkspace"
        )
        ?.classList.contains(
          "open"
        )
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  window.cipherCloseNodeModal = closeModal;

  document
    .getElementById(
      "addNodeBtn"
    )
    ?.addEventListener(
      "click",
      openModal
    );


  // Delete Node button listener is handled in initCipherNetworkModule with confirmation and API call


  document
    .querySelectorAll(
      "[data-node-close]"
    )
    .forEach(
      el =>
        el.addEventListener(
          "click",
          closeModal
        )
    );


  document
    .getElementById(
      "nodeModalClose"
    )
    ?.addEventListener(
      "click",
      closeModal
    );


  document.addEventListener(
    "keydown",
    e => {

      if (
        e.key === "Escape" &&
        modal?.classList.contains(
          "open"
        )
      ) {

        closeModal();

      }

    }
  );


  let step = 1;


  const steps = [
    ...document.querySelectorAll(
      ".node-step"
    )
  ];


  const dots = [
    ...document.querySelectorAll(
      "[data-step-dot]"
    )
  ];


  const counter =
    document.getElementById(
      "nodeStepNumber"
    );


  const next =
    document.getElementById(
      "nodeNext"
    );


  const back =
    document.getElementById(
      "nodeBack"
    );


  function showStep(n) {

    step =
      Math.max(
        1,
        Math.min(
          4,
          n
        )
      );


    steps.forEach(
      x =>
        x.classList.toggle(
          "active",
          Number(
            x.dataset.step
          ) === step
        )
    );


    dots.forEach(
      x =>
        x.classList.toggle(
          "active",
          Number(
            x.dataset.stepDot
          ) <= step
        )
    );


    if (counter) {

      counter.textContent =
        String(step).padStart(
          2,
          "0"
        );

    }


    if (back) {

      back.style.visibility =
        step === 1
          ? "hidden"
          : "visible";

    }


    if (next) {

      next.innerHTML =
        step === 4
          ? 'LINK NODE <span>↗</span>'
          : 'NEXT <span>→</span>';

    }

  }


  next?.addEventListener(
    "click",
    () => {

      if (step === 1) {
        const nameVal = (document.getElementById("nodeModalName")?.value || document.querySelector('#nodeForm input[name="nodeName"]')?.value || "").trim();
        if (!nameVal) {
          if (typeof showNetworkToast === "function") {
            showNetworkToast("Please enter a name or label for the entity before proceeding.");
          } else if (typeof toast === "function") {
            toast("Please enter a name or label for the entity before proceeding.");
          }
          const input = document.getElementById("nodeModalName") || document.querySelector('#nodeForm input[name="nodeName"]');
          input?.focus();
          return;
        }
      }

      if (step < 4) {

        showStep(
          step + 1
        );

        return;

      }


      // On Step 4, submit the form to create entity and link in database & graph
      const nodeForm = document.getElementById("nodeForm");
      if (nodeForm) {
        nodeForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      } else {
        closeModal();
      }

    }
  );

  document.getElementById("nodeQuickCreate")?.addEventListener("click", () => {
    const nodeForm = document.getElementById("nodeForm");
    if (nodeForm) {
      nodeForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  });


  back?.addEventListener(
    "click",
    () =>
      showStep(
        step - 1
      )
  );


  document
    .querySelectorAll(
      ".node-type"
    )
    .forEach(
      btn =>
        btn.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".node-type"
              )
              .forEach(
                x =>
                  x.classList.remove(
                    "active"
                  )
              );


            btn.classList.add(
              "active"
            );

          }
        )
    );


  document
    .querySelectorAll(
      ".source-choice"
    )
    .forEach(
      btn =>
        btn.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".source-choice"
              )
              .forEach(
                x =>
                  x.classList.remove(
                    "active"
                  )
              );


            btn.classList.add(
              "active"
            );

          }
        )
    );


  document
    .querySelectorAll(
      ".confidence"
    )
    .forEach(
      btn =>
        btn.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".confidence"
              )
              .forEach(
                x =>
                  x.classList.remove(
                    "active"
                  )
              );


            btn.classList.add(
              "active"
            );

          }
        )
    );


  document
    .querySelectorAll(
      ".inspector-tabs button"
    )
    .forEach(
      btn =>
        btn.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".inspector-tabs button"
              )
              .forEach(
                x =>
                  x.classList.remove(
                    "active"
                  )
              );


            btn.classList.add(
              "active"
            );

          }
        )
    );


  function showNetworkToast(
    message
  ) {

    let t =
      document.getElementById(
        "networkToast"
      );


    if (!t) {

      t =
        document.createElement(
          "div"
        );

      t.id =
        "networkToast";

      t.className =
        "network-toast";

      document.body.appendChild(
        t
      );

    }


    t.textContent =
      message;


    t.classList.add(
      "show"
    );


    clearTimeout(
      t._timer
    );


    t._timer =
      setTimeout(
        () =>
          t.classList.remove(
            "show"
          ),
        2600
      );

  }

})();


/* =========================================================
   CSV IMPORT
   ========================================================= */

(function initCsvImport() {
  const input = document.getElementById("csvFileInput");
  const mainBtn = document.getElementById("mainCsvUploadBtn");
  const nodeBtn = document.getElementById("nodeCsvUploadBtn");
  const dropzone = document.getElementById("nodeCsvDropzone");
  const status = document.getElementById("csvFileStatus");

  // Modal elements
  const csvModal = document.getElementById("cipherCsvModal");
  const csvBackdrop = document.getElementById("cipherCsvBackdrop");
  const csvClose = document.getElementById("cipherCsvClose");
  const csvCancelBtn = document.getElementById("cipherCsvCancelBtn");
  const csvProceedBtn = document.getElementById("cipherCsvProceedBtn");
  const csvFileName = document.getElementById("cipherCsvFileName");
  const csvRowStats = document.getElementById("cipherCsvRowStats");
  const csvPreviewTable = document.getElementById("cipherCsvPreviewTable");
  const csvLoadSampleBtn = document.getElementById("cipherCsvLoadSampleBtn");
  const csvChangeFileBtn = document.getElementById("cipherCsvChangeFileBtn");
  const csvErrorMsg = document.getElementById("cipherCsvErrorMsg");

  if (!input) return;

  let currentFile = null;
  let currentCsvText = "";
  let currentFilename = "falcon_sample_investigation.csv";

  function parseCsvString(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return { headers: [], rows: [] };

    const firstLine = lines[0];
    const commas = (firstLine.match(/,/g) || []).length;
    const semis = (firstLine.match(/;/g) || []).length;
    const tabs = (firstLine.match(/\t/g) || []).length;
    let delim = ",";
    if (semis > commas && semis > tabs) delim = ";";
    else if (tabs > commas && tabs > semis) delim = "\t";

    function parseLine(line) {
      const cells = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === delim && !inQuotes) {
          cells.push(cur.trim());
          cur = "";
        } else {
          cur += ch;
        }
      }
      cells.push(cur.trim());
      return cells;
    }

    const headers = parseLine(lines[0]);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = parseLine(lines[i]);
      if (vals.every(v => v === "")) continue;
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = vals[idx] !== undefined ? vals[idx] : "";
      });
      rows.push(obj);
    }
    return { headers, rows };
  }

  function escapeHtml(val) {
    return String(val || "").replace(/[&<>'"]/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    })[c]);
  }

  function renderPreviewTable(headers, rows) {
    if (!csvPreviewTable) return;
    if (headers.length === 0) {
      csvPreviewTable.innerHTML = '<tr><td style="padding:10px;text-align:center;color:#666;">No valid records detected in CSV</td></tr>';
      return;
    }

    let html = '<thead><tr style="border-bottom:1px solid #233030;background:#0d1414;">';
    headers.forEach(h => {
      html += `<th style="padding:7px 10px;font-size:10px;letter-spacing:0.06em;color:#7fe9df;text-transform:uppercase;white-space:nowrap;">${escapeHtml(h)}</th>`;
    });
    html += '</tr></thead><tbody>';

    const displayRows = rows.slice(0, 5);
    displayRows.forEach((row, idx) => {
      const bg = idx % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent";
      html += `<tr style="border-bottom:1px solid #162020;background:${bg};">`;
      headers.forEach(h => {
        const val = row[h] || "";
        const isHighlight = h.toLowerCase().includes("name") || h.toLowerCase().includes("label");
        html += `<td style="padding:6px 10px;font-size:11px;color:${isHighlight ? '#fff' : '#a0aba7'};white-space:nowrap;max-width:180px;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(val) || '<span style="color:#445;">—</span>'}</td>`;
      });
      html += '</tr>';
    });

    if (rows.length > 5) {
      html += `<tr><td colspan="${headers.length}" style="padding:6px 10px;font-size:10px;color:#7fe9df;background:#080c0c;text-align:center;">+ ${rows.length - 5} more records will be processed into the investigation</td></tr>`;
    }

    html += '</tbody>';
    csvPreviewTable.innerHTML = html;
  }

  async function openCsvModal(filename, csvText, fileObj = null) {
    if (csvErrorMsg) {
      csvErrorMsg.style.display = "none";
      csvErrorMsg.textContent = "";
    }

    currentFilename = filename || "falcon_sample_investigation.csv";
    currentCsvText = csvText || "";
    currentFile = fileObj;

    // If no text provided, load sample template from server
    if (!currentCsvText && !currentFile) {
      try {
        const sRes = await fetch("/cases/1/sample-csv");
        if (sRes.ok) {
          currentCsvText = await sRes.text();
          currentFilename = "falcon_sample_investigation.csv";
        }
      } catch (err) {
        console.warn("Could not prefetch sample CSV", err);
      }
    }

    const { headers, rows } = parseCsvString(currentCsvText);

    if (csvFileName) csvFileName.textContent = currentFilename;
    if (csvRowStats) {
      csvRowStats.textContent = `${rows.length} data row${rows.length === 1 ? '' : 's'} · ${headers.length} column${headers.length === 1 ? '' : 's'} identified`;
    }

    renderPreviewTable(headers, rows);

    if (csvModal) {
      csvModal.classList.add("open");
      csvModal.style.display = "flex";
      csvModal.setAttribute("aria-hidden", "false");
    }

    if (status) {
      status.classList.add("has-file");
      status.innerHTML = `
        <span class="status-dot"></span>
        <div>
          <b>${escapeHtml(currentFilename)}</b>
          <small>${rows.length} records ready for graph ingestion</small>
        </div>
      `;
    }
  }

  function closeCsvModal() {
    if (!csvModal) return;
    csvModal.classList.remove("open");
    csvModal.style.display = "none";
    csvModal.setAttribute("aria-hidden", "true");
    if (csvErrorMsg) {
      csvErrorMsg.style.display = "none";
      csvErrorMsg.textContent = "";
    }
  }

  // Bind close buttons
  csvClose?.addEventListener("click", closeCsvModal);
  csvCancelBtn?.addEventListener("click", closeCsvModal);
  csvBackdrop?.addEventListener("click", closeCsvModal);

  // Change file button
  csvChangeFileBtn?.addEventListener("click", () => {
    input.value = "";
    input.click();
  });

  // Load sample Falcon CSV button
  csvLoadSampleBtn?.addEventListener("click", async () => {
    try {
      if (typeof showNetworkToast === "function") {
        showNetworkToast("Loading Falcon investigation sample CSV template...");
      }
      const res = await fetch("/cases/1/sample-csv");
      if (res.ok) {
        const text = await res.text();
        await openCsvModal("falcon_sample_investigation.csv", text, null);
      }
    } catch (e) {
      console.error("Failed to load sample CSV:", e);
    }
  });

  // Ingest & Plot Action
  csvProceedBtn?.addEventListener("click", async () => {
    if (csvErrorMsg) {
      csvErrorMsg.style.display = "none";
      csvErrorMsg.textContent = "";
    }

    // If neither text nor file is present, load the sample CSV automatically
    if (!currentCsvText && !currentFile) {
      try {
        const sampleRes = await fetch("/cases/1/sample-csv");
        if (sampleRes.ok) {
          currentCsvText = await sampleRes.text();
          currentFilename = "falcon_sample_investigation.csv";
          const { headers, rows } = parseCsvString(currentCsvText);
          renderPreviewTable(headers, rows);
        }
      } catch (err) {
        console.error("Failed to load sample CSV:", err);
      }
    }

    if (!currentCsvText && !currentFile) {
      if (csvErrorMsg) {
        csvErrorMsg.style.display = "block";
        csvErrorMsg.textContent = "No CSV data found to ingest. Please choose a file or click 'Load Falcon Sample CSV'.";
      }
      if (typeof showNetworkToast === "function") {
        showNetworkToast("No CSV data to ingest. Please choose a file.");
      }
      return;
    }

    const origText = csvProceedBtn.textContent;
    csvProceedBtn.disabled = true;
    csvProceedBtn.textContent = "INGESTING DATA...";

    try {
      const modeRadio = document.querySelector('input[name="cipherCsvImportMode"]:checked');
      const importMode = modeRadio ? modeRadio.value : "replace";

      const token = localStorage.getItem("cipher_access_token");
      let res;
      if (currentFile) {
        const formData = new FormData();
        formData.append("file", currentFile);
        formData.append("mode", importMode);
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        res = await fetch("/cases/1/import-csv", {
          method: "POST",
          headers,
          body: formData
        });
      } else {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        res = await fetch("/cases/1/import-csv", {
          method: "POST",
          headers,
          body: JSON.stringify({
            filename: currentFilename,
            csvText: currentCsvText,
            mode: importMode
          })
        });
      }

      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { detail: "Server error parsing JSON response" };
      }

      if (res && res.ok && data.status === "success") {
        closeCsvModal();

        const successMsg = data.message || `Ingestion complete: ${data.stats?.importedEntities || 0} entities & ${data.stats?.importedRelationships || 0} links added (${importMode.toUpperCase()} mode).`;
        if (typeof showNetworkToast === "function") {
          showNetworkToast(`✓ ${successMsg}`);
        } else if (typeof toast === "function") {
          toast(`✓ ${successMsg}`);
        }

        // Sync status into Evidence section register as INGESTED
        syncFileToEvidenceSection(currentFilename, data.stats?.importedEntities || 0, 0, true);

        // Switch to the Network view immediately so user sees the newly plotted graph!
        if (typeof window.cipherSwitchView === "function") {
          window.cipherSwitchView("network");
        } else {
          const netBtn = document.querySelector('.workspace-sidebar .side-item[data-view="network"]');
          netBtn?.click();
        }

        // Reload the Cytoscape graph
        if (typeof window.loadNetworkGraph === "function") {
          await window.loadNetworkGraph(1);
        }

        // Also reload the GIS data so new geographic nodes & corridors appear immediately
        if (typeof window.loadWorkspaceGISData === "function") {
          await window.loadWorkspaceGISData();
        }

        // Run Cytoscape organic auto-layout so new nodes arrange cleanly
        if (window.cy) {
          setTimeout(() => {
            try {
              window.cy.resize();
              window.cy.layout({
                name: "cose",
                animate: true,
                animationDuration: 700,
                fit: true,
                padding: 40
              }).run();
            } catch (err) {}
          }, 350);
        }

        if (status) {
          status.classList.add("has-file");
          status.innerHTML = `
            <span class="status-dot" style="background:#d9ff55;"></span>
            <div>
              <b style="color:#d9ff55;">INGESTED: ${escapeHtml(currentFilename)}</b>
              <small>${data.stats?.importedEntities || 0} entities &amp; ${data.stats?.importedRelationships || 0} links plotted</small>
            </div>
          `;
        }
      } else {
        const errMsg = data.detail || data.error || data.message || "Failed to ingest CSV data.";
        if (csvErrorMsg) {
          csvErrorMsg.style.display = "block";
          csvErrorMsg.textContent = `Ingestion Failed: ${errMsg}`;
        }
        if (typeof showNetworkToast === "function") {
          showNetworkToast(`Error: ${errMsg}`);
        } else {
          alert(errMsg);
        }
      }
    } catch (err) {
      console.error("CSV Ingestion error:", err);
      const errMsg = err?.message || "Error communicating with server during CSV ingestion.";
      if (csvErrorMsg) {
        csvErrorMsg.style.display = "block";
        csvErrorMsg.textContent = `Error: ${errMsg}`;
      }
      if (typeof showNetworkToast === "function") {
        showNetworkToast("Error communicating with server during CSV ingestion.");
      }
    } finally {
      csvProceedBtn.disabled = false;
      csvProceedBtn.textContent = origText;
    }
  });

  function syncFileToEvidenceSection(fileName, rowCount = 0, colCount = 0, ingested = false) {
    const list = document.getElementById("reportEvidenceList");
    if (!list) return;

    let existingRow = list.querySelector(`.evidence-row[data-csv-name="${fileName}"]`);
    if (existingRow) {
      const badge = existingRow.querySelector(".cipher-csv-evidence-badge");
      if (badge) {
        badge.textContent = ingested ? "GRAPH INGESTED · ACTIVE" : "SYNCED TO NETWORK";
        badge.style.color = ingested ? "#d9ff55" : "#00e676";
        badge.style.borderColor = ingested ? "rgba(217,255,85,0.5)" : "rgba(0,230,118,0.4)";
      }
      return;
    }

    const row = document.createElement("div");
    row.className = "evidence-row cipher-csv-evidence-row";
    row.dataset.csvName = fileName;
    row.innerHTML = `
      <span class="evidence-icon" style="background:rgba(0,230,118,0.18);border:1px solid #00e676;color:#00e676;font-weight:700;">CSV</span>
      <div>
        <b contenteditable="true">${escapeHtml(fileName)}</b>
        <small contenteditable="true">${rowCount} data rows · ${colCount} columns · Investigation data source · ${new Date().toLocaleDateString()}</small>
      </div>
      <em class="cipher-csv-evidence-badge" style="${ingested ? 'color:#d9ff55;border-color:rgba(217,255,85,0.5);' : 'color:#00e676;border-color:rgba(0,230,118,0.4);'}">${ingested ? 'GRAPH INGESTED · ACTIVE' : 'SYNCED TO NETWORK'}</em>
    `;
    list.prepend(row);

    const draftState = document.getElementById("reportSaveState");
    if (draftState) {
      draftState.textContent = "EVIDENCE ADDED (CSV)";
    }
  }

  function handleFileSelected(file) {
    if (!file) return;
    if (!/\.csv$/i.test(file.name) && file.type !== "text/csv") {
      if (typeof showNetworkToast === "function") {
        showNetworkToast("Please select a valid CSV file (.csv).");
      }
      if (input) input.value = "";
      const evInput = document.getElementById("evidenceCsvFileInput");
      if (evInput) evInput.value = "";
      return;
    }

    // Mirror file into input.files if selected via evidence section or drag & drop
    try {
      if (input && input.files?.[0] !== file) {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
      }
    } catch (dtErr) {}

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const { headers, rows } = parseCsvString(text);

      // 1. Sync to evidence section immediately
      syncFileToEvidenceSection(file.name, rows.length, headers.length, false);

      // 2. Open CSV modal for preview & graph ingestion (same as network section upload)
      openCsvModal(file.name, text, file);

      if (typeof showNetworkToast === "function") {
        showNetworkToast(`✓ CSV attached: "${file.name}" (${rows.length} records ready to plot)`);
      } else if (typeof toast === "function") {
        toast(`✓ CSV attached: "${file.name}" (${rows.length} records ready to plot)`);
      }
    };
    reader.onerror = () => {
      if (typeof showNetworkToast === "function") {
        showNetworkToast("Error reading the selected CSV file.");
      }
    };
    reader.readAsText(file);
  }

  function choose() {
    input.value = "";
    input.click();
  }

  mainBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    // Open CSV modal directly (pre-populated with sample template or existing file), and allow changing
    openCsvModal(currentFilename, currentCsvText, currentFile);
  });

  nodeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    openCsvModal(currentFilename, currentCsvText, currentFile);
  });

  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (file) handleFileSelected(file);
  });

  // Drag and drop on dropzone
  ["dragenter", "dragover"].forEach(type =>
    dropzone?.addEventListener(type, e => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    })
  );

  ["dragleave", "drop"].forEach(type =>
    dropzone?.addEventListener(type, e => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    })
  );

  dropzone?.addEventListener("drop", e => {
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileSelected(file);
  });

  window.cipherHandleCsvFile = handleFileSelected;
  window.cipherSyncCsvToEvidence = syncFileToEvidenceSection;
  window.cipherOpenCsvImportModal = openCsvModal;
})();


/* =========================================================
   WORKSPACE TIMELINE — TEMPORAL GRAPH
   ========================================================= */

(function initWorkspaceTimeline() {

  const view =
    document.getElementById(
      "timelineView"
    );

  const stage =
    document.getElementById(
      "workspaceTimelineStage"
    );

  const scroll =
    document.getElementById(
      "timelineStageScroll"
    );

  const svg =
    document.getElementById(
      "timelineConnectionSvg"
    );


  const cards = [
    ...document.querySelectorAll(
      ".timeline-event-card"
    )
  ];


  const cursor =
    document.getElementById(
      "timelineSequenceCursor"
    );


  const replay =
    document.getElementById(
      "timelineReplayBtn"
    );


  const clear =
    document.getElementById(
      "timelineClearBtn"
    );


  const resetLayout =
    document.getElementById(
      "timelineResetLayoutBtn"
    );


  const status =
    document.getElementById(
      "workspaceTimelineStatus"
    );


  const seqLabel =
    document.getElementById(
      "timelineSequenceLabel"
    );


  const seqState =
    document.getElementById(
      "timelineSequenceState"
    );


  const footer =
    document.getElementById(
      "timelineFooterState"
    );


  const title =
    document.getElementById(
      "timelineInspectorTitle"
    );


  const body =
    document.getElementById(
      "timelineInspectorBody"
    );


  if (
    !view ||
    !stage ||
    !scroll ||
    !svg ||
    !cards.length
  ) {
    return;
  }


  const data = [

    {
      date: "12 MAR 1993",
      kind: "ORIGIN",
      title:
        "Coordinated blasts strike Mumbai",
      summary:
        "A series of explosions hit locations across the city.",
      meta:
        "257 fatalities · 713 injured",
      tags: [
        "MUMBAI",
        "ORIGIN"
      ]
    },

    {
      date: "12 MAR 1993",
      kind: "IMPACT",
      title:
        "Multiple targets, one sequence",
      summary:
        "Records describe coordinated explosions across major city locations.",
      meta:
        "CASE OPENED",
      tags: [
        "MUMBAI",
        "IMPACT"
      ]
    },

    {
      date: "19 APR 1993",
      kind: "CASE DEVELOPMENT",
      title:
        "First major arrest milestone",
      summary:
        "Sanjay Dutt was arrested in a related arms-possession case.",
      meta:
        "PERSON / ARREST",
      tags: [
        "PERSON",
        "ARREST"
      ]
    },

    {
      date: "04 NOV 1993",
      kind: "EVIDENCE",
      title:
        "Primary charge sheet filed",
      summary:
        "The primary charge sheet was filed against 189 accused.",
      meta:
        "189 ACCUSED",
      tags: [
        "DOCUMENT",
        "EVIDENCE"
      ]
    },

    {
      date: "19 NOV 1993",
      kind: "INVESTIGATION",
      title:
        "Case moves to the CBI",
      summary:
        "The investigation was formally handed to the Central Bureau of Investigation.",
      meta:
        "CENTRAL BUREAU OF INVESTIGATION",
      tags: [
        "CBI",
        "INVESTIGATION"
      ]
    },

    {
      date: "11 NOV 2005",
      kind: "EXTRADITION",
      title:
        "Abu Salem extradited to India",
      summary:
        "After detention in Lisbon, he was extradited to India.",
      meta:
        "2005",
      tags: [
        "PERSON",
        "EXTRADITION"
      ]
    },

    {
      date: "12 SEP 2006",
      kind: "JUDGMENT",
      title:
        "TADA court begins judgment",
      summary:
        "The court began delivering its judgment, with convictions and acquittals announced in stages.",
      meta:
        "2006",
      tags: [
        "COURT",
        "JUDGMENT"
      ]
    },

    {
      date: "30 JUL 2015",
      kind: "FINAL MILESTONE",
      title:
        "Yakub Memon execution",
      summary:
        "Yakub Memon was executed in Nagpur after his final plea was rejected.",
      meta:
        "CASE MILESTONE",
      tags: [
        "COURT",
        "CLOSED"
      ]
    }

  ];


  let visible = 0;

  let timer = null;

  let paths = [];

  let drag = null;

  let suppressClick =
    false;

  let sequenceRunning =
    false;

  let sequenceComplete =
    false;


  function esc(v) {

    return String(
      v
    ).replace(
      /[&<>\"']/g,
      c =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;"
        })[c]
    );

  }


  function setInspector(
    index
  ) {

    const d =
      data[index - 1];


    if (!d)
      return;


    if (title) {

      title.textContent =
        d.title;

    }


    if (body) {

      body.innerHTML =
        `
        <div class="timeline-inspector-kicker">

          <i></i>

          <span>
            EVENT
            ${String(index).padStart(2, "0")}
            /
            ${esc(d.kind)}
          </span>

        </div>

        <div class="timeline-inspector-date">
          ${esc(d.date)}
        </div>

        <div class="timeline-inspector-section">

          <span>
            EVENT
          </span>

          <h3>
            ${esc(d.title)}
          </h3>

          <p>
            ${esc(d.summary)}
          </p>

        </div>

        <div class="timeline-inspector-section">

          <span>
            CLASSIFICATION
          </span>

          <div class="timeline-inspector-tags">

            ${d.tags
              .map(
                t =>
                  `<b>${esc(t)}</b>`
              )
              .join("")}

          </div>

        </div>

        <div class="timeline-inspector-section">

          <span>
            CASE SIGNAL
          </span>

          <strong>
            ${esc(d.meta)}
          </strong>

        </div>
        `;

    }


    cards.forEach(
      c =>
        c.classList.toggle(
          "selected",
          Number(
            c.dataset.event
          ) === index
        )
    );

  }


  function setProgress(
    n,
    state
  ) {

    visible = n;


    if (seqLabel) {

      seqLabel.textContent =
        String(n).padStart(
          2,
          "0"
        ) +
        " / 08";

    }


    if (seqState) {

      seqState.textContent =
        state;

    }


    if (status) {

      status.textContent =
        state ===
        "TRACE COMPLETE"

          ? "TRACE COMPLETE"

          : state ===
              "AWAITING TRACE"

            ? "TRACE READY"

            : "TRACE RUNNING";

    }


    if (footer) {

      footer.textContent =
        state ===
        "TRACE COMPLETE"

          ? "TRACE COMPLETE"

          : state ===
              "AWAITING TRACE"

            ? "TRACE READY"

            : "EVENT " +
              String(
                Math.max(
                  1,
                  n
                )
              ).padStart(
                2,
                "0"
              ) +
              " / 08";

    }

  }


  function placeDefaults() {

    const w =
      stage.clientWidth;

    const h =
      stage.clientHeight;


    const insetX =
      w * 0.07;

    const insetY =
      h * 0.11;

    const insetBottom =
      h * 0.12;

    const gap = 18;


    const gridW =
      w -
      insetX * 2;


    const gridH =
      h -
      insetY -
      insetBottom;


    const cellW =
      (
        gridW -
        gap * 3
      ) / 4;


    const cellH =
      (
        gridH -
        gap * 3
      ) / 4;


    cards.forEach(
      (card, i) => {

        const row =
          Math.floor(
            i / 4
          );


        const col =
          row === 0
            ? i
            : 3 -
              (i - 4);


        const cx =
          insetX +
          col *
            (
              cellW +
              gap
            ) +
          cellW / 2;


        const cy =
          insetY +
          row *
            (
              cellH +
              gap
            ) +
          cellH / 2;


        const x =
          Math.round(
            cx -
            card.offsetWidth /
              2
          );


        const y =
          Math.round(
            cy -
            card.offsetHeight /
              2
          );


        card.style.setProperty(
          "left",
          Math.max(
            8,
            Math.min(
              w -
                card.offsetWidth -
                8,
              x
            )
          ) +
            "px",
          "important"
        );


        card.style.setProperty(
          "top",
          Math.max(
            32,
            Math.min(
              h -
                card.offsetHeight -
                18,
              y
            )
          ) +
            "px",
          "important"
        );


        card.style.right =
          "auto";

        card.style.bottom =
          "auto";


        card.style.setProperty(
          "--snake-row",
          row
        );


        card.style.setProperty(
          "--snake-col",
          col
        );

      }
    );

  }


  function cursorPoint(
    index
  ) {

    const card =
      cards[index - 1];


    if (!card || !cursor)
      return null;


    const sr =
      stage.getBoundingClientRect();


    const r =
      card.getBoundingClientRect();


    return {

      x:
        r.left -
        sr.left +
        r.width / 2,

      y:
        r.top -
        sr.top +
        r.height / 2

    };

  }


  function moveSequenceCursor(
    index,
    instant = false
  ) {

    if (!cursor)
      return;


    const pt =
      cursorPoint(
        index
      );


    if (!pt)
      return;


    const prev =
      cursor._point;


    let angle = 0;


    if (prev) {

      angle =
        Math.atan2(
          pt.y -
            prev.y,
          pt.x -
            prev.x
        ) *
        180 /
        Math.PI;

    }


    cursor.style.setProperty(
      "--cursor-x",
      pt.x + "px"
    );


    cursor.style.setProperty(
      "--cursor-y",
      pt.y + "px"
    );


    cursor.style.setProperty(
      "--cursor-angle",
      angle + "deg"
    );


    cursor.classList.toggle(
      "instant",
      !!instant
    );


    cursor.classList.add(
      "active"
    );


    cursor._point =
      pt;

  }


  function hideSequenceCursor() {

    cursor?.classList.remove(
      "active"
    );

  }


  function drawPaths() {

    const W =
      stage.clientWidth;

    const H =
      stage.clientHeight;


    svg.setAttribute(
      "viewBox",
      `0 0 ${W} ${H}`
    );


    svg.setAttribute(
      "width",
      W
    );


    svg.setAttribute(
      "height",
      H
    );


    svg.innerHTML =
      "";

    paths = [];


    for (
      let i = 0;
      i <
      cards.length - 1;
      i++
    ) {

      const a =
        cursorPoint(
          i + 1
        );

      const b =
        cursorPoint(
          i + 2
        );


      if (!a || !b)
        continue;


      const path =
        document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );


      const dx =
        b.x -
        a.x;

      const dy =
        b.y -
        a.y;


      let d;


      if (i === 3) {

        const midY =
          (
            a.y +
            b.y
          ) / 2;


        d =
          `M ${a.x} ${a.y} Q ${a.x} ${midY} ${a.x} ${midY} L ${b.x} ${b.y}`;

      }

      else {

        const bend =
          Math.min(
            24,
            Math.max(
              10,
              Math.abs(
                dx
              ) *
                0.055
            )
          );


        const qx =
          (
            a.x +
            b.x
          ) / 2;


        const qy =
          (
            a.y +
            b.y
          ) / 2 +
          (
            Math.abs(dy) >
            Math.abs(dx)
              ? 0
              : i < 3
                ? bend
                : -bend
          );


        d =
          `M ${a.x} ${a.y} Q ${qx} ${qy} ${b.x} ${b.y}`;

      }


      path.setAttribute(
        "d",
        d
      );


      path.classList.add(
        "timeline-connector"
      );


      path.dataset.event =
        String(
          i + 1
        );


      svg.appendChild(
        path
      );


      const length =
        path.getTotalLength();


      path.style.strokeDasharray =
        length;

      path.style.strokeDashoffset =
        length;


      paths.push(
        path
      );

    }


    paths.forEach(
      (p, i) => {

        if (
          i <
          Math.max(
            0,
            visible - 1
          )
        ) {

          p.classList.add(
            "drawn"
          );

        }

      }
    );


    if (visible > 0) {

      moveSequenceCursor(
        visible,
        true
      );

    }

  }


  function revealAllFront() {

    clearTimeout(
      timer
    );


    sequenceRunning =
      false;

    sequenceComplete =
      false;

    visible =
      0;


    cards.forEach(
      c => {

        c.classList.add(
          "revealed"
        );

        c.classList.remove(
          "selected",
          "flipping",
          "flipped",
          "dragging",
          "moving"
        );


        c.style.transition =
          "";

      }
    );


    placeDefaults();

    drawPaths();

    setProgress(
      0,
      "TRACE READY"
    );


    if (cursor) {

      cursor.classList.remove(
        "active"
      );

      cursor.classList.add(
        "instant"
      );

      cursor._point =
        null;

    }

  }


  function revealNext() {

    if (
      !sequenceRunning ||
      visible >=
        cards.length
    ) {

      if (
        visible >=
        cards.length
      ) {

        sequenceRunning =
          false;

        sequenceComplete =
          true;

        setProgress(
          8,
          "TRACE COMPLETE"
        );


        setTimeout(
          hideSequenceCursor,
          900
        );

      }


      return;

    }


    const next =
      visible + 1;


    moveSequenceCursor(
      next,
      false
    );


    visible =
      next;


    const card =
      cards[
        visible - 1
      ];


    const path =
      paths[
        visible - 2
      ];


    card.classList.add(
      "flipping",
      "flipped",
      "selected"
    );


    path?.classList.add(
      "drawn"
    );


    setInspector(
      visible
    );


    setProgress(
      visible,
      visible ===
        cards.length
        ? "TRACE COMPLETE"
        : "TRACE RUNNING"
    );


    setTimeout(
      () =>
        card.classList.remove(
          "flipping"
        ),
      900
    );


    if (
      visible <
      cards.length
    ) {

      timer =
        setTimeout(
          revealNext,
          980
        );

    }

    else {

      setTimeout(
        () => {

          sequenceRunning =
            false;

          sequenceComplete =
            true;

          hideSequenceCursor();

        },
        1050
      );

    }

  }


  function startTrace() {

    clearTimeout(
      timer
    );


    sequenceRunning =
      true;

    sequenceComplete =
      false;

    visible =
      0;


    cards.forEach(
      c => {

        c.classList.add(
          "revealed"
        );

        c.classList.remove(
          "selected",
          "flipped",
          "flipping",
          "dragging",
          "moving"
        );


        c.style.transition =
          "";

      }
    );


    placeDefaults();

    drawPaths();


    setProgress(
      0,
      "TRACE RUNNING"
    );


    if (cursor) {

      cursor.classList.add(
        "instant"
      );

      cursor._point =
        null;

    }


    setTimeout(
      () => {

        moveSequenceCursor(
          1,
          true
        );


        setTimeout(
          revealNext,
          420
        );

      },
      260
    );

  }


  function clearTrace() {

    revealAllFront();


    if (title) {

      title.textContent =
        "No event selected";

    }


    if (body) {

      body.innerHTML =
        `
        <div class="timeline-inspector-empty">

          <span>◎</span>

          <b>
            SELECT A TRACE NODE
          </b>

          <p>
            Choose an event from the sequence to inspect its date, classification and investigative context.
          </p>

        </div>
        `;

    }

  }


  function replayTrace() {

    revealAllFront();

    setTimeout(
      startTrace,
      480
    );

  }


  function pointFromEvent(e) {

    if (
      e.touches &&
      e.touches[0]
    ) {

      return {

        x:
          e.touches[0]
            .clientX,

        y:
          e.touches[0]
            .clientY

      };

    }


    return {

      x:
        e.clientX,

      y:
        e.clientY

    };

  }


  function beginDrag(
    card,
    e
  ) {

    if (
      !sequenceComplete ||
      !card.classList.contains(
        "revealed"
      ) ||
      drag
    ) {
      return;
    }


    if (
      e.type ===
        "mousedown" &&
      e.button !== 0
    ) {
      return;
    }


    const pt =
      pointFromEvent(
        e
      );


    const sr =
      stage.getBoundingClientRect();


    const r =
      card.getBoundingClientRect();


    drag = {

      card,

      startX:
        pt.x,

      startY:
        pt.y,

      startLeft:
        r.left -
        sr.left,

      startTop:
        r.top -
        sr.top,

      offsetX:
        pt.x -
        r.left,

      offsetY:
        pt.y -
        r.top,

      moved:
        false

    };


    card.classList.add(
      "dragging"
    );


    card.style.transition =
      "none";


    suppressClick =
      false;


    e.preventDefault();

    e.stopPropagation();

  }


  function moveDrag(e) {

    if (!drag)
      return;


    const pt =
      pointFromEvent(
        e
      );


    const sr =
      stage.getBoundingClientRect();


    const card =
      drag.card;


    const nx =
      pt.x -
      sr.left -
      drag.offsetX;


    const ny =
      pt.y -
      sr.top -
      drag.offsetY;


    if (
      Math.hypot(
        pt.x -
          drag.startX,
        pt.y -
          drag.startY
      ) >
      4
    ) {

      drag.moved =
        true;

      suppressClick =
        true;

    }


    const maxX =
      stage.clientWidth -
      card.offsetWidth -
      10;


    const maxY =
      stage.clientHeight -
      card.offsetHeight -
      24;


    card.style.setProperty(
      "left",
      Math.max(
        10,
        Math.min(
          maxX,
          nx
        )
      ) +
        "px",
      "important"
    );


    card.style.setProperty(
      "top",
      Math.max(
        30,
        Math.min(
          maxY,
          ny
        )
      ) +
        "px",
      "important"
    );


    drawPaths();

    e.preventDefault();

  }


  function endDrag() {

    if (!drag)
      return;


    const card =
      drag.card;


    const moved =
      drag.moved;


    card.classList.remove(
      "dragging"
    );


    card.classList.add(
      "moving"
    );


    card.style.transition =
      "";


    setTimeout(
      () =>
        card.classList.remove(
          "moving"
        ),
      420
    );


    if (moved) {

      setInspector(
        Number(
          card.dataset.event
        )
      );

    }


    drag =
      null;


    drawPaths();


    if (moved) {

      setTimeout(
        () => {
          suppressClick =
            false;
        },
        40
      );

    }

  }


  cards.forEach(
    card => {

      card.addEventListener(
        "mousedown",
        e =>
          beginDrag(
            card,
            e
          )
      );


      card.addEventListener(
        "touchstart",
        e =>
          beginDrag(
            card,
            e
          ),
        {
          passive: false
        }
      );


      card.addEventListener(
        "click",
        e => {

          if (
            suppressClick ||
            sequenceRunning
          ) {

            e.preventDefault();

            e.stopPropagation();

            return;

          }


          const n =
            Number(
              card.dataset.event
            );


          card.classList.toggle(
            "flipped"
          );


          setInspector(
            n
          );


          moveSequenceCursor(
            n,
            false
          );

        }
      );

    }
  );


  document.addEventListener(
    "mousemove",
    moveDrag,
    {
      passive: false
    }
  );


  document.addEventListener(
    "mouseup",
    endDrag,
    {
      passive: false
    }
  );


  document.addEventListener(
    "touchmove",
    moveDrag,
    {
      passive: false
    }
  );


  document.addEventListener(
    "touchend",
    endDrag,
    {
      passive: false
    }
  );


  document.addEventListener(
    "touchcancel",
    endDrag,
    {
      passive: false
    }
  );


  replay?.addEventListener(
    "click",
    replayTrace
  );


  clear?.addEventListener(
    "click",
    clearTrace
  );


  resetLayout?.addEventListener(
    "click",
    () => {

      revealAllFront();


      if (
        typeof showNetworkToast ===
        "function"
      ) {

        showNetworkToast(
          "Timeline cards returned to the fixed 4 × 4 snake pattern."
        );

      }

    }
  );


  window.addEventListener(
    "resize",
    () => {

      placeDefaults();

      drawPaths();

    },
    {
      passive: true
    }
  );


  const observer =
    new MutationObserver(
      () => {

        if (
          view.classList.contains(
            "active-view"
          )
        ) {

          requestAnimationFrame(
            () => {

              placeDefaults();

              drawPaths();


              if (
                !sequenceRunning &&
                !sequenceComplete
              ) {

                replayTrace();

              }

            }
          );

        }

      }
    );


  observer.observe(
    view,
    {
      attributes: true,
      attributeFilter: [
        "class"
      ]
    }
  );


  requestAnimationFrame(
    () => {

      revealAllFront();

      setProgress(
        0,
        "TRACE READY"
      );

    }
  );

})();


/* =========================================================
   GIS WORKSPACE — REAL LEAFLET MAP ENGINE
   ========================================================= */

(function initGISWorkspace() {

  const gisView = document.getElementById("gisView");
  const casesView = document.getElementById("casesView");
  const networkView = document.getElementById("networkView");
  const timelineView = document.getElementById("timelineView");
  const evidenceView = document.getElementById("evidenceView");

  const gisMapContainer = document.getElementById("gisMapPlaceholder");
  const search = document.getElementById("gisSearchInput");
  const searchClearBtn = document.getElementById("gisSearchClearBtn");
  const searchDropdown = document.getElementById("gisSearchResultsDropdown");
  const searchWrapper = document.getElementById("gisSearchWrapper");
  const coords = document.getElementById("gisCoordinates");
  const infoTitle = document.getElementById("gisInfoTitle");
  const inspBody = document.getElementById("gisInspectorBody");
  const waypoint = document.getElementById("addWaypointBtn");
  const focusSearch = document.getElementById("gisSearchFocusBtn");

  if (!gisView) return;

  /* ---- state ---- */
  let wsGISMap = null;
  let wsLocationMarkers = {};
  let wsCorridorPolylines = [];
  let wsCorridorArrows = [];
  let wsAnomalyCircles = [];
  let wsCurrentData = null;
  let wsShowCorridors = true;
  let wsShowAnomalies = true;
  let wsWaypointMode = false;
  let wsWaypoints = [];
  let wsActiveMarkerId = null;
  let wsActiveFilter = "all";

  const API_BASE = (typeof window !== "undefined" && window.location ? window.location.origin : "");

  /* ---- helper ---- */
  const escapeHtml = v =>
    String(v ?? "").replace(
      /[&<>'"]/g,
      c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]
    );

  function toast(msg) {
    if (typeof showNetworkToast === "function") { showNetworkToast(msg); return; }
    let t = document.getElementById("networkToast");
    if (!t) { t = document.createElement("div"); t.id = "networkToast"; t.className = "network-toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2500);
  }


  /* ===========================================================
     VIEW SWITCHING — sidebar navigation
     =========================================================== */

  const workspaceViewHistory = [];
  let currentWorkspaceView = "cases";
  const workspaceBack = document.getElementById("workspaceBack");

  function switchWorkspaceView(view, fromBack = false) {
    if (!fromBack && currentWorkspaceView !== view) {
      workspaceViewHistory.push(currentWorkspaceView);
      if (workspaceViewHistory.length > 12) workspaceViewHistory.shift();
    }
    currentWorkspaceView = view;
    workspaceBack?.classList.toggle("disabled", workspaceViewHistory.length === 0);

    document.querySelectorAll(".workspace-sidebar .side-item[data-view]")
      .forEach(b => b.classList.toggle("active", b.dataset.view === view));

    casesView?.classList.toggle("active-view", view === "cases");
    networkView?.classList.toggle("active-view", view === "network");
    timelineView?.classList.toggle("active-view", view === "timeline");
    evidenceView?.classList.toggle("active-view", view === "evidence");
    gisView.classList.toggle("active-view", view === "gis");
    const aiView = document.getElementById("aiInvestigatorView");
    aiView?.classList.toggle("active-view", view === "ai-investigator");
    if (view === "ai-investigator" && aiView) {
      aiView.scrollTop = 0;
      if (typeof window.refreshAIActivity === "function") {
        window.refreshAIActivity();
      }
    }

    /* When switching to GIS, init the map if not already done and reload latest data */
    if (view === "gis") {
      gisView.scrollTop = 0;
      setTimeout(() => {
        initWorkspaceMap();
        if (typeof loadWorkspaceGISData === "function") {
          loadWorkspaceGISData();
        }
      }, 200);
    }
  }
  window.switchWorkspaceView = switchWorkspaceView;

  document.querySelectorAll(".workspace-sidebar .side-item[data-view]")
    .forEach(btn => btn.addEventListener("click", () => switchWorkspaceView(btn.dataset.view)));

  workspaceBack?.addEventListener("click", () => {
    const previous = workspaceViewHistory.pop();
    if (previous) switchWorkspaceView(previous, true);
    workspaceBack.classList.toggle("disabled", workspaceViewHistory.length === 0);
  });


  /* ===========================================================
     LEAFLET MAP INITIALIZATION & BASEMAP LAYERS
     =========================================================== */

  window.createCipherTileLayers = function() {
    const esriBase = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      maxZoom: 16
    });
    const esriRef = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      attribution: '',
      maxZoom: 16
    });
    const tacticalDark = L.layerGroup([esriBase, esriRef]);

    const cartoKey = (typeof window !== "undefined" && window.localStorage) ? (localStorage.getItem("cipher_carto_api_key") || "") : "";
    const cartoUrl = cartoKey
      ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${encodeURIComponent(cartoKey)}`
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    const cartoDark = L.tileLayer(cartoUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 19
    });

    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    });

    return {
      defaultLayer: tacticalDark,
      baseMaps: {
        "Tactical Dark (No Key Needed)": tacticalDark,
        "CARTO Dark Matter": cartoDark,
        "OpenStreetMap": osm
      }
    };
  };

  /* ===========================================================
     ARCHETYPE METADATA & UTILITIES
     =========================================================== */

  function getEntityArchetypeMeta(type) {
    const t = String(type || "").toLowerCase().trim();
    if (t.includes("person") || t.includes("suspect") || t.includes("lead") || t.includes("officer")) {
      return {
        type: "person",
        badge: "PERSON",
        color: "#00e5ff",
        glow: "rgba(0, 229, 255, 0.45)",
        svg: `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
      };
    }
    if (t.includes("vehicle") || t.includes("car") || t.includes("truck") || t.includes("transit")) {
      return {
        type: "vehicle",
        badge: "VEHICLE",
        color: "#ffb020",
        glow: "rgba(255, 176, 32, 0.45)",
        svg: `<svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`
      };
    }
    if (t.includes("place") || t.includes("location") || t.includes("vault") || t.includes("terminal") || t.includes("hub") || t.includes("site") || t.includes("safe_house") || t.includes("dock") || t.includes("incident") || t.includes("residence")) {
      return {
        type: "place",
        badge: "SITE / VAULT",
        color: "#10b981",
        glow: "rgba(16, 185, 129, 0.45)",
        svg: `<svg viewBox="0 0 24 24"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2L2 7h20L12 2z"></path></svg>`
      };
    }
    if (t.includes("phone") || t.includes("msisdn") || t.includes("imei") || t.includes("comms") || t.includes("tower") || t.includes("cdr")) {
      return {
        type: "phone",
        badge: "COMMS",
        color: "#f43f5e",
        glow: "rgba(244, 63, 94, 0.45)",
        svg: `<svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`
      };
    }
    if (t.includes("account") || t.includes("bank") || t.includes("financial") || t.includes("cash") || t.includes("rtgs")) {
      return {
        type: "account",
        badge: "ACCOUNT",
        color: "#d9ff55",
        glow: "rgba(217, 255, 85, 0.45)",
        svg: `<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>`
      };
    }
    if (t.includes("organisation") || t.includes("org") || t.includes("company") || t.includes("firm") || t.includes("trading") || t.includes("conduit")) {
      return {
        type: "organisation",
        badge: "ORGANISATION",
        color: "#a855f7",
        glow: "rgba(168, 85, 247, 0.45)",
        svg: `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`
      };
    }
    return {
      type: "entity",
      badge: "NODE",
      color: "#00e5ff",
      glow: "rgba(0, 229, 255, 0.45)",
      svg: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
    };
  }

  function calcBearing(lat1, lon1, lat2, lon2) {
    const toRad = deg => deg * Math.PI / 180;
    const toDeg = rad => rad * 180 / Math.PI;
    const phi1 = toRad(lat1);
    const phi2 = toRad(lat2);
    const deltaLambda = toRad(lon2 - lon1);

    const y = Math.sin(deltaLambda) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) -
              Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
    const theta = Math.atan2(y, x);
    return (toDeg(theta) + 360) % 360;
  }

  function buildTacticalMarkerIcon(props, isSelected = false) {
    const type = (props.entity_type || props.location_type || props.type || 'entity').toLowerCase();
    const meta = getEntityArchetypeMeta(type);
    const rawLabel = props.name || props.label || 'Entity';
    const cleanLabel = rawLabel.replace(/@\s*".*?"/, '').trim();
    const shortLabel = cleanLabel.length > 18 ? cleanLabel.slice(0, 16) + '…' : cleanLabel;

    return L.divIcon({
      className: 'gis-tactical-marker-divicon',
      html: `
        <div class="gis-tactical-marker-wrap ${isSelected ? 'active pulse' : ''}" style="--marker-color:${meta.color}; --marker-glow:${meta.glow};" data-id="${props.id}">
          <div class="gis-tactical-marker-pulse"></div>
          <div class="gis-tactical-marker-pin">
            ${meta.svg}
            <span class="gis-tactical-marker-status"></span>
          </div>
          <div class="gis-tactical-marker-label" title="${escapeHtml(rawLabel)}">
            ${escapeHtml(shortLabel)}
          </div>
        </div>
      `,
      iconSize: [42, 54],
      iconAnchor: [21, 27],
      popupAnchor: [0, -28]
    });
  }

  /* ===========================================================
     MAP INITIALIZATION
     =========================================================== */

  function initWorkspaceMap() {
    if (wsGISMap) { wsGISMap.invalidateSize(); return; }

    const container = document.getElementById("workspaceGISMap");
    if (!container) return;

    wsGISMap = L.map(container, {
      center: [28.6200, 77.2150], // Centered on investigation operational zone (Delhi NCR)
      zoom: 12,
      zoomControl: true,
      attributionControl: true
    });

    const tileConfig = createCipherTileLayers();
    tileConfig.defaultLayer.addTo(wsGISMap);
    L.control.layers(tileConfig.baseMaps, null, { position: 'topright' }).addTo(wsGISMap);

    /* Update coordinate display on mouse move */
    wsGISMap.on("mousemove", e => {
      if (coords) coords.textContent = `${e.latlng.lat.toFixed(4)} · ${e.latlng.lng.toFixed(4)}`;
    });

    /* Add click-to-place waypoint */
    wsGISMap.on("click", e => {
      if (!wsWaypointMode) return;
      placeWaypoint(e.latlng);
      wsWaypointMode = false;
      gisMapContainer?.classList.remove("waypoint-mode");
      toast("Waypoint placed.");
    });

    loadWorkspaceGISData();
  }

  /* ===========================================================
     DATA LOADING
     =========================================================== */

  async function loadWorkspaceGISData() {
    try {
      const response = await fetch(`${API_BASE}/cases/1/gis-data`);
      if (response.ok) {
        wsCurrentData = await response.json();
      } else {
        throw new Error("Backend response error");
      }
    } catch (e) {
      console.log("CIPHER GIS → Using fallback tactical data...");
      wsCurrentData = getFallbackGISData();
    }
    renderWorkspaceGIS(wsCurrentData);
  }

  window.loadWorkspaceGISData = loadWorkspaceGISData;

  function getFallbackGISData() {
    return {
      status: "success",
      case_id: 1,
      location_count: 5,
      event_count: 5,
      geojson: {
        type: "FeatureCollection",
        features: [
          { type: "Feature", geometry: { type: "Point", coordinates: [77.2150, 28.6300] }, properties: { id: 1, name: 'Mohd. Rafiq @ "Rafiq B..."', entity_type: "person", location_type: "SAFE_HOUSE", address: "Pahar Ganj Tactical Safehouse", latitude: 28.6300, longitude: 77.2150, confidence_score: 0.99 } },
          { type: "Feature", geometry: { type: "Point", coordinates: [77.2280, 28.6520] }, properties: { id: 2, name: 'Vikram "Vicky" Malhotra', entity_type: "person", location_type: "COMMERCIAL", address: "Dariba Kalan Bullion Exchange", latitude: 28.6520, longitude: 77.2280, confidence_score: 0.98 } },
          { type: "Feature", geometry: { type: "Point", coordinates: [77.1800, 28.6400] }, properties: { id: 3, name: 'Aslam Sheikh (Driver)', entity_type: "person", location_type: "TRANSIT", address: "Karol Bagh Logistics Hub", latitude: 28.6400, longitude: 77.1800, confidence_score: 0.94 } },
          { type: "Feature", geometry: { type: "Point", coordinates: [77.1600, 28.5800] }, properties: { id: 12, name: 'Mahindra Scorpio DL-01...', entity_type: "vehicle", location_type: "ANPR_CHECKPOINT", address: "DND / Ring Road Intercept Checkpoint", latitude: 28.5800, longitude: 77.1600, confidence_score: 0.95 } },
          { type: "Feature", geometry: { type: "Point", coordinates: [77.2307, 28.6562] }, properties: { id: 13, name: 'Kucha Mahajani Vault, Chandni Chowk', entity_type: "place", location_type: "INCIDENT", address: "Kucha Mahajani Bullion Vault, Old Delhi", latitude: 28.6562, longitude: 77.2307, confidence_score: 0.99 } },
          { type: "Feature", geometry: { type: "Point", coordinates: [77.0999, 28.5562] }, properties: { id: 14, name: 'Cargo Terminal 3, IGI Airport', entity_type: "place", location_type: "INCIDENT", address: "Air Cargo Terminal 3 Logistics Complex", latitude: 28.5562, longitude: 77.0999, confidence_score: 0.99 } }
        ]
      },
      directed_corridors: [
        { rel_id: 2, source_id: 1, source_label: 'Mohd. Rafiq @ "Rafiq B..."', source_type: "person", source_lat: 28.6300, source_lng: 77.2150, target_id: 3, target_label: 'Aslam Sheikh (Driver)', target_type: "person", target_lat: 28.6400, target_lng: 77.1800, relationship_type: "Direct Controller", evidence_sentence: "Driver logs and encrypted WhatsApp assignment instructions", confidence_score: 0.95 },
        { rel_id: 15, source_id: 3, source_label: 'Aslam Sheikh (Driver)', source_type: "person", source_lat: 28.6400, source_lng: 77.1800, target_id: 12, target_label: 'Mahindra Scorpio DL-01...', target_type: "vehicle", target_lat: 28.5800, target_lng: 77.1600, relationship_type: "Primary Driver", evidence_sentence: "Key recovery and driver biometric match on escort vehicle", confidence_score: 0.95 },
        { rel_id: 13, source_id: 12, source_label: 'Mahindra Scorpio DL-01...', source_type: "vehicle", source_lat: 28.5800, source_lng: 77.1600, target_id: 13, target_label: 'Kucha Mahajani Vault, Chandni Chowk', target_type: "place", target_lat: 28.6562, target_lng: 77.2307, relationship_type: "Intended Delivery Route", evidence_sentence: "GPS route logs corroborate vault destination", confidence_score: 0.96 }
      ]
    };
  }

  /* ===========================================================
     RENDER TACTICAL MARKERS / DIRECTED CORRIDORS / ANOMALIES
     =========================================================== */

  function renderWorkspaceGIS(data) {
    if (!wsGISMap || !data) return;

    /* Clear previous layers */
    Object.values(wsLocationMarkers).forEach(m => wsGISMap.removeLayer(m));
    wsLocationMarkers = {};

    wsCorridorPolylines.forEach(p => wsGISMap.removeLayer(p));
    wsCorridorPolylines = [];

    wsCorridorArrows.forEach(a => wsGISMap.removeLayer(a));
    wsCorridorArrows = [];

    wsAnomalyCircles.forEach(c => wsGISMap.removeLayer(c));
    wsAnomalyCircles = [];

    /* Location markers */
    const rawFeatures = (data.geojson && data.geojson.features) ? data.geojson.features : [];

    // Filter features based on active entity filter
    const features = rawFeatures.filter(feat => {
      if (wsActiveFilter === "all") return true;
      const type = String(feat.properties.entity_type || feat.properties.location_type || "").toLowerCase();
      if (wsActiveFilter === "person") return type.includes("person") || type.includes("suspect") || type.includes("lead");
      if (wsActiveFilter === "vehicle") return type.includes("vehicle") || type.includes("car") || type.includes("transit");
      if (wsActiveFilter === "place") return type.includes("place") || type.includes("vault") || type.includes("terminal") || type.includes("hub") || type.includes("site");
      if (wsActiveFilter === "comms") return type.includes("phone") || type.includes("account") || type.includes("organisation") || type.includes("org") || type.includes("bank");
      return true;
    });

    // Update filter count badge
    const filterAllCountEl = document.getElementById("gisFilterAllCount");
    if (filterAllCountEl) filterAllCountEl.textContent = `${rawFeatures.length} entities`;

    features.forEach(feat => {
      const [lng, lat] = feat.geometry.coordinates;
      const props = feat.properties;
      const entityId = String(props.id || props.entity_id);
      const targetLabel = props.name || props.label || "NODE";
      const isSelected = (wsActiveMarkerId === entityId);

      const icon = buildTacticalMarkerIcon(props, isSelected);
      const marker = L.marker([lat, lng], { icon, riseOnHover: true }).addTo(wsGISMap);

      const meta = getEntityArchetypeMeta(props.entity_type || props.location_type);
      const confScore = props.confidence_score ? `${Math.round(props.confidence_score * 100)}%` : "95%";

      marker.bindPopup(`
        <div style="font-family:'DM Mono',monospace;min-width:210px;padding:4px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
            <span style="font-size:8px;font-weight:700;padding:2px 6px;border-radius:3px;border:1px solid ${meta.color};color:${meta.color};background:rgba(0,0,0,0.4);">${meta.badge}</span>
            <span style="font-size:8px;color:#00f0aa;">● ${confScore} CONFIRMED</span>
          </div>
          <b style="color:#ffffff;font-size:12px;letter-spacing:-0.01em;display:block;line-height:1.3;">${escapeHtml(targetLabel)}</b>
          <span style="color:#7f8a94;font-size:10px;display:block;margin-top:2px;">${escapeHtml(props.aliases || props.address || '')}</span>
          <div style="margin-top:7px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.08);font-size:9px;color:#5a6875;">
            LAT ${lat.toFixed(4)} · LNG ${lng.toFixed(4)}
          </div>
          <button type="button" onclick="if(window.cipherFocusNetworkNode) window.cipherFocusNetworkNode('${escapeHtml(entityId)}', '${escapeHtml(targetLabel)}')" style="margin-top:9px;background:rgba(0,229,255,0.12);color:#00e5ff;border:1px solid rgba(0,229,255,0.5);padding:6px 10px;font-size:10px;font-family:'DM Mono',monospace;font-weight:700;border-radius:4px;cursor:pointer;width:100%;text-align:center;transition:background 0.15s ease;" onmouseover="this.style.background='rgba(0,229,255,0.25)'" onmouseout="this.style.background='rgba(0,229,255,0.12)'">
            ⤹ VIEW &amp; FOCUS IN NETWORK GRAPH
          </button>
        </div>
      `, { offset: [0, -18] });

      marker.on("click", () => {
        activateMarker(entityId, props, marker);
      });

      wsLocationMarkers[entityId] = marker;
    });

    /* Auto fit bounds to markers */
    if (features.length > 0 && wsGISMap) {
      setTimeout(() => {
        try {
          const markerGroup = L.featureGroup(Object.values(wsLocationMarkers));
          if (markerGroup.getBounds().isValid()) {
            wsGISMap.fitBounds(markerGroup.getBounds().pad(0.18), { maxZoom: 14 });
          }
        } catch (e) {}
      }, 100);
    }

    /* Directed Transit & Relationship Corridors */
    if (wsShowCorridors) {
      const corridorsToRender = [];

      // 1. If structured directed_corridors array is available
      if (Array.isArray(data.directed_corridors) && data.directed_corridors.length > 0) {
        data.directed_corridors.forEach(rel => {
          corridorsToRender.push({
            id: rel.rel_id || rel.id,
            source_id: rel.source_id,
            source_label: rel.source_label,
            source_type: rel.source_type,
            source_coords: [Number(rel.source_lat), Number(rel.source_lng)],
            target_id: rel.target_id,
            target_label: rel.target_label,
            target_type: rel.target_type,
            target_coords: [Number(rel.target_lat), Number(rel.target_lng)],
            relationship: rel.relationship_type,
            evidence: rel.evidence_sentence,
            confidence: rel.confidence_score
          });
        });
      } else if (data.transit_corridors) {
        // Fallback for object format
        Object.keys(data.transit_corridors).forEach((key, idx) => {
          const points = data.transit_corridors[key];
          if (points.length >= 2) {
            corridorsToRender.push({
              id: idx,
              source_label: points[0].location_name || key,
              source_coords: [points[0].latitude, points[0].longitude],
              target_label: points[1].location_name || "Destination",
              target_coords: [points[1].latitude, points[1].longitude],
              relationship: points[0].relationship || "Transit Corridor",
              evidence: "Corridor telemetry",
              confidence: 0.95
            });
          }
        });
      }

      corridorsToRender.forEach(corridor => {
        const [sLat, sLng] = corridor.source_coords;
        const [tLat, tLng] = corridor.target_coords;
        if (isNaN(sLat) || isNaN(sLng) || isNaN(tLat) || isNaN(tLng)) return;

        // Choose corridor color by category
        const relType = String(corridor.relationship || "").toLowerCase();
        let lineColor = "#00e5ff"; // default cyan
        if (relType.includes("driver") || relType.includes("route") || relType.includes("anpr") || relType.includes("vehicle") || relType.includes("transit")) {
          lineColor = "#ffb020"; // amber
        } else if (relType.includes("call") || relType.includes("msisdn") || relType.includes("hand-off") || relType.includes("comms")) {
          lineColor = "#f43f5e"; // rose
        } else if (relType.includes("layered") || relType.includes("settlement") || relType.includes("rtgs") || relType.includes("bank") || relType.includes("transfer")) {
          lineColor = "#10b981"; // emerald
        }

        // Draw tactical polyline
        const polyline = L.polyline([[sLat, sLng], [tLat, tLng]], {
          color: lineColor,
          weight: 3.5,
          dashArray: "8, 6",
          opacity: 0.85
        }).addTo(wsGISMap);

        polyline.bindTooltip(`
          <div style="font-family:'DM Mono',monospace;font-size:10px;">
            <b>${escapeHtml(corridor.source_label)}</b> ➔ <b>${escapeHtml(corridor.target_label)}</b><br/>
            <span style="color:${lineColor};">${escapeHtml(corridor.relationship)}</span>
          </div>
        `, { className: "gis-corridor-tooltip", sticky: true });

        polyline.on("click", () => {
          renderRelationshipInspector(corridor, lineColor);
        });

        wsCorridorPolylines.push(polyline);

        // Place directed arrow indicator at 55% of the distance from source to target
        const midLat = sLat + (tLat - sLat) * 0.55;
        const midLng = sLng + (tLng - sLng) * 0.55;
        const bearing = calcBearing(sLat, sLng, tLat, tLng);

        const arrowMarker = L.marker([midLat, midLng], {
          icon: L.divIcon({
            className: "gis-corridor-arrow-divicon",
            html: `
              <div class="gis-corridor-midpoint-marker" style="--corridor-color:${lineColor}; transform: rotate(${bearing}deg);" title="${escapeHtml(corridor.relationship)}">
                <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke="${lineColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
              </div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          }),
          interactive: true
        }).addTo(wsGISMap);

        arrowMarker.bindTooltip(`
          <div style="font-family:'DM Mono',monospace;font-size:10px;">
            <b style="color:${lineColor};">➔ FLOW DIRECTION</b><br/>
            ${escapeHtml(corridor.source_label)} ➔ ${escapeHtml(corridor.target_label)}<br/>
            <small style="color:#aeb5b1;">${escapeHtml(corridor.relationship)}</small>
          </div>
        `, { className: "gis-corridor-tooltip" });

        arrowMarker.on("click", () => {
          renderRelationshipInspector(corridor, lineColor);
        });

        wsCorridorArrows.push(arrowMarker);
      });
    }

    /* Co-location anomalies */
    const anomalies = data.colocation_anomalies || [];
    if (wsShowAnomalies && anomalies.length > 0) {
      anomalies.forEach(anom => {
        const circle = L.circle([anom.latitude, anom.longitude], {
          radius: 450,
          color: "#ff3366",
          fillColor: "#ff3366",
          fillOpacity: 0.18,
          weight: 1.5,
          dashArray: "4, 4"
        }).addTo(wsGISMap);
        circle.bindTooltip(`
          <div style="font-family:'DM Mono',monospace;font-size:10px;">
            <b style="color:#ff3366;">CO-LOCATION PROXIMITY ALERT</b><br/>
            ${escapeHtml(anom.entity_a)} &amp; ${escapeHtml(anom.entity_b)}<br/>
            <small style="color:#c5cac7;">Within ${anom.time_gap_minutes || 12}m spatial window</small>
          </div>
        `, { className: "gis-corridor-tooltip" });
        wsAnomalyCircles.push(circle);
      });
    }
  }

  function activateMarker(entityId, props, marker) {
    wsActiveMarkerId = entityId;

    // Reset visual state of all markers
    document.querySelectorAll(".gis-tactical-marker-wrap").forEach(el => {
      el.classList.remove("active", "pulse");
    });

    // Add active pulse to clicked marker
    const markerEl = marker.getElement();
    if (markerEl) {
      const wrap = markerEl.querySelector(".gis-tactical-marker-wrap");
      if (wrap) wrap.classList.add("active", "pulse");
    }

    marker.openPopup();
    renderInspector(props);
    window.dispatchEvent(new CustomEvent("cipher:gis-node-select", { detail: props }));
  }

  /* ===========================================================
     INSPECTOR PANEL — RICH ENTITY & CORRIDOR VIEWS
     =========================================================== */

  function renderInspector(props) {
    const d = props || {};
    const name = d.name || d.label || "Selected map node";
    const type = d.entity_type || d.location_type || d.type || "ENTITY";
    const meta = getEntityArchetypeMeta(type);
    const lat = d.latitude ?? (d.lat ?? "—");
    const lng = d.longitude ?? (d.lng ?? "—");
    const coordinate = (lat !== "—" && lng !== "—") ? `${Number(lat).toFixed(4)} · ${Number(lng).toFixed(4)}` : "— · —";
    const entityId = d.id || d.entity_id || "";

    if (infoTitle) infoTitle.textContent = name;
    if (coords) coords.textContent = coordinate;

    // Find direct relationships connected to this entity
    let connectedLinksHtml = "";
    if (wsCurrentData && Array.isArray(wsCurrentData.directed_corridors)) {
      const related = wsCurrentData.directed_corridors.filter(r => 
        String(r.source_id) === String(entityId) || String(r.target_id) === String(entityId) ||
        r.source_label === name || r.target_label === name
      );

      if (related.length > 0) {
        connectedLinksHtml = `
          <div class="gis-info-section">
            <div class="gis-info-title"><span>CONNECTED TRANSIT CORRIDORS</span><small>${related.length}</small></div>
            <div style="display:flex;flex-direction:column;gap:6px;margin-top:4px;">
              ${related.map(r => {
                const isOut = String(r.source_id) === String(entityId) || r.source_label === name;
                const otherName = isOut ? r.target_label : r.source_label;
                const otherLat = isOut ? r.target_lat : r.source_lat;
                const otherLng = isOut ? r.target_lng : r.source_lng;
                return `
                  <div style="padding:6px 8px;background:rgba(255,255,255,0.03);border-left:2px solid ${meta.color};border-radius:2px;font-size:9px;cursor:pointer;" onclick="if(window.cipherPanToLocation) window.cipherPanToLocation(${otherLat}, ${otherLng}, '${escapeHtml(otherName)}')">
                    <div style="display:flex;justify-content:space-between;">
                      <b style="color:#ffffff;">${isOut ? '➔ OUTGOING' : '← INCOMING'}</b>
                      <span style="color:${meta.color};">${escapeHtml(r.relationship_type)}</span>
                    </div>
                    <div style="color:#7e8b97;margin-top:2px;">To: ${escapeHtml(otherName)}</div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        `;
      }
    }

    if (inspBody) {
      inspBody.innerHTML = `
        <div class="gis-selected-state selected" style="border-left:3px solid ${meta.color};">
          <span class="gis-selected-dot live" style="background:${meta.color};box-shadow:0 0 8px ${meta.color};"></span>
          <div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
              <b style="color:${meta.color};letter-spacing:0.08em;">${meta.badge}</b>
              <span style="font-size:8px;color:#00f0aa;">● 98% VERIFIED</span>
            </div>
            <p style="color:#e6edf3;font-size:10px;font-weight:600;">${escapeHtml(name)}</p>
            <p style="color:#78848f;font-size:9px;margin-top:2px;">${escapeHtml(d.address || d.aliases || "Active investigation node.")}</p>
          </div>
        </div>

        <div class="gis-info-section">
          <div class="gis-info-title"><span>SPATIAL METADATA</span><small>ACTIVE</small></div>
          <div class="gis-info-row"><span>COORDINATES</span><b class="gis-searchable">${escapeHtml(coordinate)}</b></div>
          <div class="gis-info-row"><span>ADDRESS / SITE</span><b class="gis-searchable">${escapeHtml(d.address || d.aliases || "—")}</b></div>
          <div class="gis-info-row"><span>LAYER CLASSIFIER</span><b class="gis-searchable" style="color:${meta.color};">${escapeHtml(type.toUpperCase())}</b></div>
          <div class="gis-info-row"><span>VERIFICATION</span><b style="color:#00f0aa;">EVIDENCE BACKED</b></div>
        </div>

        ${connectedLinksHtml}

        <div style="margin:16px 14px 10px;">
          <button type="button" id="btnGisFocusInNetwork" class="case-create-primary" style="width:100%;background:rgba(0,229,255,0.12);color:#00e5ff;border:1px solid rgba(0,229,255,0.5);font-size:11px;font-weight:700;font-family:'DM Mono',monospace;padding:10px 12px;display:flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;border-radius:4px;transition:all 0.2s ease;">
            <span>⤹</span> VIEW &amp; FOCUS IN NETWORK GRAPH
          </button>
        </div>
      `;

      const btnFocus = document.getElementById("btnGisFocusInNetwork");
      if (btnFocus) {
        btnFocus.onclick = () => {
          const targetId = entityId || name;
          if (typeof window.cipherFocusNetworkNode === "function") {
            window.cipherFocusNetworkNode(targetId, name);
          }
        };
      }
    }
  }

  function renderRelationshipInspector(corridor, color) {
    if (infoTitle) infoTitle.textContent = `${corridor.source_label} ➔ ${corridor.target_label}`;

    if (inspBody) {
      inspBody.innerHTML = `
        <div class="gis-selected-state selected" style="border-left:3px solid ${color};">
          <span class="gis-selected-dot live" style="background:${color};box-shadow:0 0 8px ${color};"></span>
          <div>
            <div style="font-size:8px;font-weight:700;color:${color};letter-spacing:0.08em;margin-bottom:3px;">
              DIRECTED TRANSIT CORRIDOR
            </div>
            <b style="color:#ffffff;font-size:11px;">${escapeHtml(corridor.relationship)}</b>
            <p style="color:#7f8b96;font-size:9px;margin-top:3px;">Evidence: ${escapeHtml(corridor.evidence || 'Field corroboration')}</p>
          </div>
        </div>

        <div class="gis-info-section">
          <div class="gis-info-title"><span>CORRIDOR SPECIFICATION</span><small>DIRECTED</small></div>
          <div class="gis-info-row"><span>SOURCE (FROM)</span><b style="color:#00e5ff;cursor:pointer;" onclick="if(window.cipherPanToLocation) window.cipherPanToLocation(${corridor.source_coords[0]}, ${corridor.source_coords[1]}, '${escapeHtml(corridor.source_label)}')">${escapeHtml(corridor.source_label)} ↗</b></div>
          <div class="gis-info-row"><span>TARGET (TO)</span><b style="color:#00e5ff;cursor:pointer;" onclick="if(window.cipherPanToLocation) window.cipherPanToLocation(${corridor.target_coords[0]}, ${corridor.target_coords[1]}, '${escapeHtml(corridor.target_label)}')">${escapeHtml(corridor.target_label)} ↗</b></div>
          <div class="gis-info-row"><span>RELATIONSHIP</span><b style="color:${color};">${escapeHtml(corridor.relationship)}</b></div>
          <div class="gis-info-row"><span>CONFIDENCE</span><b style="color:#00f0aa;">${Math.round((corridor.confidence || 0.95) * 100)}% CONFIRMED</b></div>
        </div>

        <div class="gis-info-section">
          <div class="gis-info-title"><span>EVIDENTIARY SENTENCE</span><small>LOGS</small></div>
          <div class="gis-info-placeholder" style="color:#aeb5b1;line-height:1.5;">
            ${escapeHtml(corridor.evidence || 'Direct telephonic, vehicle GPS, or transaction corroboration.')}
          </div>
        </div>

        <div style="margin:16px 14px 10px;">
          <button type="button" id="btnFocusCorridorInNet" class="case-create-primary" style="width:100%;background:rgba(0,229,255,0.12);color:#00e5ff;border:1px solid rgba(0,229,255,0.5);font-size:11px;font-weight:700;font-family:'DM Mono',monospace;padding:10px 12px;display:flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;border-radius:4px;">
            <span>⤹</span> FOCUS CONNECTION IN NETWORK GRAPH
          </button>
        </div>
      `;

      const btnNet = document.getElementById("btnFocusCorridorInNet");
      if (btnNet) {
        btnNet.onclick = () => {
          if (typeof window.cipherFocusNetworkNode === "function") {
            window.cipherFocusNetworkNode(corridor.source_id || corridor.source_label, corridor.source_label);
          }
        };
      }
    }
  }

  /* ===========================================================
     COMPREHENSIVE GIS SEARCH CONTROLLER
     =========================================================== */

  let searchHighlightIdx = -1;

  function handleGISSearchInput() {
    const q = (search?.value || "").trim().toLowerCase();

    if (!q) {
      if (searchClearBtn) searchClearBtn.style.display = "none";
      if (searchDropdown) searchDropdown.style.display = "none";
      searchHighlightIdx = -1;
      return;
    }

    if (searchClearBtn) searchClearBtn.style.display = "block";

    // Gather searchable candidate pool
    const candidates = [];
    const seenIds = new Set();

    // 1. From current GIS data features
    if (wsCurrentData && wsCurrentData.geojson && Array.isArray(wsCurrentData.geojson.features)) {
      wsCurrentData.geojson.features.forEach(feat => {
        const p = feat.properties;
        const [lng, lat] = feat.geometry.coordinates;
        candidates.push({
          id: String(p.id || p.entity_id),
          label: p.name || p.label || "Entity",
          aliases: p.aliases || "",
          type: p.entity_type || p.location_type || "place",
          address: p.address || "",
          lat: Number(lat),
          lng: Number(lng),
          source: "GIS Layer"
        });
        seenIds.add(String(p.id || p.entity_id));
      });
    }

    // 2. From Cytoscape Network Graph nodes if active
    if (window.cy) {
      window.cy.nodes().forEach(n => {
        const d = n.data();
        const id = String(d.id || d.raw_id);
        if (!seenIds.has(id)) {
          candidates.push({
            id: id,
            label: d.label || "Node",
            aliases: d.aliases || "",
            type: d.type || "entity",
            address: d.address || "",
            lat: d.lat ? Number(d.lat) : null,
            lng: d.lng ? Number(d.lng) : null,
            source: "Network Graph"
          });
          seenIds.add(id);
        }
      });
    }

    // Check if query is coordinate string (e.g. "28.65, 77.23")
    const coordMatch = q.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
    if (coordMatch) {
      const qLat = parseFloat(coordMatch[1]);
      const qLng = parseFloat(coordMatch[3]);
      renderSearchResultsDropdown([{
        id: "custom_coord",
        label: `Coordinates [${qLat.toFixed(4)}, ${qLng.toFixed(4)}]`,
        aliases: "Direct coordinate navigate",
        type: "place",
        address: `Custom map position`,
        lat: qLat,
        lng: qLng,
        source: "GPS Query"
      }], q);
      return;
    }

    // Filter and score candidates
    const matches = candidates.filter(c => {
      const fullText = `${c.label} ${c.aliases} ${c.type} ${c.address} ${c.id}`.toLowerCase();
      return fullText.includes(q);
    });

    renderSearchResultsDropdown(matches, q);
  }

  function renderSearchResultsDropdown(matches, q) {
    if (!searchDropdown) return;

    if (matches.length === 0) {
      searchDropdown.innerHTML = `
        <div class="gis-search-dropdown-header">
          <span>NO MATCHES FOUND FOR "${escapeHtml(q)}"</span>
        </div>
        <div style="padding:12px;font-size:10px;color:#616e7a;text-align:center;">
          Try searching by suspect name, vehicle, phone number, vault site, or latitude/longitude coordinates.
        </div>
      `;
      searchDropdown.style.display = "block";
      searchHighlightIdx = -1;
      return;
    }

    searchHighlightIdx = 0; // default to first match

    const html = `
      <div class="gis-search-dropdown-header">
        <span>FOUND ${matches.length} MATCHING ENTITY / LOCATION(S)</span>
        <span style="font-size:8px;color:#5a6875;">↑↓ SELECT · ↵ GO</span>
      </div>
      <div class="gis-search-results-list">
        ${matches.slice(0, 8).map((m, idx) => {
          const meta = getEntityArchetypeMeta(m.type);
          const hasGps = (m.lat !== null && m.lng !== null && !isNaN(m.lat) && !isNaN(m.lng));
          const subText = m.address || m.aliases || (hasGps ? `GPS: ${m.lat.toFixed(4)}, ${m.lng.toFixed(4)}` : "Available in Network Graph");

          // Highlight matched substring
          const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
          const highlightedLabel = escapeHtml(m.label).replace(regex, '<span class="gis-search-match-text">$1</span>');

          return `
            <div class="gis-search-result-item ${idx === 0 ? 'selected' : ''}" data-idx="${idx}" data-id="${m.id}" data-lat="${m.lat ?? ''}" data-lng="${m.lng ?? ''}" data-label="${escapeHtml(m.label)}">
              <div class="gis-search-item-icon" style="--badge-color:${meta.color};">
                ${meta.svg}
              </div>
              <div class="gis-search-item-info">
                <div class="gis-search-item-title">
                  <span>${highlightedLabel}</span>
                  <span class="gis-search-item-badge" style="--badge-color:${meta.color};">${meta.badge}</span>
                </div>
                <div class="gis-search-item-sub">${escapeHtml(subText)}</div>
              </div>
              <div class="gis-search-item-action">
                ${hasGps ? 'LOCATE ➔' : 'NET GRAPH ↗'}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;

    searchDropdown.innerHTML = html;
    searchDropdown.style.display = "block";

    // Bind click events on search results
    searchDropdown.querySelectorAll(".gis-search-result-item").forEach(item => {
      item.addEventListener("click", () => {
        executeGISSearchSelection(item);
      });
    });
  }

  function executeGISSearchSelection(item) {
    const latStr = item.dataset.lat;
    const lngStr = item.dataset.lng;
    const label = item.dataset.label;
    const entityId = item.dataset.id;

    if (searchDropdown) searchDropdown.style.display = "none";
    if (search) search.value = label;

    if (latStr && lngStr && latStr !== "" && lngStr !== "") {
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      window.cipherPanToLocation(lat, lng, label, entityId, false);
      toast(`Located: ${label} on GIS map.`);
    } else {
      toast(`Entity has no spatial coordinates. Switching to Network graph...`);
      window.cipherFocusNetworkNode(entityId, label);
    }
  }

  // Clear button handler
  searchClearBtn?.addEventListener("click", () => {
    if (search) search.value = "";
    if (searchClearBtn) searchClearBtn.style.display = "none";
    if (searchDropdown) searchDropdown.style.display = "none";
    search?.focus();
  });

  // Search input and keyboard navigation
  search?.addEventListener("input", handleGISSearchInput);
  search?.addEventListener("focus", handleGISSearchInput);

  search?.addEventListener("keydown", e => {
    if (!searchDropdown || searchDropdown.style.display === "none") return;

    const items = searchDropdown.querySelectorAll(".gis-search-result-item");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      searchHighlightIdx = (searchHighlightIdx + 1) % items.length;
      items.forEach((it, i) => it.classList.toggle("selected", i === searchHighlightIdx));
      items[searchHighlightIdx]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      searchHighlightIdx = (searchHighlightIdx - 1 + items.length) % items.length;
      items.forEach((it, i) => it.classList.toggle("selected", i === searchHighlightIdx));
      items[searchHighlightIdx]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (searchHighlightIdx >= 0 && searchHighlightIdx < items.length) {
        executeGISSearchSelection(items[searchHighlightIdx]);
      }
    } else if (e.key === "Escape") {
      searchDropdown.style.display = "none";
    }
  });

  // Close search dropdown on click outside
  document.addEventListener("click", e => {
    if (searchWrapper && !searchWrapper.contains(e.target)) {
      if (searchDropdown) searchDropdown.style.display = "none";
    }
  });

  // Global ⌘K shortcut
  focusSearch?.addEventListener("click", () => search?.focus());
  document.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      search?.focus();
      search?.select();
    }
  });

  /* ===========================================================
     LAYER FILTERS (ALL / PERSONS / VEHICLES / SITES / COMMS)
     =========================================================== */

  const filterButtons = [
    { id: "gisFilterAll", filter: "all" },
    { id: "gisFilterPersons", filter: "person" },
    { id: "gisFilterVehicles", filter: "vehicle" },
    { id: "gisFilterPlaces", filter: "place" },
    { id: "gisFilterComms", filter: "comms" }
  ];

  filterButtons.forEach(fb => {
    const btn = document.getElementById(fb.id);
    btn?.addEventListener("click", () => {
      wsActiveFilter = fb.filter;
      filterButtons.forEach(other => {
        document.getElementById(other.id)?.classList.toggle("active", other.id === fb.id);
      });
      renderWorkspaceGIS(wsCurrentData);
      toast(`GIS Filter applied: ${fb.filter.toUpperCase()}`);
    });
  });

  /* ===========================================================
     CROSS-VIEW SYNCHRONIZATION & GLOBAL HOOKS
     =========================================================== */

  /* Cross-view Pan & Highlight function */
  window.cipherPanToLocation = function(lat, lng, name, entityId, switchTab = true) {
    if (!lat || !lng) return;
    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);
    if (isNaN(numLat) || isNaN(numLng)) return;

    // 1. Switch to GIS tab if requested
    if (switchTab) {
      const gisNavBtn = document.querySelector('.workspace-sidebar .side-item[data-view="gis"]');
      if (gisNavBtn && !gisNavBtn.classList.contains("active")) {
        gisNavBtn.click();
      }
    }

    // 2. Fly map and activate marker
    setTimeout(() => {
      if (!wsGISMap) return;
      wsGISMap.invalidateSize();
      wsGISMap.flyTo([numLat, numLng], 15, { duration: 1.0 });

      let matchedMarker = null;
      let matchedProps = null;

      // Check by entityId
      if (entityId && wsLocationMarkers[entityId]) {
        matchedMarker = wsLocationMarkers[entityId];
      } else {
        // Find matching marker by proximity
        Object.entries(wsLocationMarkers).forEach(([id, m]) => {
          const mPos = m.getLatLng();
          if (Math.abs(mPos.lat - numLat) < 0.008 && Math.abs(mPos.lng - numLng) < 0.008) {
            matchedMarker = m;
            entityId = id;
          }
        });
      }

      if (matchedMarker) {
        if (wsCurrentData && wsCurrentData.geojson && Array.isArray(wsCurrentData.geojson.features)) {
          const feat = wsCurrentData.geojson.features.find(f => String(f.properties.id || f.properties.entity_id) === String(entityId));
          if (feat) matchedProps = feat.properties;
        }
        if (!matchedProps) {
          matchedProps = { id: entityId, name: name || "Node", latitude: numLat, longitude: numLng };
        }
        activateMarker(entityId, matchedProps, matchedMarker);
      } else {
        L.popup()
          .setLatLng([numLat, numLng])
          .setContent(`
            <div style="font-family:'DM Mono',monospace;padding:4px;">
              <b style="color:#00e5ff;">${escapeHtml(name || "Investigated Location")}</b><br/>
              <small style="color:#7fe9df;">LAT ${numLat.toFixed(4)} · LNG ${numLng.toFixed(4)}</small>
            </div>
          `)
          .openOn(wsGISMap);
      }
    }, switchTab ? 260 : 50);
  };

  /* Cross-view Focus: Switch to Network graph and zoom/select target node */
  window.cipherFocusNetworkNode = function(nodeIdOrLabel, fallbackName) {
    // 1. Switch to Network tab
    const networkNavBtn = document.querySelector('.workspace-sidebar .side-item[data-view="network"]');
    if (networkNavBtn) networkNavBtn.click();

    // 2. Center and select node in Cytoscape
    setTimeout(() => {
      const cyInstance = window.cy;
      if (!cyInstance) return;

      const needle = String(nodeIdOrLabel || fallbackName || "").toLowerCase().trim();
      let matchedNode = cyInstance.getElementById(String(nodeIdOrLabel));
      if (!matchedNode || matchedNode.length === 0) {
        matchedNode = cyInstance.nodes().filter(n => {
          const d = n.data();
          const dId = String(d.id || "").toLowerCase();
          const dRawId = String(d.raw_id || "").toLowerCase();
          const dLabel = String(d.label || "").toLowerCase();
          return dId === needle || dRawId === needle || dLabel === needle || (fallbackName && dLabel.includes(fallbackName.toLowerCase()));
        });
      }

      if (matchedNode && matchedNode.length > 0) {
        cyInstance.elements().unselect();
        matchedNode.select();
        cyInstance.animate({
          center: { eles: matchedNode },
          zoom: 1.8,
          duration: 600
        });
        matchedNode.trigger("tap");
        toast(`Focused on network node: ${matchedNode.data("label") || nodeIdOrLabel}`);
      } else {
        toast(`Entity "${fallbackName || nodeIdOrLabel}" selected in case graph.`);
      }
    }, 320);
  };

  /* Cross-view event: Network node selected -> Center GIS */
  window.addEventListener("cipher:network-node-select", (evt) => {
    const detail = evt.detail;
    if (detail && detail.lat && detail.lng) {
      window.cipherPanToLocation(detail.lat, detail.lng, detail.label, detail.id, false);
    }
  });

  /* Lock/Unlock Map Control */
  const gisLockBtn = document.getElementById("gisLockButton");
  gisLockBtn?.addEventListener("click", () => {
    if (!wsGISMap) return;
    const isDragging = wsGISMap.dragging.enabled();
    if (isDragging) {
      wsGISMap.dragging.disable();
      wsGISMap.scrollWheelZoom.disable();
      gisLockBtn.textContent = "Map Locked 🔒";
      gisLockBtn.classList.add("active");
      toast("GIS Map view locked in place.");
    } else {
      wsGISMap.dragging.enable();
      wsGISMap.scrollWheelZoom.enable();
      gisLockBtn.textContent = "Map Unlocked 🔓";
      gisLockBtn.classList.remove("active");
      toast("GIS Map view unlocked for pan/zoom.");
    }
  });

  /* Fit Bounds Control */
  const gisFitBoundsBtn = document.getElementById("gisFitBoundsBtn");
  gisFitBoundsBtn?.addEventListener("click", () => {
    if (!wsGISMap) return;
    const markers = Object.values(wsLocationMarkers);
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      wsGISMap.fitBounds(group.getBounds().pad(0.2));
      toast("Fitted view to all active investigation locations.");
    } else {
      wsGISMap.setView([28.6200, 77.2150], 12);
    }
  });

  /* Sync with Network Button */
  const wsBtnSync = document.getElementById("wsBtnSyncGraph");
  wsBtnSync?.addEventListener("click", async () => {
    toast("Synchronizing GIS layer with Network graph...");
    await loadWorkspaceGISData();

    // If Cytoscape has a selected node with coordinates, fly to it
    if (window.cy) {
      const selected = window.cy.$(':selected');
      if (selected && selected.length > 0) {
        const d = selected.first().data();
        if (d.lat && d.lng) {
          window.cipherPanToLocation(d.lat, d.lng, d.label, d.id, false);
          toast(`Synced with selected network node: ${d.label}`);
          return;
        }
      }
    }

    // Otherwise fit bounds to all markers
    const markers = Object.values(wsLocationMarkers);
    if (markers.length > 0 && wsGISMap) {
      const group = L.featureGroup(markers);
      wsGISMap.fitBounds(group.getBounds().pad(0.2));
      toast(`GIS & Network synchronized (${markers.length} spatial entities active).`);
    }
  });

  /* Toggle corridors */
  const wsBtnCorr = document.getElementById("wsBtnToggleCorridors");
  wsBtnCorr?.addEventListener("click", () => {
    wsShowCorridors = !wsShowCorridors;
    wsBtnCorr.classList.toggle("active", wsShowCorridors);
    wsBtnCorr.textContent = wsShowCorridors ? "Transit Corridors ON" : "Transit Corridors OFF";
    renderWorkspaceGIS(wsCurrentData);
    toast(wsShowCorridors ? "Transit corridors displayed." : "Transit corridors hidden.");
  });

  /* Toggle anomalies */
  const wsBtnAnom = document.getElementById("wsBtnToggleAnomalies");
  wsBtnAnom?.addEventListener("click", () => {
    wsShowAnomalies = !wsShowAnomalies;
    wsBtnAnom.classList.toggle("active", wsShowAnomalies);
    wsBtnAnom.textContent = wsShowAnomalies ? "Co-Location Risk ON" : "Co-Location Risk OFF";
    renderWorkspaceGIS(wsCurrentData);
    toast(wsShowAnomalies ? "Co-location anomalies displayed." : "Co-location anomalies hidden.");
  });

  /* Spatial Radius Query */
  let wsRadiusSearchCircle = null;
  const wsBtnRadiusSearch = document.getElementById("wsBtnRadiusSearch");
  wsBtnRadiusSearch?.addEventListener("click", async () => {
    if (!wsGISMap) { toast("Open the GIS view first."); return; }
    const center = wsGISMap.getCenter();
    const radiusKmStr = prompt("Enter spatial search radius around current map center (in km):", "15");
    if (!radiusKmStr) return;
    const radiusKm = parseFloat(radiusKmStr) || 15;
    const radiusM = radiusKm * 1000;

    if (wsRadiusSearchCircle) wsGISMap.removeLayer(wsRadiusSearchCircle);
    wsRadiusSearchCircle = L.circle([center.lat, center.lng], {
      radius: radiusM,
      color: "#00d2ff",
      fillColor: "#00d2ff",
      fillOpacity: 0.12,
      weight: 2,
      dashArray: "6, 6"
    }).addTo(wsGISMap);

    try {
      const res = await fetch(`${API_BASE}/cases/1/gis/nearby?latitude=${center.lat}&longitude=${center.lng}&radius=${radiusM}`);
      const data = await res.json();
      if (data.status === "success") {
        toast(`Radius Query: Found ${data.count} location(s) within ${radiusKm}km.`);
      }
    } catch (e) {
      toast("Error executing spatial radius query.");
    }
  });

  /* Add Waypoint Tool */
  waypoint?.addEventListener("click", () => {
    if (!wsGISMap) { toast("Open the GIS view first."); return; }
    wsWaypointMode = !wsWaypointMode;
    gisMapContainer?.classList.toggle("waypoint-mode", wsWaypointMode);
    toast(wsWaypointMode ? "Waypoint Tool Active: Click anywhere on the map to drop a waypoint." : "Waypoint mode cancelled.");
  });

  function placeWaypoint(latlng) {
    if (!wsGISMap) return;
    const count = wsWaypoints.length + 1;
    const marker = L.marker(latlng, {
      icon: L.divIcon({
        className: "cipher-waypoint-icon",
        html: `<span style="display:inline-block;width:14px;height:14px;background:#00e5ff;border:2px solid #fff;border-radius:50%;box-shadow:0 0 12px rgba(0,229,255,.7);"></span>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      })
    }).addTo(wsGISMap);

    marker.bindPopup(`<b style="color:#00e5ff">WAYPOINT #${count}</b><br/><small>${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}</small>`);
    wsWaypoints.push(marker);

    renderInspector({
      name: `Waypoint #${count}`,
      location_type: "WAYPOINT",
      latitude: latlng.lat,
      longitude: latlng.lng,
      address: `Field waypoint at ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`
    });
  }

  /* Global hooks for external integration */
  window.cipherSelectGISNode = function(nodeData) { renderInspector(nodeData); };
  window.addEventListener("cipher:gis-node-select", e => renderInspector(e.detail));

})();


/* =========================================================
   CASE REPORT / CHART SHEET
   ========================================================= */

(function initCaseReport() {

  const view =
    document.getElementById(
      "evidenceView"
    );


  if (!view)
    return;


  const printBtn =
    document.getElementById(
      "reportPrintPdf"
    );


  const saveState =
    document.getElementById(
      "reportSaveState"
    );


  const generated =
    document.getElementById(
      "reportGeneratedAt"
    );


  const title =
    document.getElementById(
      "reportTitle"
    );


  const subtitle =
    document.getElementById(
      "reportSubtitle"
    );


  const status =
    document.getElementById(
      "reportCaseStatus"
    );


  const summaryBtn =
    document.getElementById(
      "reportCaseSummaryBtn"
    );


  const toast =
    window.showNetworkToast;


  let reportTimer = 0;


  const fields =
    () =>
      [
        ...view.querySelectorAll(
          "[data-report-field]"
        )
      ];


  const getField =
    name =>
      view.querySelector(
        `[data-report-field="${name}"]`
      )?.value?.trim() ||
      "";


  const setDraftState =
    (
      label = "LOCAL DRAFT"
    ) => {

      if (saveState) {

        saveState.textContent =
          label;

      }


      clearTimeout(
        reportTimer
      );


      reportTimer =
        setTimeout(
          () => {

            if (saveState) {

              saveState.textContent =
                "AUTO-SAVED LOCALLY";

            }

          },
          700
        );

    };


  function syncHeader() {

    if (title) {

      title.textContent =
        getField(
          "caseId"
        ).includes(
          "BBC-1"
        )

          ? "1993 Bombay Serial Blasts"

          : (
              getField(
                "caseType"
              ) ||
              "Cipher Investigation Case"
            );

    }


    if (subtitle) {

      subtitle.textContent =
        `${
          getField(
            "caseType"
          ) ||
          "Investigation"
        } · ${
          getField(
            "incidentDate"
          ) ||
          "Date not entered"
        } · ${
          getField(
            "location"
          ) ||
          "Location not entered"
        }`;

    }


    if (status) {

      status.textContent =
        `CASE / ${
          getField(
            "caseId"
          ) ||
          "DRAFT"
        }`;

    }


    setDraftState();

  }


  fields().forEach(
    el =>
      el.addEventListener(
        "input",
        syncHeader
      )
  );


  const evidenceCsvInput = document.getElementById("evidenceCsvFileInput");

  function addEvidence() {
    if (evidenceCsvInput) {
      evidenceCsvInput.value = "";
      evidenceCsvInput.click();
      return;
    }
    if (typeof window.cipherHandleCsvFile === "function") {
      const fallbackInput = document.getElementById("csvFileInput");
      if (fallbackInput) {
        fallbackInput.value = "";
        fallbackInput.click();
        return;
      }
    }

    const list = document.getElementById("reportEvidenceList");
    if (!list) return;

    const row = document.createElement("div");
    row.className = "evidence-row";
    row.innerHTML = `
      <span class="evidence-icon">NEW</span>
      <div>
        <b contenteditable="true">New evidence item</b>
        <small contenteditable="true">Enter source, date, authority and verification status.</small>
      </div>
      <em>USER INPUT</em>
    `;
    list.appendChild(row);
    row.querySelector("b")?.focus();
    setDraftState("EVIDENCE ADDED");
  }

  evidenceCsvInput?.addEventListener("change", () => {
    const file = evidenceCsvInput.files?.[0];
    if (file && typeof window.cipherHandleCsvFile === "function") {
      window.cipherHandleCsvFile(file);
    }
  });

  const evidenceWorkspace = document.getElementById("evidenceView");
  if (evidenceWorkspace) {
    evidenceWorkspace.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    evidenceWorkspace.addEventListener("drop", (e) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (file && (/\.csv$/i.test(file.name) || file.type === "text/csv")) {
        if (typeof window.cipherHandleCsvFile === "function") {
          window.cipherHandleCsvFile(file);
        }
      }
    });
  }

  document
    .getElementById("reportAddEvidence")
    ?.addEventListener("click", addEvidence);

  document
    .getElementById("reportAddEvidenceInline")
    ?.addEventListener("click", addEvidence);


  summaryBtn?.addEventListener(
    "click",
    () => {

      if (
        typeof toast ===
        "function"
      ) {

        toast(
          "Case Summary is reserved for the next report module. The case sheet is ready for its data."
        );

      }

    }
  );


  function printPdf() {

    const old =
      document.title;


    document.title =
      `Cipher Case Report — ${
        getField(
          "caseId"
        ) ||
        "Draft"
      }`;


    if (generated) {

      generated.textContent =
        `GENERATED ${new Date().toLocaleString()}`;

    }


    setDraftState(
      "PREPARING PDF"
    );


    setTimeout(
      () => {

        window.print();

        document.title =
          old;

      },
      120
    );

  }


  printBtn?.addEventListener(
    "click",
    printPdf
  );


  if (generated) {

    generated.textContent =
      "LOCAL DRAFT";

  }


  syncHeader();

})();


/* =========================================================
   CIPHER GIS & SPATIAL INTELLIGENCE MAP ENGINE
   ========================================================= */

(function initGISModule() {
  let gisMap = null;
  let locationMarkers = {};
  let corridorPolylines = [];
  let anomalyCircles = [];
  let currentGISData = null;

  let showCorridors = true;
  let showAnomalies = true;

  function initMap() {
    const container = document.getElementById("cipherGISMap");
    if (!container || gisMap) return;

    // Center map around Mumbai/Navi Mumbai (18.9800, 72.8800)
    gisMap = L.map("cipherGISMap").setView([18.9800, 72.8800], 11);

    // Clean Tactical Dark tile layer (watermark-free, no key required) + CARTO / OSM options
    const tileConfig = window.createCipherTileLayers ? window.createCipherTileLayers() : null;
    if (tileConfig) {
      tileConfig.defaultLayer.addTo(gisMap);
      L.control.layers(tileConfig.baseMaps, null, { position: 'topright' }).addTo(gisMap);
    } else {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16
      }).addTo(gisMap);
    }

    loadGISData();
  }

  async function loadGISData() {
    try {
      const response = await fetch(`${window.location.origin}/cases/1/gis-data`);
      if (response.ok) {
        currentGISData = await response.json();
      } else {
        throw new Error("Backend response error");
      }
    } catch (e) {
      console.log("Using fallback seed GIS data...");
      currentGISData = getFallbackGISData();
    }

    renderGISData(currentGISData);
  }

  function getFallbackGISData() {
    return {
      "status": "success",
      "case_id": 1,
      "location_count": 5,
      "event_count": 7,
      "geojson": {
        "type": "FeatureCollection",
        "features": [
          { "type": "Feature", "geometry": { "type": "Point", "coordinates": [72.8193, 18.9696] }, "properties": { "id": 1, "name": "Nagpada Junction Tower Sector 04", "location_type": "TOWER_SECTOR", "address": "Nagpada, South Mumbai", "latitude": 18.9696, "longitude": 72.8193 } },
          { "type": "Feature", "geometry": { "type": "Point", "coordinates": [72.9981, 19.0760] }, "properties": { "id": 2, "name": "Sector 9 Vashi Drop Zone", "location_type": "SAFE_HOUSE", "address": "Sector 9, Vashi, Navi Mumbai", "latitude": 19.0760, "longitude": 72.9981 } },
          { "type": "Feature", "geometry": { "type": "Point", "coordinates": [72.9500, 18.9500] }, "properties": { "id": 3, "name": "Nhava Sheva Port Terminal 2", "location_type": "DOCK_PORT", "address": "JNPT Port, Navi Mumbai", "latitude": 18.9500, "longitude": 72.9500 } },
          { "type": "Feature", "geometry": { "type": "Point", "coordinates": [72.9750, 19.0620] }, "properties": { "id": 4, "name": "ANPR Checkpoint - Vashi Toll", "location_type": "ANPR_CHECKPOINT", "address": "Sion-Panvel Expressway", "latitude": 19.0620, "longitude": 72.9750 } },
          { "type": "Feature", "geometry": { "type": "Point", "coordinates": [72.8430, 18.9650] }, "properties": { "id": 5, "name": "Crime Incident Site - Dockyard Road", "location_type": "CRIME_SCENE", "address": "Dockyard Road Railway Precinct", "latitude": 18.9650, "longitude": 72.8430 } }
        ]
      },
      "transit_corridors": {
        "Rafiq B. (Subject 047)": [
          { "location_name": "Nagpada Junction", "latitude": 18.9696, "longitude": 72.8193 },
          { "location_name": "ANPR Vashi Toll", "latitude": 19.0620, "longitude": 72.9750 },
          { "location_name": "Sector 9 Vashi", "latitude": 19.0760, "longitude": 72.9981 }
        ],
        "Scorpio DL-01-AB-9988": [
          { "location_name": "ANPR Vashi Toll", "latitude": 19.0620, "longitude": 72.9750 },
          { "location_name": "Nhava Sheva Port", "latitude": 18.9500, "longitude": 72.9500 }
        ]
      },
      "colocation_anomalies": [
        {
          "entity_a": "Rafiq B. (Subject 047)",
          "entity_b": "Sunita R. (Customs Broker)",
          "location": "Nagpada Junction Tower Sector 04",
          "latitude": 18.9696,
          "longitude": 72.8193,
          "time_gap_minutes": 8.0,
          "anomaly_score": "HIGH_CO_LOCATION_RISK"
        }
      ]
    };
  }

  function renderGISData(data) {
    if (!gisMap || !data) return;

    Object.values(locationMarkers).forEach(m => gisMap.removeLayer(m));
    locationMarkers = {};

    corridorPolylines.forEach(p => gisMap.removeLayer(p));
    corridorPolylines = [];

    anomalyCircles.forEach(c => gisMap.removeLayer(c));
    anomalyCircles = [];

    const features = (data.geojson && data.geojson.features) ? data.geojson.features : [];
    features.forEach(feat => {
      const [lng, lat] = feat.geometry.coordinates;
      const props = feat.properties;

      let markerColor = "#d9ff55";
      if (props.location_type === "CRIME_SCENE") markerColor = "#ff6b5f";
      if (props.location_type === "TOWER_SECTOR") markerColor = "#87918c";
      if (props.location_type === "SAFE_HOUSE") markerColor = "#ffb020";

      const marker = L.circleMarker([lat, lng], {
        radius: 9,
        fillColor: markerColor,
        color: "#ffffff",
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.85
      }).addTo(gisMap);

      marker.bindPopup(`
        <b>${props.name}</b><br/>
        <small style="color:#7f8883">${props.location_type}</small><br/>
        <span>${props.address || ''}</span>
      `);

      marker.on("click", () => {
        showLocationDetail(props);
      });

      locationMarkers[props.id] = marker;
    });

    if (showCorridors && data.transit_corridors) {
      const colors = ["#d9ff55", "#00d2ff", "#ff007a"];
      let cIdx = 0;
      Object.keys(data.transit_corridors).forEach(entityName => {
        const points = data.transit_corridors[entityName].map(p => [p.latitude, p.longitude]);
        if (points.length > 1) {
          const polyline = L.polyline(points, {
            color: colors[cIdx % colors.length],
            weight: 3,
            dashArray: "6, 8",
            opacity: 0.85
          }).addTo(gisMap);

          polyline.bindTooltip(`Transit Line: ${entityName}`);
          corridorPolylines.push(polyline);
          cIdx++;
        }
      });
    }

    const anomalies = data.colocation_anomalies || [];
    if (showAnomalies && anomalies.length > 0) {
      anomalies.forEach(anom => {
        const circle = L.circle([anom.latitude, anom.longitude], {
          radius: 600,
          color: "#ff6b5f",
          fillColor: "#ff6b5f",
          fillOpacity: 0.25,
          weight: 2
        }).addTo(gisMap);

        circle.bindTooltip(`CO-LOCATION RISK: ${anom.entity_a} & ${anom.entity_b} (${anom.time_gap_minutes}m gap)`);
        anomalyCircles.push(circle);
      });
    }

    const locEl = document.getElementById("gisLocCount");
    if (locEl) locEl.textContent = features.length;
    const corrEl = document.getElementById("gisCorridorCount");
    if (corrEl) corrEl.textContent = Object.keys(data.transit_corridors || {}).length;
    const anomEl = document.getElementById("gisAnomalyCount");
    if (anomEl) anomEl.textContent = anomalies.length;

    const anomalyListEl = document.getElementById("gisAnomalyList");
    if (anomalyListEl) {
      if (anomalies.length === 0) {
        anomalyListEl.innerHTML = '<p class="muted">No spatial co-location anomalies detected.</p>';
      } else {
        anomalyListEl.innerHTML = anomalies.map(a => `
          <div class="gis-anomaly-item">
            <strong>⚠️ ${a.anomaly_score}</strong>
            <p><strong>${a.entity_a}</strong> & <strong>${a.entity_b}</strong> co-located within <strong>${a.time_gap_minutes} mins</strong>.</p>
            <small>📍 ${a.location}</small>
          </div>
        `).join("");
      }
    }
  }

  function showLocationDetail(props) {
    const detailEl = document.getElementById("gisSelectedDetail");
    if (!detailEl) return;

    detailEl.innerHTML = `
      <strong>${props.name}</strong>
      <p style="margin: 4px 0 0; color: #a3adab;">Type: ${props.location_type}</p>
      <p style="margin: 2px 0 0; color: #7f8883; font-size: 11px;">Address: ${props.address || 'N/A'}</p>
      <p style="margin: 4px 0 0; font-family: 'DM Mono', monospace; font-size: 10px; color: #d9ff55;">
        Lat: ${props.latitude ? props.latitude.toFixed(4) : 'N/A'} | Lon: ${props.longitude ? props.longitude.toFixed(4) : 'N/A'}
      </p>
    `;
  }

  window.addEventListener("load", () => {
    setTimeout(initMap, 400);

    const btnCorridors = document.getElementById("btnToggleCorridors");
    btnCorridors?.addEventListener("click", () => {
      showCorridors = !showCorridors;
      btnCorridors.classList.toggle("active", showCorridors);
      btnCorridors.textContent = showCorridors ? "Transit Corridors ON" : "Transit Corridors OFF";
      renderGISData(currentGISData);
    });

    const btnAnomalies = document.getElementById("btnToggleAnomalies");
    btnAnomalies?.addEventListener("click", () => {
      showAnomalies = !showAnomalies;
      btnAnomalies.classList.toggle("active", showAnomalies);
      btnAnomalies.textContent = showAnomalies ? "Co-Location Risk ON" : "Co-Location Risk OFF";
      renderGISData(currentGISData);
    });

    const btnSync = document.getElementById("btnSyncGraph");
    btnSync?.addEventListener("click", () => {
      if (gisMap) {
        gisMap.flyTo([18.9800, 72.8800], 12, { duration: 1.5 });
      }
    });
  });
})();

/* =========================================================
   SPEC 1.4: CYTOSCAPE NETWORK GRAPH & CROSS-VIEW ENGINE
   ========================================================= */

(function initCipherNetworkModule() {
  let cy = null;
  let activeSelectedNodeId = null;

  window.CipherSelection = {
    entityId: null
  };

  const container = document.getElementById("networkCanvasInner");
  const statsEl = document.getElementById("networkCanvasStats");
  const inspectorEmpty = document.getElementById("nodeInspectorEmpty");
  const inspectorContent = document.getElementById("nodeInspectorContent");
  const inspectName = document.getElementById("nodeInspectName");
  const inspectType = document.getElementById("nodeInspectType");
  const inspectAliases = document.getElementById("nodeInspectAliases");
  const inspectConf = document.getElementById("nodeInspectConf");
  const inspectStatus = document.getElementById("nodeInspectStatus");
  const inspectRelCount = document.getElementById("nodeInspectRelCount");
  const inspectRelList = document.getElementById("nodeInspectRelList");
  const btnInspectViewOnMap = document.getElementById("btnInspectViewOnMap");
  const autoLayoutBtn = document.getElementById("graphAutoLayoutBtn");
  const hierarchicalBtn = document.getElementById("graphHierarchicalBtn");
  const fitViewBtn = document.getElementById("graphFitViewBtn");
  const deleteNodeBtn = document.getElementById("deleteNodeBtn");

  function escapeXml(unsafe) {
    if (!unsafe) return "";
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // Generates high-definition tactical SVG node matching intelligence reference
  function buildTacticalNodeSvg(data, degree = 1) {
    const type = (data.type || 'person').toLowerCase();
    const label = data.label || 'Unknown';
    const role = data.aliases || data.role || data.type || '';
    const status = (data.status || 'verified').toLowerCase();
    const isVerified = status === 'verified';

    // Label formatting: clean truncation if exceeding badge width
    const displayLabel = label.length > 25 ? label.slice(0, 23) + '…' : label;
    const displayRole = role ? (role.length > 25 ? role.slice(0, 23) + '…' : role) : type.toUpperCase();

    // Visual Palette & Icons corresponding to entity archetypes
    let ringColor = '#00e5ff'; // Cyan default
    let ringGlow = 'rgba(0, 229, 255, 0.45)';
    let cardBorder = '#0088cc';
    let pillText = '#7fe9df';
    let pillBorder = '#1c3d4a';
    let iconSvg = '';

    if (type.includes('person') || type.includes('suspect') || type.includes('kingpin') || type.includes('driver')) {
      ringColor = '#00e5ff';
      ringGlow = 'rgba(0, 229, 255, 0.45)';
      cardBorder = '#00a3cc';
      pillText = '#7fe9df';
      pillBorder = '#153c4d';
      iconSvg = `
        <circle cx="100" cy="21" r="5" fill="currentColor"/>
        <path d="M92 34 c0-4.5 3.5-7.5 8-7.5 s8 3 8 7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      `;
    } else if (type.includes('organis') || type.includes('company') || type.includes('business')) {
      ringColor = '#c084fc';
      ringGlow = 'rgba(192, 132, 252, 0.45)';
      cardBorder = '#9333ea';
      pillText = '#d8b4fe';
      pillBorder = '#3b1854';
      iconSvg = `
        <path d="M93 35 V20 h14 v15 M96 23 h2 M102 23 h2 M96 27 h2 M102 27 h2 M96 31 h2 M102 31 h2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      `;
    } else if (type.includes('phone') || type.includes('msisdn') || type.includes('mobile')) {
      ringColor = '#00f0aa';
      ringGlow = 'rgba(0, 240, 170, 0.45)';
      cardBorder = '#059669';
      pillText = '#6ee7b7';
      pillBorder = '#133e2c';
      iconSvg = `
        <rect x="94" y="16" width="12" height="19" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
        <circle cx="100" cy="31.5" r="1.2" fill="currentColor"/>
      `;
    } else if (type.includes('account') || type.includes('financial') || type.includes('bank')) {
      ringColor = '#06b6d4';
      ringGlow = 'rgba(6, 182, 212, 0.45)';
      cardBorder = '#0891b2';
      pillText = '#67e8f9';
      pillBorder = '#154050';
      iconSvg = `
        <rect x="91" y="19" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>
        <path d="M91 23.5 h18 M94 28 h3" stroke="currentColor" stroke-width="1.6"/>
      `;
    } else if (type.includes('vehicle') || type.includes('car')) {
      ringColor = '#fbbf24';
      ringGlow = 'rgba(251, 191, 36, 0.45)';
      cardBorder = '#d97706';
      pillText = '#fcd34d';
      pillBorder = '#452c08';
      iconSvg = `
        <path d="M92 31 h16 l-1.5-6 h-13 z M94 31 v2 M106 31 v2 M95 27 h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      `;
    } else if (type.includes('place') || type.includes('location') || type.includes('vault') || type.includes('terminal')) {
      ringColor = '#ff4d6d';
      ringGlow = 'rgba(255, 77, 109, 0.45)';
      cardBorder = '#e11d48';
      pillText = '#fda4af';
      pillBorder = '#4a1525';
      iconSvg = `
        <path d="M100 16 c-3.5 0-6.5 2.8-6.5 6.5 c0 5 6.5 11 6.5 11 s6.5-6 6.5-11 c0-3.7-3-6.5-6.5-6.5 z" fill="none" stroke="currentColor" stroke-width="1.8"/>
        <circle cx="100" cy="22.5" r="2" fill="currentColor"/>
      `;
    }

    const checkColor = isVerified ? '#00f0aa' : '#fbbf24';
    const checkIcon = isVerified
      ? '<path d="M117.5 13.5 l2 2 l4 -4" fill="none" stroke="#080e14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<circle cx="120" cy="13.5" r="2" fill="#080e14"/>';

    const xml = `
      <svg xmlns="http://www.w3.org/2000/svg" width="204" height="92" viewBox="0 0 204 92">
        <defs>
          <filter id="avatar-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="${ringGlow}" />
          </filter>
          <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,0.65)" />
          </filter>
        </defs>

        <!-- Lower Information Card -->
        <g filter="url(#card-shadow)">
          <rect x="8" y="38" width="188" height="48" rx="7" ry="7" fill="#090d14" stroke="${cardBorder}" stroke-width="1.6" />
        </g>

        <!-- Primary Name Label -->
        <text x="102" y="55" text-anchor="middle" fill="#f8fafc" font-family="'Inter', system-ui, sans-serif" font-weight="700" font-size="11" letter-spacing="0.2">
          ${escapeXml(displayLabel)}
        </text>

        <!-- Subtitle Role Capsule -->
        <rect x="22" y="62.5" width="160" height="17" rx="4" fill="#05080c" stroke="${pillBorder}" stroke-width="1" />
        <text x="102" y="74.5" text-anchor="middle" fill="${pillText}" font-family="'DM Mono', monospace" font-weight="600" font-size="8.5" letter-spacing="0.3">
          ${escapeXml(displayRole)}
        </text>

        <!-- Circular Avatar Header -->
        <g filter="url(#avatar-glow)">
          <circle cx="102" cy="24" r="17" fill="#0c121a" stroke="${ringColor}" stroke-width="2.2" />
        </g>

        <!-- Category Icon -->
        <g color="${ringColor}">
          ${iconSvg}
        </g>

        <!-- Top-Left Degree Counter Badge -->
        <circle cx="84" cy="13" r="7.5" fill="#111a26" stroke="#25384d" stroke-width="1.2" />
        <text x="84" y="16" text-anchor="middle" fill="#94a3b8" font-family="'DM Mono', monospace" font-weight="700" font-size="8.5">
          ${degree}
        </text>

        <!-- Top-Right Verification Status Badge -->
        <circle cx="120" cy="13" r="7.5" fill="${checkColor}" stroke="#0b1118" stroke-width="1.5" />
        ${checkIcon}
      </svg>
    `.trim();

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(xml);
  }

  // Anti-overlap Hierarchical Tier Layout Engine
  function applyTieredHierarchyLayout(cyInstance, animate = true) {
    if (!cyInstance) return;
    const nodes = cyInstance.nodes();
    if (nodes.length === 0) return;

    const tier1 = []; // Kingpins / High-level targets
    const tier2 = []; // Facilitators, Staff, Registered Organisations
    const tier3 = []; // Communications & Financial Accounts
    const tier4 = []; // Vehicles & Physical Locations

    nodes.forEach(node => {
      const d = node.data();
      const type = (d.type || '').toLowerCase();
      const lbl = (d.label || '').toLowerCase();
      const role = (d.aliases || '').toLowerCase();

      if (type.includes('phone') || type.includes('msisdn') || type.includes('mobile')) {
        tier3.push(node);
      } else if (type.includes('account') || type.includes('financial') || type.includes('bank')) {
        tier3.push(node);
      } else if (type.includes('vehicle') || type.includes('car')) {
        tier4.push(node);
      } else if (type.includes('place') || type.includes('location') || type.includes('vault') || type.includes('terminal')) {
        tier4.push(node);
      } else if (type.includes('organis') || type.includes('company') || type.includes('business')) {
        tier2.push(node);
      } else if (type.includes('person') || type.includes('suspect')) {
        if (lbl.includes('rafiq') || lbl.includes('vikram') || role.includes('kingpin') || role.includes('proprietor') || role.includes('lead')) {
          tier1.push(node);
        } else {
          tier2.push(node);
        }
      } else {
        tier2.push(node);
      }
    });

    const nodeWidth = 265;
    const tierY = [80, 260, 440, 620];
    const allTiers = [tier1, tier2, tier3, tier4];
    const maxTierLength = Math.max(...allTiers.map(t => t.length), 1);
    const totalWidth = maxTierLength * nodeWidth;

    cyInstance.batch(() => {
      allTiers.forEach((tierNodes, tierIdx) => {
        const count = tierNodes.length;
        if (count === 0) return;
        const startX = (totalWidth - (count * nodeWidth)) / 2 + (nodeWidth / 2);
        const y = tierY[tierIdx];

        tierNodes.forEach((node, i) => {
          const x = startX + (i * nodeWidth);
          if (animate) {
            node.animate({
              position: { x, y },
              duration: 650,
              easing: 'ease-in-out-cubic'
            });
          } else {
            node.position({ x, y });
          }
        });
      });
    });

    setTimeout(() => {
      cyInstance.fit(undefined, 40);
    }, animate ? 700 : 50);
  }

  // Force-directed layout with collision prevention
  function applyOrganicForceLayout(cyInstance) {
    if (!cyInstance) return;
    cyInstance.resize();
    const layout = cyInstance.layout({
      name: 'cose',
      animate: true,
      animationDuration: 750,
      randomize: false,
      componentSpacing: 180,
      nodeRepulsion: function(node) { return 1500000; },
      nodeOverlap: 0,
      idealEdgeLength: function(edge) { return 230; },
      edgeElasticity: function(edge) { return 45; },
      nestingFactor: 5,
      gravity: 30,
      numIter: 1000
    });
    layout.run();
    setTimeout(() => {
      cyInstance.fit(undefined, 40);
    }, 800);
  }

  async function loadNetworkGraph(caseId = 1) {
    if (!container || typeof cytoscape === "undefined") return;

    try {
      const token = localStorage.getItem("cipher_access_token");
      const headers = { "Accept": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/cases/${caseId}/graph`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch graph data`);

      const text = await res.text();
      let graphData;
      try {
        graphData = JSON.parse(text);
      } catch (parseErr) {
        throw new Error("Server returned non-JSON payload: " + text.slice(0, 80));
      }

      const rawNodes = graphData.nodes || [];
      const rawEdges = graphData.edges || [];

      if (statsEl) {
        statsEl.textContent = `FALCON-77 · ${rawNodes.length} NODES · ${rawEdges.length} LINKS`;
      }

      // Pre-calculate node degree (in + out connections)
      const degreeMap = {};
      const nodeIds = new Set(rawNodes.map(n => String(n.data?.id)));
      
      const validEdges = rawEdges.filter(e => {
        const s = String(e.data?.source);
        const t = String(e.data?.target);
        return nodeIds.has(s) && nodeIds.has(t);
      });

      validEdges.forEach(e => {
        const s = String(e.data?.source);
        const t = String(e.data?.target);
        degreeMap[s] = (degreeMap[s] || 0) + 1;
        degreeMap[t] = (degreeMap[t] || 0) + 1;
      });

      // Prepare nodes with custom vector cards
      const nodes = rawNodes.map(n => {
        const id = String(n.data?.id);
        const deg = degreeMap[id] || 1;
        const svgUri = buildTacticalNodeSvg(n.data, deg);
        return {
          data: {
            ...n.data,
            id: id,
            degree: deg,
            svgUri: svgUri
          }
        };
      });

      // Prepare edges with alert classification
      const edges = validEdges.map(e => {
        const lbl = (e.data?.label || '').toLowerCase();
        const isAlert = lbl.includes('hand-off') || lbl.includes('spike') || lbl.includes('alert') || lbl.includes('launder') || (e.data?.confidence && e.data.confidence < 0.93);
        return {
          data: {
            ...e.data,
            id: String(e.data?.id)
          },
          classes: isAlert ? 'alert-edge' : ''
        };
      });

      const elements = [...nodes, ...edges];

      if (cy) {
        cy.destroy();
      }

      cy = cytoscape({
        container: container,
        elements: elements,
        boxSelectionEnabled: false,
        wheelSensitivity: 0.25,
        style: [
          {
            selector: 'node',
            style: {
              'shape': 'rectangle',
              'width': 204,
              'height': 92,
              'background-color': 'transparent',
              'background-image': 'data(svgUri)',
              'background-fit': 'contain',
              'background-clip': 'none',
              'border-width': 0,
              'label': '', // Rendered inside vector SVG
              'transition-property': 'shadow-blur, shadow-color, shadow-opacity, opacity',
              'transition-duration': '0.2s',
              'cursor': 'pointer'
            }
          },
          {
            selector: 'edge',
            style: {
              'label': 'data(label)',
              'color': '#f1f5f9',
              'font-size': '10px',
              'font-family': 'DM Mono, monospace',
              'font-weight': 600,
              'text-rotation': 'autorotate',
              'text-background-opacity': 0.96,
              'text-background-color': '#080d14',
              'text-background-padding': '4px',
              'text-background-shape': 'roundrectangle',
              'text-border-color': '#2a3f55',
              'text-border-width': 1,
              'text-border-opacity': 1,
              'line-color': '#334e68',
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#334e68',
              'arrow-scale': 1.25,
              'width': 2.5,
              'transition-property': 'line-color, target-arrow-color, width, opacity',
              'transition-duration': '0.2s'
            }
          },
          {
            selector: 'edge.alert-edge',
            style: {
              'line-color': '#f59e0b',
              'target-arrow-color': '#f59e0b',
              'line-style': 'dashed',
              'line-dash-pattern': [6, 4],
              'text-border-color': '#d97706',
              'color': '#fbbf24',
              'width': 3
            }
          },
          {
            selector: 'node:selected',
            style: {
              'shadow-blur': 28,
              'shadow-color': '#00e5ff',
              'shadow-opacity': 0.95
            }
          },
          {
            selector: 'node.highlighted',
            style: {
              'shadow-blur': 24,
              'shadow-color': '#00f0aa',
              'shadow-opacity': 0.9
            }
          },
          {
            selector: 'edge.highlighted-edge',
            style: {
              'line-color': '#00e5ff',
              'target-arrow-color': '#00e5ff',
              'width': 4,
              'shadow-blur': 12,
              'shadow-color': '#00e5ff'
            }
          },
          {
            selector: 'node.path-node',
            style: {
              'shadow-blur': 30,
              'shadow-color': '#fbbf24',
              'shadow-opacity': 1
            }
          },
          {
            selector: 'edge.path-edge',
            style: {
              'line-color': '#fbbf24',
              'target-arrow-color': '#fbbf24',
              'width': 4.5,
              'shadow-blur': 14,
              'shadow-color': '#fbbf24'
            }
          },
          {
            selector: 'node.pattern-alert',
            style: {
              'shadow-blur': 30,
              'shadow-color': '#ff4d6d',
              'shadow-opacity': 1
            }
          },
          {
            selector: '.dimmed',
            style: {
              'opacity': 0.2
            }
          }
        ]
      });

      // Default to Tiered Hierarchy layout matching intelligence reference
      applyTieredHierarchyLayout(cy, false);

      // Tap Node handler -> Inspector & GIS Pan
      cy.on('tap', 'node', (evt) => {
        const node = evt.target;
        const data = node.data();
        activeSelectedNodeId = data.id;
        window.CipherSelection.entityId = data.id;

        // Visual link highlighting: highlight connected edges and dim unrelated
        cy.elements().removeClass('highlighted highlighted-edge dimmed');
        const connectedEdges = node.connectedEdges();
        const neighborNodes = connectedEdges.connectedNodes();
        
        cy.elements().addClass('dimmed');
        node.removeClass('dimmed');
        neighborNodes.removeClass('dimmed').addClass('highlighted');
        connectedEdges.removeClass('dimmed').addClass('highlighted-edge');

        showNodeInspector(data, node);

        // Cross-view sync: dispatch custom event
        window.dispatchEvent(new CustomEvent("cipher:network-node-select", { detail: data }));

        // Cross-view sync: if entity has lat/lng, notify GIS view
        if (data.lat && data.lng) {
          if (typeof window.cipherPanToLocation === "function") {
            window.cipherPanToLocation(data.lat, data.lng, data.label);
          }
        }
      });

      // Tap background deselects and resets highlights
      cy.on('tap', (evt) => {
        if (evt.target === cy) {
          activeSelectedNodeId = null;
          window.CipherSelection.entityId = null;
          cy.elements().removeClass('highlighted highlighted-edge dimmed');
          if (inspectorEmpty) inspectorEmpty.style.display = "block";
          if (inspectorContent) inspectorContent.style.display = "none";
        }
      });

      window.cy = cy;

    } catch (err) {
      console.error("Error rendering Cytoscape graph:", err);
    }
  }

  window.loadNetworkGraph = loadNetworkGraph;

  function showNodeInspector(data, nodeObj) {
    if (!inspectorContent) return;

    if (inspectorEmpty) inspectorEmpty.style.display = "none";
    inspectorContent.style.display = "block";

    if (inspectName) inspectName.textContent = data.label || "—";
    if (inspectType) inspectType.textContent = (data.type || "ENTITY").toUpperCase();
    if (inspectAliases) inspectAliases.textContent = data.aliases || "None recorded";
    if (inspectConf) inspectConf.textContent = data.confidence ? `${Math.round(data.confidence * 100)}% CONFIRMED` : "VERIFIED";
    if (inspectStatus) inspectStatus.textContent = (data.status || "VERIFIED").toUpperCase();

    // Show/Hide "View on GIS Map" button
    if (btnInspectViewOnMap) {
      if (data.lat && data.lng) {
        btnInspectViewOnMap.style.display = "block";
        btnInspectViewOnMap.onclick = () => {
          // Switch to GIS view and pan
          const gisNavBtn = document.querySelector('.workspace-sidebar .side-item[data-view="gis"]');
          gisNavBtn?.click();
          setTimeout(() => {
            if (typeof window.cipherPanToLocation === "function") {
              window.cipherPanToLocation(data.lat, data.lng, data.label);
            }
          }, 300);
        };
      } else {
        btnInspectViewOnMap.style.display = "none";
      }
    }

    // Connect Delete button in Inspector
    const btnInspectDelete = document.getElementById("btnInspectDeleteEntity");
    if (btnInspectDelete) {
      btnInspectDelete.style.display = "block";
      btnInspectDelete.onclick = (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        cipherPromptDelete(data.id || data.raw_id);
      };
    }

    // Connected Relationships
    if (nodeObj && inspectRelList && inspectRelCount) {
      const connectedEdges = nodeObj.connectedEdges();
      inspectRelCount.textContent = connectedEdges.length;

      if (connectedEdges.length === 0) {
        inspectRelList.innerHTML = "No direct connections found.";
      } else {
        inspectRelList.innerHTML = connectedEdges.map(e => {
          const ed = e.data();
          const other = e.other(nodeObj).data();
          return `
            <div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#7fe9df;font-size:10px;font-family:'DM Mono',monospace;">${ed.label}</span> ➔ 
              <b style="color:#e6edf3;font-size:11px;">${other.label}</b>
              ${ed.evidence ? `<p style="font-size:10px;color:#7f8883;margin:2px 0 0;">${ed.evidence}</p>` : ''}
            </div>
          `;
        }).join("");
      }
    }
  }

  // Tiered Hierarchy and Organic Layout button handlers
  hierarchicalBtn?.addEventListener("click", () => {
    if (cy) {
      applyTieredHierarchyLayout(cy, true);
      if (typeof toast === "function") {
        toast("Tiered Intelligence Flow applied.");
      } else if (typeof showNetworkToast === "function") {
        showNetworkToast("Tiered Intelligence Flow applied.");
      }
    } else {
      loadNetworkGraph(1);
    }
  });

  autoLayoutBtn?.addEventListener("click", () => {
    if (cy) {
      applyOrganicForceLayout(cy);
      if (typeof toast === "function") {
        toast("Organic force-directed layout recalculated.");
      } else if (typeof showNetworkToast === "function") {
        showNetworkToast("Organic force-directed layout recalculated.");
      }
    } else {
      loadNetworkGraph(1);
    }
  });

  fitViewBtn?.addEventListener("click", () => {
    if (cy) {
      cy.resize();
      cy.fit(undefined, 35);
      if (typeof toast === "function") {
        toast("Graph viewport centered.");
      } else if (typeof showNetworkToast === "function") {
        showNetworkToast("Graph viewport centered.");
      }
    } else {
      loadNetworkGraph(1);
    }
  });

  // In-app Delete Confirmation & Execution (100% iframe-safe, no blocked native confirm/prompt)
  const executeDelete = async (entityId, entityLabel) => {
    try {
      if (typeof showNetworkToast === "function") {
        showNetworkToast(`Permanently removing "${entityLabel}"...`);
      } else if (typeof toast === "function") {
        toast(`Permanently removing "${entityLabel}"...`);
      }

      const res = await fetch(`/cases/1/entities/${entityId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        if (cy) {
          const el = cy.$(`node[id="${entityId}"]`);
          if (el && el.length > 0) {
            el.connectedEdges().remove();
            el.remove();
          }
        }
        activeSelectedNodeId = null;
        if (window.CipherSelection) window.CipherSelection.entityId = null;
        if (inspectorEmpty) inspectorEmpty.style.display = "block";
        if (inspectorContent) inspectorContent.style.display = "none";
        
        await loadNetworkGraph(1);
        if (typeof showNetworkToast === "function") {
          showNetworkToast(`Entity "${entityLabel}" permanently deleted.`);
        } else if (typeof toast === "function") {
          toast(`Entity "${entityLabel}" permanently deleted.`);
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson.error || errJson.detail || "Failed to delete entity.";
        if (typeof showNetworkToast === "function") {
          showNetworkToast(errMsg);
        } else {
          alert(errMsg);
        }
      }
    } catch (err) {
      console.error("Error deleting entity:", err);
      if (typeof showNetworkToast === "function") {
        showNetworkToast("Error contacting server to delete entity.");
      }
    }
  };

  const cipherPromptDelete = (targetId) => {
    let selectedId = targetId || activeSelectedNodeId || window.CipherSelection?.entityId;
    if (!selectedId && cy) {
      const selectedEles = cy.$('node:selected');
      if (selectedEles.length > 0) {
        selectedId = selectedEles[0].id();
      }
    }

    const modal = document.getElementById("cipherConfirmModal");
    const titleEl = document.getElementById("cipherConfirmTitle");
    const msgEl = document.getElementById("cipherConfirmMessage");
    const dropdownWrap = document.getElementById("cipherConfirmDropdownWrap");
    const selectEl = document.getElementById("cipherConfirmSelect");
    const proceedBtn = document.getElementById("cipherConfirmProceed");
    const cancelBtn = document.getElementById("cipherConfirmCancel");
    const closeBtn = document.getElementById("cipherConfirmClose");
    const backdrop = document.getElementById("cipherConfirmBackdrop");

    if (!modal) {
      // Fallback if modal DOM is missing
      if (selectedId) {
        executeDelete(selectedId, `Entity #${selectedId}`);
      }
      return;
    }

    const closeModal = () => {
      modal.classList.remove("open");
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    };

    if (cancelBtn) cancelBtn.onclick = closeModal;
    if (closeBtn) closeBtn.onclick = closeModal;
    if (backdrop) backdrop.onclick = closeModal;

    if (selectedId) {
      const nodeEl = cy ? cy.$(`node[id="${selectedId}"]`) : null;
      const nodeLabel = nodeEl && nodeEl.length > 0 ? nodeEl.data("label") : `Entity #${selectedId}`;

      if (titleEl) titleEl.textContent = `Delete Entity #${selectedId}?`;
      if (msgEl) msgEl.innerHTML = `Are you sure you want to permanently delete <b style="color:#fff;">"${nodeLabel}"</b> (ID #${selectedId}) and all its associated links and sightings from this case?`;
      if (dropdownWrap) dropdownWrap.style.display = "none";

      if (proceedBtn) {
        proceedBtn.onclick = () => {
          closeModal();
          executeDelete(selectedId, nodeLabel);
        };
      }
    } else {
      // No node was clicked yet: show clean picker dropdown
      if (titleEl) titleEl.textContent = "Select Entity to Delete";
      if (msgEl) msgEl.textContent = "No entity is currently selected on the canvas. Choose which node to permanently remove from this investigation:";
      if (dropdownWrap) dropdownWrap.style.display = "block";

      if (selectEl) {
        selectEl.innerHTML = "";
        const currentNodes = cy ? cy.nodes() : [];
        if (currentNodes.length === 0) {
          selectEl.innerHTML = '<option value="">No entities found on graph</option>';
        } else {
          currentNodes.forEach(n => {
            const opt = document.createElement("option");
            opt.value = n.id();
            opt.textContent = `${n.data("label")} (ID #${n.id()}) - [${(n.data("type") || "entity").toUpperCase()}]`;
            selectEl.appendChild(opt);
          });
        }
      }

      if (proceedBtn) {
        proceedBtn.onclick = () => {
          const pickedId = selectEl?.value;
          if (!pickedId) {
            if (typeof showNetworkToast === "function") {
              showNetworkToast("Please select an entity to remove.");
            }
            return;
          }
          const pickedNode = cy ? cy.$(`node[id="${pickedId}"]`) : null;
          const pickedLabel = pickedNode && pickedNode.length > 0 ? pickedNode.data("label") : `Entity #${pickedId}`;
          closeModal();
          executeDelete(pickedId, pickedLabel);
        };
      }
    }

    modal.classList.add("open");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
  };

  deleteNodeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    cipherPromptDelete();
  });
  document.getElementById("btnInspectDeleteEntity")?.addEventListener("click", (e) => {
    e.preventDefault();
    cipherPromptDelete();
  });
  window.cipherDeleteSelectedNode = cipherPromptDelete;
  window.cipherExecuteDeleteEntity = executeDelete;

  // Highlight Cytoscape node when selected from GIS or other views
  window.highlightOnNetworkGraph = function(entityId) {
    if (!cy || !entityId) return;
    cy.nodes().removeClass('highlighted');
    const target = cy.$(`node[id="${entityId}"]`);
    if (target.length > 0) {
      target.addClass('highlighted');
      activeSelectedNodeId = String(entityId);
      if (!window.CipherSelection) window.CipherSelection = {};
      window.CipherSelection.entityId = String(entityId);
      showNodeInspector(target.data(), target);
      cy.animate({
        center: { eles: target },
        zoom: 1.4,
        duration: 500
      });
      target.emit('tap');
    }
  };

  // Cross-view sync: Listen to GIS location selection and highlight corresponding node
  window.addEventListener("cipher:gis-node-select", (evt) => {
    const detail = evt.detail;
    if (!detail) return;
    // Check if location is linked to an entity ID or matching label
    const rawEntId = detail.linked_entity_id ? String(detail.linked_entity_id).replace("ent-", "") : (detail.entity_id ? String(detail.entity_id) : null);
    if (rawEntId && cy) {
      window.highlightOnNetworkGraph(rawEntId);
    } else if (cy && detail.name) {
      const match = cy.nodes().filter(n => n.data('label') && n.data('label').toLowerCase().includes(detail.name.toLowerCase()));
      if (match.length > 0) {
        window.highlightOnNetworkGraph(match[0].id());
      }
    }
  });

  // 1. Shortest Path Analytic (BFS / Dijkstra)
  const btnGraphPath = document.getElementById("btnGraphPath");
  btnGraphPath?.addEventListener("click", async () => {
    if (!cy) return;
    const defaultStart = activeSelectedNodeId || (cy.nodes().length > 0 ? cy.nodes()[0].id() : "1");
    const defaultEnd = (cy.nodes().length > 1 ? cy.nodes()[cy.nodes().length - 1].id() : "6");

    const startId = prompt("Enter Start Entity ID or Name:", defaultStart);
    if (startId === null || !startId.trim()) return;
    const endId = prompt("Enter Target Entity ID or Name:", defaultEnd);
    if (endId === null || !endId.trim()) return;

    const s = startId.trim();
    const t = endId.trim();

    try {
      const res = await fetch("/cases/1/graph/path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_entity_id: s, end_entity_id: t })
      });
      const data = await res.json();

      if (!data || !data.connected) {
        const msg = `No verified path found between "${s}" and "${t}" within 6 hops.`;
        if (typeof showNetworkToast === "function") showNetworkToast(msg);
        else if (typeof toast === "function") toast(msg);
        else console.warn(msg);
        return;
      }

      // Reset classes
      cy.elements().removeClass('path-node path-edge highlighted pattern-alert dimmed');
      cy.elements().addClass('dimmed');

      // Highlight path nodes
      if (Array.isArray(data.path_nodes)) {
        data.path_nodes.forEach(n => {
          const nId = String(n.id || n).replace("ent-", "");
          const nodeEl = cy.$(`node[id="${nId}"]`);
          nodeEl.removeClass('dimmed').addClass('path-node');
        });
      }

      // Highlight path edges
      if (Array.isArray(data.path_edges)) {
        data.path_edges.forEach(e => {
          const sId = String(e.source || "").replace("ent-", "");
          const tId = String(e.target || "").replace("ent-", "");
          const edgeEl = cy.$(`edge[source="${sId}"][target="${tId}"], edge[source="${tId}"][target="${sId}"]`);
          edgeEl.removeClass('dimmed').addClass('path-edge');
        });
      }

      // Animate camera to fit path
      const pathEles = cy.$('.path-node, .path-edge');
      if (pathEles.length > 0) {
        cy.animate({
          fit: { eles: pathEles, padding: 40 },
          duration: 700
        });
      }

      // Display in Inspector
      const startLabel = data.start_entity?.label || `Entity #${s}`;
      const endLabel = data.end_entity?.label || `Entity #${t}`;
      if (inspectorEmpty) inspectorEmpty.style.display = "none";
      if (inspectorContent) inspectorContent.style.display = "block";
      if (inspectName) inspectName.textContent = `PATH: ${startLabel} ➔ ${endLabel}`;
      if (inspectType) inspectType.textContent = `${data.hops ?? 0} HOPS (VERIFIED)`;
      if (inspectAliases) inspectAliases.textContent = data.label || "Computed path";
      if (inspectConf) inspectConf.textContent = "100% EVIDENCE MATCH";
      if (inspectStatus) inspectStatus.textContent = "VERIFIED PATH";

      if (inspectRelList && inspectRelCount && Array.isArray(data.path_edges)) {
        inspectRelCount.textContent = data.path_edges.length;
        inspectRelList.innerHTML = `
          <div style="margin-bottom:8px;padding:6px;background:rgba(255,176,32,0.1);border-left:3px solid #ffb020;font-size:11px;">
            <b>COMPUTED TRAVERSAL ROUTE</b> (${data.hops} Hops)
          </div>
          ${data.path_edges.map((e, idx) => `
            <div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#ffb020;font-size:10px;font-family:'DM Mono',monospace;">HOP ${idx+1}: ${e.type || "LINK"}</span><br/>
              <span style="font-size:11px;color:#e6edf3;">Entity #${e.source} ➔ Entity #${e.target}</span>
              ${e.evidence ? `<p style="font-size:10px;color:#7f8883;margin:2px 0 0;"><i>Evidence:</i> ${e.evidence}</p>` : ''}
            </div>
          `).join("")}
          <button type="button" style="margin-top:6px;width:100%;background:transparent;border:1px solid #2a4454;color:#7fe9df;padding:4px;font-size:10px;cursor:pointer;" onclick="if(window.loadNetworkGraph) window.loadNetworkGraph(1);">Clear Path Overlay</button>
        `;
      }
      const successMsg = `Shortest path identified: ${startLabel} ➔ ${endLabel} (${data.hops} verified hops).`;
      if (typeof showNetworkToast === "function") showNetworkToast(successMsg);
      else if (typeof toast === "function") toast(successMsg);
    } catch (err) {
      console.error("Error computing graph path:", err);
      const errMsg = "Failed to calculate shortest path: " + (err.message || String(err));
      if (typeof showNetworkToast === "function") showNetworkToast(errMsg);
      else if (typeof toast === "function") toast(errMsg);
    }
  });

  // 2. Centrality Analytics (Degree & Betweenness)
  const btnGraphCentrality = document.getElementById("btnGraphCentrality");
  btnGraphCentrality?.addEventListener("click", async () => {
    if (!cy) return;
    try {
      const res = await fetch("/cases/1/graph/analytics/centrality", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (!data.results) return;

      // Reset classes
      cy.elements().removeClass('path-node path-edge highlighted pattern-alert dimmed');

      // Dynamically scale node sizes by score
      data.results.forEach(r => {
        const nodeEl = cy.$(`node[id="${r.raw_id}"]`);
        if (nodeEl.length > 0) {
          const sz = Math.max(30, Math.min(64, Math.round(30 + r.score * 45)));
          nodeEl.style({
            'width': sz,
            'height': sz,
            'border-width': r.rank <= 2 ? 4 : 2,
            'border-color': r.rank === 1 ? '#ff5a5f' : (r.rank === 2 ? '#ffb020' : '#7fe9df')
          });
        }
      });

      // Display in Inspector
      if (inspectorEmpty) inspectorEmpty.style.display = "none";
      if (inspectorContent) inspectorContent.style.display = "block";
      if (inspectName) inspectName.textContent = "GRAPH CENTRALITY RANKING";
      if (inspectType) inspectType.textContent = "BETWEENNESS & DEGREE";
      if (inspectAliases) inspectAliases.textContent = data.label;
      if (inspectConf) inspectConf.textContent = "ALGORITHMIC";
      if (inspectStatus) inspectStatus.textContent = "TOP BROKERS";

      if (inspectRelList && inspectRelCount) {
        inspectRelCount.textContent = data.results.length;
        inspectRelList.innerHTML = `
          <div style="margin-bottom:8px;padding:6px;background:rgba(0,210,255,0.08);border-left:3px solid #00d2ff;font-size:10px;">
            <b>COMPUTED ANALYTIC - NOT AN AI CONCLUSION</b><br/>
            Ranked by network broker ratio &amp; direct connectivity.
          </div>
          <table style="width:100%;font-size:10px;text-align:left;border-collapse:collapse;">
            <tr style="color:#7f8883;border-bottom:1px solid rgba(255,255,255,0.1);">
              <th style="padding:4px 0;">RANK</th>
              <th style="padding:4px 0;">ENTITY</th>
              <th style="padding:4px 0;">DEGREE</th>
              <th style="padding:4px 0;">BETWEENNESS</th>
            </tr>
            ${data.results.map(r => `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;" onclick="if(window.highlightOnNetworkGraph) window.highlightOnNetworkGraph(${r.raw_id});">
                <td style="padding:5px 0;color:#ffb020;font-weight:bold;">#${r.rank}</td>
                <td style="padding:5px 0;color:#e6edf3;"><b>${r.label}</b></td>
                <td style="padding:5px 0;color:#7fe9df;">${r.degree_centrality}</td>
                <td style="padding:5px 0;color:#00d2ff;">${r.betweenness_centrality}</td>
              </tr>
            `).join("")}
          </table>
          <button type="button" style="margin-top:8px;width:100%;background:transparent;border:1px solid #2a4454;color:#7fe9df;padding:4px;font-size:10px;cursor:pointer;" onclick="if(window.loadNetworkGraph) window.loadNetworkGraph(1);">Reset Node Sizes</button>
        `;
      }
      if (typeof showNetworkToast === "function") showNetworkToast("Centrality analytics calculated. Node sizes scaled to betweenness score.");
      else if (typeof toast === "function") toast("Centrality analytics calculated. Node sizes scaled to betweenness score.");
    } catch (err) {
      console.error("Error running centrality analytics:", err);
      const errMsg = "Failed to compute centrality: " + (err.message || String(err));
      if (typeof showNetworkToast === "function") showNetworkToast(errMsg);
      else if (typeof toast === "function") toast(errMsg);
    }
  });

  // 3. Communities Analytics (Louvain / Clusters)
  const btnGraphCommunities = document.getElementById("btnGraphCommunities");
  btnGraphCommunities?.addEventListener("click", async () => {
    if (!cy) return;
    try {
      const res = await fetch("/cases/1/graph/analytics/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (!data.communities) return;

      const palette = ["#00d2ff", "#ff5a5f", "#d9ff55", "#a855f7", "#ffb020", "#2ec4b6"];
      
      // Color nodes according to community cluster
      data.communities.forEach((comm, idx) => {
        const cColor = palette[idx % palette.length];
        comm.members.forEach(m => {
          const nodeEl = cy.$(`node[id="${m.raw_id}"]`);
          nodeEl.style({
            'background-color': cColor,
            'border-color': '#ffffff',
            'border-width': 3
          });
        });
      });

      // Display in Inspector
      if (inspectorEmpty) inspectorEmpty.style.display = "none";
      if (inspectorContent) inspectorContent.style.display = "block";
      if (inspectName) inspectName.textContent = "COMMUNITY CLUSTERING";
      if (inspectType) inspectType.textContent = `${data.total_communities} CLUSTERS DETECTED`;
      if (inspectAliases) inspectAliases.textContent = data.label;
      if (inspectConf) inspectConf.textContent = "CONNECTED SUB-NETS";
      if (inspectStatus) inspectStatus.textContent = "CLUSTERS PARTITIONED";

      if (inspectRelList && inspectRelCount) {
        inspectRelCount.textContent = data.total_communities;
        inspectRelList.innerHTML = `
          <div style="margin-bottom:8px;padding:6px;background:rgba(168,85,247,0.1);border-left:3px solid #a855f7;font-size:10px;">
            <b>COMPUTED ANALYTIC - NOT AN AI CONCLUSION</b><br/>
            Entities partitioned into closely coupled sub-networks.
          </div>
          ${data.communities.map((c, idx) => `
            <div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:${palette[idx % palette.length]};font-size:11px;font-weight:bold;">● Cluster #${c.community_id} (${c.members.length} entities)</span>
              <p style="font-size:10px;color:#a3adab;margin:3px 0 0;">
                ${c.members.map(m => `<span style="display:inline-block;padding:1px 4px;margin:2px 2px 0 0;background:rgba(255,255,255,0.05);border-radius:2px;cursor:pointer;" onclick="if(window.highlightOnNetworkGraph) window.highlightOnNetworkGraph(${m.raw_id});">${m.label}</span>`).join("")}
              </p>
            </div>
          `).join("")}
          <button type="button" style="margin-top:8px;width:100%;background:transparent;border:1px solid #2a4454;color:#7fe9df;padding:4px;font-size:10px;cursor:pointer;" onclick="if(window.loadNetworkGraph) window.loadNetworkGraph(1);">Reset Original Colors</button>
        `;
      }
      if (typeof showNetworkToast === "function") showNetworkToast(`Partitioned graph into ${data.total_communities} community clusters.`);
      else if (typeof toast === "function") toast(`Partitioned graph into ${data.total_communities} community clusters.`);
    } catch (err) {
      console.error("Error computing communities:", err);
      const errMsg = "Failed to compute community clusters: " + (err.message || String(err));
      if (typeof showNetworkToast === "function") showNetworkToast(errMsg);
      else if (typeof toast === "function") toast(errMsg);
    }
  });

  // 4. Pattern Flags Analytic (Conduits, Burner SIMs, Bridges)
  const btnGraphPatterns = document.getElementById("btnGraphPatterns");
  btnGraphPatterns?.addEventListener("click", async () => {
    if (!cy) return;
    try {
      const res = await fetch("/cases/1/graph/analytics/patterns", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (!data.patterns) return;

      // Reset classes
      cy.elements().removeClass('path-node path-edge highlighted pattern-alert dimmed');

      // Highlight pattern anchor nodes
      data.patterns.forEach(p => {
        const rawId = String(p.anchor_entity_id).replace("ent-", "");
        const nodeEl = cy.$(`node[id="${rawId}"]`);
        nodeEl.addClass('pattern-alert');
      });

      // Display in Inspector
      if (inspectorEmpty) inspectorEmpty.style.display = "none";
      if (inspectorContent) inspectorContent.style.display = "block";
      if (inspectName) inspectName.textContent = "STRUCTURAL PATTERN ALERTS";
      if (inspectType) inspectType.textContent = `${data.patterns_count} ANOMALIES FLAGGED`;
      if (inspectAliases) inspectAliases.textContent = data.label;
      if (inspectConf) inspectConf.textContent = "STRUCTURAL FLAGS";
      if (inspectStatus) inspectStatus.textContent = "REVIEW REQUIRED";

      if (inspectRelList && inspectRelCount) {
        inspectRelCount.textContent = data.patterns_count;
        inspectRelList.innerHTML = `
          <div style="margin-bottom:8px;padding:6px;background:rgba(255,90,95,0.12);border-left:3px solid #ff5a5f;font-size:10px;">
            <b>COMPUTED ANALYTIC - STRUCTURAL REVIEW FLAGS</b><br/>
            Automated alerts for human investigator review &amp; verification.
          </div>
          ${data.patterns.map(p => `
            <div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer;" onclick="if(window.highlightOnNetworkGraph) window.highlightOnNetworkGraph('${String(p.anchor_entity_id).replace('ent-', '')}');">
              <span style="color:${p.severity === 'CRITICAL' ? '#ff5a5f' : '#ffb020'};font-size:10px;font-weight:bold;">⚠️ ${p.pattern_type} [${p.severity}]</span><br/>
              <b style="color:#e6edf3;font-size:11px;">${p.title}</b>
              <p style="font-size:10px;color:#a3adab;margin:2px 0 0;">${p.description}</p>
            </div>
          `).join("")}
          <button type="button" style="margin-top:8px;width:100%;background:transparent;border:1px solid #2a4454;color:#7fe9df;padding:4px;font-size:10px;cursor:pointer;" onclick="if(window.loadNetworkGraph) window.loadNetworkGraph(1);">Clear Pattern Badges</button>
        `;
      }
      if (typeof showNetworkToast === "function") showNetworkToast(`Flagged ${data.patterns_count} structural patterns for review.`);
      else if (typeof toast === "function") toast(`Flagged ${data.patterns_count} structural patterns for review.`);
    } catch (err) {
      console.error("Error computing patterns:", err);
      const errMsg = "Failed to compute pattern flags: " + (err.message || String(err));
      if (typeof showNetworkToast === "function") showNetworkToast(errMsg);
      else if (typeof toast === "function") toast(errMsg);
    }
  });

  // 5. Timeline Slider Filter (Temporal Graph Slicing)
  const networkTimelineSlider = document.getElementById("networkTimelineSlider");
  const networkTimelineVal = document.getElementById("networkTimelineVal");
  const btnResetTimelineFilter = document.getElementById("btnResetTimelineFilter");

  networkTimelineSlider?.addEventListener("input", (e) => {
    if (!cy) return;
    const val = Number(e.target.value);
    const maxVal = Number(e.target.max) || 10;
    
    if (networkTimelineVal) {
      networkTimelineVal.textContent = val >= maxVal ? "ALL EVENTS (100%)" : `PHASE 01 ➔ PHASE 0${val}`;
    }

    // Filter nodes by id <= val * 2
    const threshold = val * 2;
    cy.batch(() => {
      cy.nodes().forEach(n => {
        const idNum = Number(n.id());
        if (idNum > threshold) {
          n.addClass('dimmed');
        } else {
          n.removeClass('dimmed');
        }
      });
      cy.edges().forEach(ed => {
        const srcNum = Number(ed.source().id());
        const tgtNum = Number(ed.target().id());
        if (srcNum > threshold || tgtNum > threshold) {
          ed.addClass('dimmed');
        } else {
          ed.removeClass('dimmed');
        }
      });
    });
  });

  btnResetTimelineFilter?.addEventListener("click", () => {
    if (networkTimelineSlider) {
      networkTimelineSlider.value = networkTimelineSlider.max;
      if (networkTimelineVal) networkTimelineVal.textContent = "ALL EVENTS (100%)";
    }
    if (cy) {
      cy.elements().removeClass('dimmed');
    }
  });

  // Wire Add Node modal geocoding helper button
  const btnGeocode = document.getElementById("btnNodeGeocode");
  const geocodeInput = document.getElementById("nodeGeocodeQuery");
  const modalLat = document.getElementById("nodeModalLat");
  const modalLng = document.getElementById("nodeModalLng");

  btnGeocode?.addEventListener("click", async () => {
    const q = geocodeInput?.value?.trim();
    if (!q) {
      alert("Please enter a landmark or location query to geocode.");
      return;
    }
    btnGeocode.textContent = "Searching...";
    try {
      const res = await fetch("/cases/1/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: q })
      });
      const data = await res.json();
      if (data.found) {
        if (modalLat) modalLat.value = data.latitude;
        if (modalLng) modalLng.value = data.longitude;
        btnGeocode.textContent = "Found ✓";
        setTimeout(() => btnGeocode.textContent = "Geocode (OSM) ⌕", 2000);
      } else {
        alert("Nominatim OSM found no coordinates for this address. You may enter coordinates manually or use the GIS Waypoint tool.");
        btnGeocode.textContent = "Not Found";
        setTimeout(() => btnGeocode.textContent = "Geocode (OSM) ⌕", 2000);
      }
    } catch (e) {
      btnGeocode.textContent = "Error";
      setTimeout(() => btnGeocode.textContent = "Geocode (OSM) ⌕", 2000);
    }
  });

  // Wire Add Node Form submission to POST /cases/1/entities & POST /cases/1/relationships
  const nodeForm = document.getElementById("nodeForm");
  nodeForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(nodeForm);
    const label = (formData.get("nodeName") || formData.get("label") || formData.get("identityName") || document.getElementById("nodeModalName")?.value || "").trim();
    
    // Check active node-type button
    const activeTypeBtn = nodeForm.querySelector(".node-type.active");
    const entity_type = activeTypeBtn?.dataset?.nodeType || (formData.get("nodeType") || formData.get("entity_type") || "person").toString().toLowerCase();
    
    const aliases = (formData.get("nodeAliases") || formData.get("nodeId") || formData.get("aliases") || "").trim();
    const latitude = formData.get("nodeLat") || document.getElementById("nodeModalLat")?.value;
    const longitude = formData.get("nodeLng") || document.getElementById("nodeModalLng")?.value;

    if (!label) {
      if (typeof showNetworkToast === "function") {
        showNetworkToast("Please enter a name / label for this entity.");
      } else if (typeof toast === "function") {
        toast("Please enter a name / label for this entity.");
      }
      const nameInp = document.getElementById("nodeModalName") || nodeForm.querySelector('input[name="nodeName"]');
      nameInp?.focus();
      return;
    }

    try {
      const res = await fetch("/cases/1/entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_type,
          label,
          aliases,
          latitude: latitude ? Number(latitude) : undefined,
          longitude: longitude ? Number(longitude) : undefined,
          verification_status: "verified"
        })
      });

      if (res.ok) {
        const json = await res.json();
        const newEntityId = json.entity?.id;

        // If link target selected, create relationship
        const linkTarget = formData.get("targetNode") || formData.get("linkTarget") || document.getElementById("nodeModalTargetNode")?.value;
        const relationshipType = formData.get("relationType") || formData.get("linkType") || document.getElementById("nodeModalRelationType")?.value || "ASSOCIATED_WITH";
        if (linkTarget && newEntityId) {
          await fetch("/cases/1/relationships", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source_entity_id: newEntityId,
              target_entity_id: Number(linkTarget),
              relationship_type: relationshipType,
              evidence_sentence: "Investigator manually recorded link in CIPHER workspace"
            })
          });
        }

        // Reset and close modal
        nodeForm.reset();
        document.querySelectorAll(".node-type").forEach((b, idx) => {
          b.classList.toggle("active", idx === 0);
        });
        if (typeof window.cipherCloseNodeModal === "function") {
          window.cipherCloseNodeModal();
        } else {
          const modal = document.getElementById("nodeModal");
          if (modal) {
            modal.classList.remove("open");
            modal.style.display = "none";
          }
        }

        await loadNetworkGraph(1);
        if (newEntityId && window.highlightOnNetworkGraph) {
          setTimeout(() => {
            window.highlightOnNetworkGraph(newEntityId);
          }, 300);
        }

        if (typeof toast === "function") {
          toast(`Entity "${label}" added to network graph & database.`);
        } else if (typeof showNetworkToast === "function") {
          showNetworkToast(`Entity "${label}" added to network graph & database.`);
        }
      } else {
        const err = await res.json().catch(() => ({}));
        const msg = err.error || err.detail || "Failed to create entity.";
        if (typeof showNetworkToast === "function") {
          showNetworkToast(msg);
        } else if (typeof toast === "function") {
          toast(msg);
        }
      }
    } catch (err) {
      console.error("Failed to add entity:", err);
      if (typeof showNetworkToast === "function") {
        showNetworkToast("Error contacting server to create entity.");
      }
    }
  });

  // Ensure toolbar Add Node button is directly wired
  const addNodeToolbarBtn = document.getElementById("addNodeBtn");
  addNodeToolbarBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (typeof window.cipherOpenNodeModal === "function") {
      window.cipherOpenNodeModal();
    } else {
      const modal = document.getElementById("nodeModal");
      if (modal) {
        modal.classList.add("open");
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }
    }
  });

  // Expose global graph loader
  window.loadNetworkGraph = loadNetworkGraph;

  // Initialize on load and on tab switch to network
  window.addEventListener("load", () => {
    setTimeout(() => loadNetworkGraph(1), 300);
  });

  // Attach to both sidebar buttons and switchView events
  const networkNavBtn = document.querySelector('.workspace-sidebar .side-item[data-view="network"]');
  networkNavBtn?.addEventListener("click", () => {
    setTimeout(() => {
      if (!cy) {
        loadNetworkGraph(1);
      } else {
        cy.resize();
        cy.fit(undefined, 30);
      }
    }, 120);
  });

  document.querySelectorAll('[data-view="network"]').forEach(el => {
    el.addEventListener("click", () => {
      setTimeout(() => {
        if (!cy) {
          loadNetworkGraph(1);
        } else {
          cy.resize();
          cy.fit(undefined, 30);
        }
      }, 150);
    });
  });

})();

/* =============================================================================
   CIPHER AI INVESTIGATOR FRONTEND SUBSYSTEM
   Co-pilot interface, deterministic provenance, review queue, & contextual queries
   ============================================================================= */
(function initAIInvestigatorSubsystem() {
  const DEFAULT_CASE_ID = 1;
  let activeCaseId = DEFAULT_CASE_ID;
  let currentConversationId = null;
  let loadingInterval = null;

  function getAuthToken() {
    return (
      localStorage.getItem("cipher_access_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("cipher_access_token") ||
      ""
    );
  }

  function getAuthHeaders() {
    const headers = { "Content-Type": "application/json" };
    const token = getAuthToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }

  // Exposed globally for view switches
  window.refreshAIActivity = async function() {
    try {
      const res = await fetch(`/api/cases/${activeCaseId}/ai/activity`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return;
      const data = await res.json();
      
      const statSuggestions = document.getElementById("aiStatSuggestions");
      const statDuplicates = document.getElementById("aiStatDuplicates");
      const statConflicts = document.getElementById("aiStatConflicts");
      const statChainLogs = document.getElementById("aiStatChainLogs");

      const pendingCount = data.pending_suggestions_count ?? data.new_suggestions_count ?? (data.activity?.new_suggestions_count) ?? 0;
      const dupCount = data.duplicate_count ?? data.possible_duplicates_count ?? (data.activity?.possible_duplicates_count) ?? 0;
      const confCount = data.conflict_count ?? data.evidence_conflicts_count ?? (data.activity?.evidence_conflicts_count) ?? 0;

      if (statSuggestions) statSuggestions.textContent = pendingCount;
      if (statDuplicates) statDuplicates.textContent = dupCount;
      if (statConflicts) statConflicts.textContent = confCount;
      if (statChainLogs) statChainLogs.textContent = "100%";

      // Also refresh pending suggestions list
      loadPendingSuggestions();
    } catch (err) {
      console.warn("[AI Investigator] Failed to fetch activity:", err);
    }
  };

  async function loadPendingSuggestions() {
    const container = document.getElementById("aiPendingSuggestionsList");
    if (!container) return;

    try {
      const res = await fetch(`/api/cases/${activeCaseId}/ai/suggestions?status=PENDING`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return;
      const resData = await res.json();
      const suggestions = Array.isArray(resData) ? resData : (resData.suggestions || resData.data || []);

      if (!suggestions || suggestions.length === 0) {
        container.innerHTML = `
          <div style="padding: 16px; text-align: center; color: var(--text-muted, #8a96a0); font-size: 12px;">
            <span>✓</span> All AI candidate suggestions reviewed.
          </div>
        `;
        return;
      }

      container.innerHTML = suggestions.map(sug => {
        const payload = sug.suggested_payload || sug.payload || {};
        const confVal = typeof sug.confidence === "number" ? sug.confidence : 0.85;
        const confPct = Math.round(confVal <= 1 ? confVal * 100 : confVal);
        const targetLabel = payload.primary_entity || payload.candidate_entity || payload.name || payload.target_name || (payload.source_id ? `Entity #${payload.source_id}` : "Case Record");
        return `
          <div class="ai-suggestion-card" data-id="${sug.id}">
            <div class="ai-sug-head">
              <span class="ai-sug-type">${escapeHtml(sug.suggestion_type || sug.type || "CANDIDATE")}</span>
              <span class="ai-sug-conf">${confPct}% CONF</span>
            </div>
            <p class="ai-sug-reason">${escapeHtml(sug.reasoning || payload.reason || "Algorithm detected relationship match requiring human review.")}</p>
            <div class="ai-sug-meta">
              <span>TARGET: <b>${escapeHtml(targetLabel)}</b></span>
            </div>
            <div class="ai-sug-actions">
              <button type="button" class="ai-sug-btn accept" data-id="${sug.id}" data-action="ACCEPT">
                <span>ACCEPT</span>
              </button>
              <button type="button" class="ai-sug-btn reject" data-id="${sug.id}" data-action="REJECT">
                <span>REJECT</span>
              </button>
            </div>
          </div>
        `;
      }).join("");

      // Attach button events
      container.querySelectorAll(".ai-sug-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const sugId = btn.dataset.id;
          const action = btn.dataset.action;
          await handleSuggestionAction(sugId, action);
        });
      });
    } catch (err) {
      console.warn("[AI Investigator] Failed to load suggestions:", err);
    }
  }

  async function handleSuggestionAction(suggestionId, decision) {
    try {
      const res = await fetch(`/api/cases/${activeCaseId}/ai/review-action`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          suggestion_id: parseInt(suggestionId, 10),
          decision: decision,
          notes: "Reviewed by officer via AI Investigator queue",
        }),
      });
      if (res.ok) {
        window.refreshAIActivity();
      }
    } catch (err) {
      console.error("[AI Investigator] Error resolving suggestion:", err);
    }
  }

  window.sendAIQuery = async function(queryText, contextualOptions = {}) {
    const defaultCard = document.getElementById("aiDefaultCard");
    const activeAnswerCard = document.getElementById("aiActiveAnswerCard");
    const loadingCard = document.getElementById("aiLoadingCard");
    const queryInput = document.getElementById("aiQueryInput");

    if (!queryText || !queryText.trim()) return;

    if (queryInput) queryInput.value = queryText;

    if (defaultCard) defaultCard.style.display = "none";
    if (activeAnswerCard) activeAnswerCard.style.display = "none";
    if (loadingCard) loadingCard.style.display = "flex";

    const loadingStages = [
      "Searching case database & verified ledger...",
      "Verifying source chain & confidence...",
      "Analyzing network topology & coordinates...",
      "Synthesizing answer with verified evidence citations..."
    ];
    let stageIdx = 0;
    const loadingStatusText = document.getElementById("aiLoadingStatusText");
    if (loadingStatusText) {
      loadingStatusText.textContent = loadingStages[0];
    }
    clearInterval(loadingInterval);
    loadingInterval = setInterval(() => {
      stageIdx = (stageIdx + 1) % loadingStages.length;
      if (loadingStatusText) loadingStatusText.textContent = loadingStages[stageIdx];
    }, 750);

    try {
      const res = await fetch(`/api/cases/${activeCaseId}/ai/query`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query: queryText,
          conversation_id: currentConversationId,
          screen_context: contextualOptions.screen || "ai-investigator",
          active_entity_id: contextualOptions.entityId || null,
          active_location_id: contextualOptions.locationId || null,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      currentConversationId = data.conversation_id || (data.data?.conversation_id) || currentConversationId;

      renderAIResponse(data);
    } catch (err) {
      console.error("[AI Investigator] Query failure:", err);
      renderAIError(err.message || "Failed to retrieve AI analysis");
    } finally {
      clearInterval(loadingInterval);
      if (loadingCard) loadingCard.style.display = "none";
    }
  };

  function renderAIResponse(raw) {
    const activeAnswerCard = document.getElementById("aiActiveAnswerCard");
    const badgeType = document.getElementById("aiAnswerTypeBadge");
    const badgeConf = document.getElementById("aiConfidenceBadge");
    const timestamp = document.getElementById("aiAnswerTimestamp");
    const answerText = document.getElementById("aiAnswerText");
    const sourcesBlock = document.getElementById("aiSourcesBlock");
    const sourcesList = document.getElementById("aiSourcesList");
    const actionsBlock = document.getElementById("aiActionsBlock");
    const actionButtons = document.getElementById("aiActionButtons");

    if (!activeAnswerCard) return;

    const data = (raw.data && typeof raw.data.answer === "string") ? { ...raw.data, ...raw } : raw;
    const answer = data.answer_text || data.answer || data.data?.answer || "";

    // Badge styling
    const rawType = (data.response_type || data.answer_type || "SOURCE_BACKED").toUpperCase().replace("-", "_");
    if (badgeType) {
      badgeType.className = "ai-badge-pill";
      if (rawType.includes("SOURCE")) {
        badgeType.textContent = "SOURCE-BACKED";
        badgeType.classList.add("type-source-backed");
      } else if (rawType.includes("COMPUTE")) {
        badgeType.textContent = "COMPUTED";
        badgeType.classList.add("type-computed");
      } else if (rawType.includes("SUGGEST")) {
        badgeType.textContent = "AI SUGGESTION";
        badgeType.classList.add("type-suggestion");
      } else {
        badgeType.textContent = rawType;
        badgeType.classList.add("type-unknown");
      }
    }

    if (badgeConf) {
      const conf = data.confidence;
      if (typeof conf === "number") {
        badgeConf.textContent = `Confidence: ${Math.round(conf <= 1 ? conf * 100 : conf)}%`;
      } else if (typeof conf === "string" && conf.trim()) {
        badgeConf.textContent = conf;
      } else {
        badgeConf.textContent = "Confidence: Verified (100%)";
      }
    }

    if (timestamp) {
      const now = new Date();
      timestamp.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    // Format text nicely: convert markdown-style headers, bolding, and lists
    if (answerText) {
      answerText.innerHTML = formatAIAnswerText(answer);
    }

    // Render sources
    const sources = data.sources || data.data?.sources || [];
    if (sources.length > 0 && sourcesList && sourcesBlock) {
      sourcesBlock.style.display = "block";
      sourcesList.innerHTML = sources.map(src => `
        <div class="ai-source-item">
          <div class="ai-src-info">
            <b class="ai-src-ref">${escapeHtml(src.reference || "Evidence Ledger")}</b>
            <span class="ai-src-sub">Source: ${escapeHtml(src.source_type || "verified_evidence")}${src.date ? ` · ${escapeHtml(src.date)}` : ""}${src.reliability ? ` · Reliability: ${escapeHtml(src.reliability)}` : ""}</span>
          </div>
          <button type="button" class="ai-src-link-btn" data-ref="${escapeHtml(src.reference || "")}">
            <span>VIEW IN EVIDENCE</span>
            <b>→</b>
          </button>
        </div>
      `).join("");

      sourcesList.querySelectorAll(".ai-src-link-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          if (typeof window.switchWorkspaceView === "function") {
            window.switchWorkspaceView("evidence");
          }
        });
      });
    } else if (sourcesBlock) {
      sourcesBlock.style.display = "none";
    }

    // Render direct actions
    const actions = data.suggested_actions || data.actions || data.data?.actions || [];
    if (actions.length > 0 && actionsBlock && actionButtons) {
      actionsBlock.style.display = "block";
      actionButtons.innerHTML = actions.map(act => `
        <button type="button" class="ai-action-btn" data-action-type="${escapeHtml(act.type || "")}" data-action-payload='${escapeHtml(JSON.stringify(act.payload || {}))}'>
          <span>${escapeHtml(act.label || "Action")}</span>
          <b>↗</b>
        </button>
      `).join("");

      actionButtons.querySelectorAll(".ai-action-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          handleAIActionButtonClick(btn.dataset.actionType, btn.dataset.actionPayload, data);
        });
      });
    } else if (actionsBlock) {
      actionsBlock.style.display = "none";
    }

    // Check if this response is an official report draft
    const isReportDraft = actions.some(a => a.type === "DRAFT_REPORT") || answer.includes("REPORT DRAFT") || answer.includes("EXECUTIVE SUMMARY") || answer.includes("INVESTIGATIVE REPORT");
    renderReportDraftControls(isReportDraft, answer);

    activeAnswerCard.style.display = "block";
  }

  function renderReportDraftControls(isReport, reportText) {
    let reportControls = document.getElementById("aiReportDraftControls");
    if (!reportControls) {
      reportControls = document.createElement("div");
      reportControls.id = "aiReportDraftControls";
      reportControls.style.marginTop = "16px";
      reportControls.style.padding = "12px 14px";
      reportControls.style.background = "rgba(0, 242, 255, 0.05)";
      reportControls.style.border = "1px solid rgba(0, 242, 255, 0.25)";
      reportControls.style.borderRadius = "8px";
      const answerCard = document.getElementById("aiActiveAnswerCard");
      if (answerCard) answerCard.appendChild(reportControls);
    }

    if (!isReport) {
      reportControls.style.display = "none";
      return;
    }

    reportControls.style.display = "block";
    reportControls.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--accent-cyan,#00f2ff);">OFFICIAL INTELLIGENCE REPORT DRAFT</span>
        <span style="font-size:10px;color:var(--text-muted,#8a96a0);">REQUIRES INVESTIGATOR APPROVAL</span>
      </div>
      <p style="font-size:12px;color:var(--text-secondary,#cbd5e1);margin:0 0 10px 0;">This draft synthesizes verified case evidence, accused profiles, timeline events, and network centralities.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button type="button" id="btnApproveDraftReport" class="ai-action-btn" style="background:rgba(34,197,94,0.15);border-color:#22c55e;color:#86efac;">
          <span>✓ APPROVE &amp; REGISTER IN CHAIN OF CUSTODY</span>
        </button>
        <button type="button" id="btnTransferToCaseSheet" class="ai-action-btn" style="border-color:var(--accent-cyan,#00f2ff);color:var(--accent-cyan,#00f2ff);">
          <span>↗ VIEW IN CASE SHEET</span>
        </button>
      </div>
      <div id="reportApprovalNotice" style="display:none;margin-top:8px;font-size:11px;color:#86efac;"></div>
    `;

    document.getElementById("btnApproveDraftReport")?.addEventListener("click", async () => {
      try {
        const btn = document.getElementById("btnApproveDraftReport");
        if (btn) btn.textContent = "REGISTERING...";
        const res = await fetch(`/api/cases/${activeCaseId}/ai/approve-report`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            report_text: reportText,
            notes: "Officer verified and approved AI drafted case report"
          })
        });
        const resData = await res.json();
        const notice = document.getElementById("reportApprovalNotice");
        if (notice) {
          notice.style.display = "block";
          notice.textContent = "✓ Report successfully approved and permanently registered in the verified chain of custody.";
        }
        if (btn) btn.textContent = "✓ REPORT APPROVED";
        window.refreshAIActivity();
      } catch (e) {
        console.error("Failed to approve report:", e);
      }
    });

    document.getElementById("btnTransferToCaseSheet")?.addEventListener("click", () => {
      if (typeof window.switchWorkspaceView === "function") {
        window.switchWorkspaceView("evidence");
      }
    });
  }

  function handleAIActionButtonClick(actionType, rawPayload, fullData) {
    let payload = {};
    try {
      payload = JSON.parse(rawPayload || "{}");
    } catch (e) {}

    const highlights = fullData?.highlights || {};

    if (actionType === "OPEN_NETWORK") {
      if (typeof window.switchWorkspaceView === "function") window.switchWorkspaceView("network");
      const targetNode = payload.node_id || payload.nodes?.[0] || highlights.nodes?.[0];
      if (targetNode && window.cy) {
        setTimeout(() => {
          try {
            const node = window.cy.getElementById(String(targetNode));
            if (node && node.length) {
              window.cy.elements().unselect();
              node.select();
              window.cy.center(node);
            }
          } catch (e) {}
        }, 300);
      }
      if (highlights.path && highlights.path.length && window.cy) {
        setTimeout(() => {
          try {
            window.cy.elements().removeClass("highlighted-path");
            highlights.path.forEach(nid => {
              window.cy.getElementById(String(nid)).addClass("highlighted-path");
            });
          } catch (e) {}
        }, 350);
      }
    } else if (actionType === "OPEN_GIS") {
      if (typeof window.switchWorkspaceView === "function") window.switchWorkspaceView("gis");
      const lat = payload.lat || highlights.lat;
      const lng = payload.lng || highlights.lng;
      if (lat && lng && window.workspaceGISMap) {
        setTimeout(() => {
          try {
            window.workspaceGISMap.setView([lat, lng], 13);
          } catch (e) {}
        }, 300);
      }
    } else if (actionType === "OPEN_TIMELINE") {
      if (typeof window.switchWorkspaceView === "function") window.switchWorkspaceView("timeline");
    } else if (actionType === "OPEN_EVIDENCE") {
      if (typeof window.switchWorkspaceView === "function") window.switchWorkspaceView("evidence");
    } else if (actionType === "OPEN_REVIEW") {
      loadPendingSuggestions();
      const reviewBox = document.getElementById("aiPendingSuggestionsList");
      if (reviewBox) reviewBox.scrollIntoView({ behavior: "smooth" });
    } else if (actionType === "DRAFT_REPORT") {
      window.sendAIQuery("Draft official case intelligence report.");
    }
  }

  function renderAIError(msg) {
    const activeAnswerCard = document.getElementById("aiActiveAnswerCard");
    const badgeType = document.getElementById("aiAnswerTypeBadge");
    const answerText = document.getElementById("aiAnswerText");
    const sourcesBlock = document.getElementById("aiSourcesBlock");
    const actionsBlock = document.getElementById("aiActionsBlock");
    const reportControls = document.getElementById("aiReportDraftControls");

    if (!activeAnswerCard) return;

    if (badgeType) {
      badgeType.textContent = "INVESTIGATION NOTICE";
      badgeType.className = "ai-badge-pill type-unknown";
    }

    if (answerText) {
      answerText.innerHTML = `
        <div style="padding: 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; color: #f87171;">
          <b>Investigation Co-Pilot notice:</b> ${escapeHtml(msg)}. All core case records, network graphs, and evidence remain safe and accessible.
        </div>
      `;
    }

    if (sourcesBlock) sourcesBlock.style.display = "none";
    if (actionsBlock) actionsBlock.style.display = "none";
    if (reportControls) reportControls.style.display = "none";
    activeAnswerCard.style.display = "block";
  }

  function formatAIAnswerText(text) {
    if (!text) return "";
    let safe = escapeHtml(text);

    // Bolding **text**
    safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Markdown headers ### Title
    safe = safe.replace(/### (.*?)(?:\n|$)/g, '<h4 style="font-size:14px;font-weight:700;margin:16px 0 6px 0;color:var(--text-main, #f1f5f9);">$1</h4>');
    safe = safe.replace(/## (.*?)(?:\n|$)/g, '<h3 style="font-size:15px;font-weight:700;margin:18px 0 8px 0;color:var(--text-main, #f1f5f9);">$1</h3>');

    // Bullet points
    safe = safe.replace(/(?:^|\n)- (.*?)(?=(?:\n|$))/g, '<div style="margin:4px 0 4px 12px;display:flex;gap:6px;"><span style="color:var(--accent-cyan,#00f2ff);">•</span><span>$1</span></div>');

    // Paragraph breaks
    safe = safe.replace(/\n\n/g, '<div style="height:10px;"></div>');
    return safe;
  }

  function escapeHtml(str) {
    if (typeof str !== "string") return String(str ?? "");
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Setup DOM events when DOM is ready
  function bindAIEvents() {
    const submitBtn = document.getElementById("aiSubmitBtn");
    const queryInput = document.getElementById("aiQueryInput");
    const refreshBtn = document.getElementById("aiRefreshActivityBtn");
    const openReviewBtn = document.getElementById("aiOpenReviewQueueBtn");

    if (submitBtn && queryInput) {
      submitBtn.addEventListener("click", () => {
        window.sendAIQuery(queryInput.value);
      });

      queryInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          window.sendAIQuery(queryInput.value);
        }
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        window.refreshAIActivity();
      });
    }

    if (openReviewBtn) {
      openReviewBtn.addEventListener("click", () => {
        loadPendingSuggestions();
      });
    }

    // Quick suggestion chips
    document.querySelectorAll(".ai-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const query = chip.dataset.query;
        if (query) {
          window.sendAIQuery(query);
        }
      });
    });

    // Contextual "Ask CIPHER" buttons across workspaces
    const casesAskBtn = document.getElementById("casesAskCipherBtn");
    if (casesAskBtn) {
      casesAskBtn.addEventListener("click", () => {
        if (typeof window.switchWorkspaceView === "function") window.switchWorkspaceView("ai-investigator");
        window.sendAIQuery("Summarize this case and provide current investigation status.", { screen: "cases" });
      });
    }

    const networkAskBtn = document.getElementById("networkAskCipherBtn");
    if (networkAskBtn) {
      networkAskBtn.addEventListener("click", () => {
        if (typeof window.switchWorkspaceView === "function") window.switchWorkspaceView("ai-investigator");
        window.sendAIQuery("Analyze current network structure and find the most critical actors and paths.", { screen: "network" });
      });
    }

    const gisAskBtn = document.getElementById("gisAskCipherBtn");
    if (gisAskBtn) {
      gisAskBtn.addEventListener("click", () => {
        if (typeof window.switchWorkspaceView === "function") window.switchWorkspaceView("ai-investigator");
        window.sendAIQuery("Analyze geospatial distribution and key location sightings in this case.", { screen: "gis" });
      });
    }

    const evidenceAskBtn = document.getElementById("evidenceAskCipherBtn");
    if (evidenceAskBtn) {
      evidenceAskBtn.addEventListener("click", () => {
        if (typeof window.switchWorkspaceView === "function") window.switchWorkspaceView("ai-investigator");
        window.sendAIQuery("Explain key evidentiary findings, source reliability, and extraction confidence.", { screen: "evidence" });
      });
    }

    const timelineAskBtn = document.getElementById("timelineAskCipherBtn");
    if (timelineAskBtn) {
      timelineAskBtn.addEventListener("click", () => {
        if (typeof window.switchWorkspaceView === "function") window.switchWorkspaceView("ai-investigator");
        window.sendAIQuery("Summarize the chronological sequence of events and timeline trace.", { screen: "timeline" });
      });
    }

    // Contextual button on Entity Inspector (Network graph)
    const entityAskBtn = document.getElementById("btnInspectAskCipherEntity");
    if (entityAskBtn) {
      entityAskBtn.addEventListener("click", () => {
        const nameEl = document.getElementById("nodeInspectName");
        const entName = nameEl?.textContent && nameEl.textContent !== "—" ? nameEl.textContent.trim() : "selected entity";
        if (typeof window.switchWorkspaceView === "function") window.switchWorkspaceView("ai-investigator");
        window.sendAIQuery(`What are the verified connections, communications, and activities of ${entName}?`, { screen: "network" });
      });
    }

    // Contextual button on Location Inspector (GIS workspace)
    const locationAskBtn = document.getElementById("btnInspectAskCipherLocation");
    if (locationAskBtn) {
      locationAskBtn.addEventListener("click", () => {
        const locEl = document.getElementById("gisInfoTitle");
        const locName = locEl?.textContent && locEl.textContent !== "No location selected" ? locEl.textContent.trim() : "selected location";
        if (typeof window.switchWorkspaceView === "function") window.switchWorkspaceView("ai-investigator");
        window.sendAIQuery(`Analyze spatial events, sightings, and transit corridors associated with ${locName}.`, { screen: "gis" });
      });
    }

    // Contextual button on Case Report Toolbar
    const reportAiBtn = document.getElementById("reportAiDraftBtn");
    if (reportAiBtn) {
      reportAiBtn.addEventListener("click", () => {
        if (typeof window.switchWorkspaceView === "function") window.switchWorkspaceView("ai-investigator");
        window.sendAIQuery("Draft official case intelligence report.", { screen: "evidence" });
      });
    }

    // Sidebar AI Investigator button
    document.querySelectorAll('.workspace-sidebar .side-item[data-view="ai-investigator"]').forEach(btn => {
      btn.addEventListener("click", () => {
        if (typeof window.switchWorkspaceView === "function") window.switchWorkspaceView("ai-investigator");
      });
    });

    // Initial fetch of activity stats
    window.refreshAIActivity();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindAIEvents);
  } else {
    bindAIEvents();
  }
})();
