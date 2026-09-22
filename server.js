"use strict";
const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");
const db = new DatabaseSync(path.join(__dirname, "data.sqlite")),
  root = path.join(__dirname, "public"),
  port = +process.env.PORT || 3000;
const slots = ["10:00", "14:00", "16:30", "17:30"],
  capacity = +process.env.SLOT_CAPACITY || 8,
  now = () => new Date().toISOString();
const json = (r, s, x, h = {}) => {
  r.writeHead(s, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...h,
  });
  r.end(JSON.stringify(x));
};
const list = (x) => {
    try {
      return JSON.parse(x || "[]");
    } catch {
      return [];
    }
  },
  activity = (x) => ({
    ...x,
    gallery: list(x.gallery),
    inclusions: list(x.inclusions),
    good_to_know: list(x.good_to_know),
    itinerary: list(x.itinerary),
  });
function setup() {
  db.exec(
    "PRAGMA foreign_keys=ON;" +
      "CREATE TABLE IF NOT EXISTS activities(id INTEGER PRIMARY KEY,slug TEXT UNIQUE,title TEXT,category TEXT,description TEXT,price_from REAL,duration_min INTEGER,duration_max INTEGER,hero TEXT,gallery TEXT,inclusions TEXT,good_to_know TEXT,itinerary TEXT,active INTEGER DEFAULT 1);" +
      "CREATE TABLE IF NOT EXISTS packs(id INTEGER PRIMARY KEY,slug TEXT UNIQUE,title TEXT,description TEXT,price_from REAL,duration TEXT,hero TEXT,includes_json TEXT,active INTEGER DEFAULT 1);" +
      "CREATE TABLE IF NOT EXISTS bookings(id TEXT PRIMARY KEY,activity_slug TEXT,pack_slug TEXT,customer_name TEXT,email TEXT,phone TEXT,date TEXT,time TEXT,guests INTEGER,base_price REAL,addon_price REAL DEFAULT 0,total_price REAL,status TEXT DEFAULT 'NOT PAID YET',created_at TEXT,arrived_at TEXT);" +
      "CREATE TABLE IF NOT EXISTS notifications(id INTEGER PRIMARY KEY,booking_id TEXT,type TEXT,message TEXT,created_at TEXT,read_at TEXT);" +
      "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,username TEXT UNIQUE,role TEXT,password_hash TEXT,created_at TEXT);" +
      "CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,user_id INTEGER,expires_at TEXT);" +
      "CREATE INDEX IF NOT EXISTS booking_slot ON bookings(activity_slug,date,time);",
  );
  let add = db.prepare(
    "INSERT OR IGNORE INTO activities(slug,title,category,description,price_from,duration_min,duration_max,hero,gallery,inclusions,good_to_know,itinerary) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
  );
  let seed = [
    [
      "quad-atlantic",
      "Atlantic Quad Escape",
      "Quad",
      "Ride the wild Atlantic edge of Timlaline: sand tracks, open horizons and the rush of the coast.",
      380,
      60,
      90,
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
      [
        "Helmet and safety briefing",
        "Local guide",
        "Premium quad",
        "Atlantic viewpoints",
      ],
      ["Bring valid ID", "Wear closed shoes", "Weather can change quickly"],
      [
        ["Meet", "Welcome and safety briefing at base camp."],
        ["Ride", "Follow coastal tracks with your guide."],
        ["Pause", "Take in the Atlantic panorama."],
      ],
    ],
    [
      "sunset-sessions",
      "Sunset Sessions",
      "Sunset",
      "A slow golden-hour escape with ocean light, desert tones and the cliffs of Timlaline.",
      260,
      75,
      90,
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1600&q=85",
      ["Golden-hour guide", "Moroccan tea", "Photo stop"],
      ["Arrive 15 minutes early", "Layers recommended after sunset"],
      [
        ["Gather", "Meet the group at the coastal base."],
        ["Explore", "Travel to an elevated viewpoint."],
        ["Sunset", "Enjoy tea as the sun drops into the Atlantic."],
      ],
    ],
    [
      "timlaline-caves",
      "Timlaline Cave Walk",
      "Cave",
      "Step into the geological heart of Timlaline on a guided cave and cliff walk.",
      220,
      60,
      75,
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
      ["Local guide", "Safety equipment", "Geology stories"],
      ["Uneven surfaces", "Closed shoes required"],
      [
        ["Brief", "Receive a route overview."],
        ["Discover", "Walk through limestone formations."],
        ["Return", "Finish at base camp."],
      ],
    ],
    [
      "moroccan-table",
      "Moroccan Table",
      "Local",
      "Share mint tea, local flavours and stories with a host rooted in the Timlaline community.",
      180,
      60,
      90,
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1600&q=85",
      ["Tea ceremony", "Local tasting", "Host-led stories"],
      ["Share dietary needs", "Family-friendly"],
      [
        ["Welcome", "Settle in with fresh mint tea."],
        ["Taste", "Enjoy a local tasting."],
        ["Connect", "Hear stories of the coast."],
      ],
    ],
  ];
  for (let a of seed)
    add.run(
      a[0],
      a[1],
      a[2],
      a[3],
      a[4],
      a[5],
      a[6],
      a[7],
      JSON.stringify([a[7]]),
      JSON.stringify(a[8]),
      JSON.stringify(a[9]),
      JSON.stringify(a[10]),
    );
  let pack = db.prepare(
    "INSERT OR IGNORE INTO packs(slug,title,description,price_from,duration,hero,includes_json) VALUES(?,?,?,?,?,?,?)",
  );
  pack.run(
    "the-adventurer",
    "The Adventurer",
    "Quad energy followed by Timlaline's hidden geological world.",
    540,
    "3 hours",
    seed[0][7],
    JSON.stringify(["Atlantic Quad Escape", "Timlaline Cave Walk"]),
  );
  pack.run(
    "the-sunset",
    "The Sunset",
    "A coastal quad ride designed to end in golden-hour calm.",
    570,
    "3 hours",
    seed[1][7],
    JSON.stringify(["Atlantic Quad Escape", "Sunset Sessions"]),
  );
  pack.run(
    "complete-experience",
    "The Complete Experience",
    "A full Timlaline day: ride, explore, pause, taste and watch the light change.",
    890,
    "Full day",
    seed[3][7],
    JSON.stringify([
      "Atlantic Quad Escape",
      "Timlaline Cave Walk",
      "Sunset Sessions",
      "Moroccan Table",
    ]),
  );
  seedUser("owner", "owner", process.env.VISITIMLALINE_OWNER_PASSWORD);
  seedUser("staff", "staff", process.env.VISITIMLALINE_STAFF_PASSWORD);
}
function hash(p, s = crypto.randomBytes(16).toString("hex")) {
  return s + ":" + crypto.scryptSync(p, s, 64).toString("hex");
}
function seedUser(n, r, p) {
  if (p)
    db.prepare(
      "INSERT OR IGNORE INTO users(username,role,password_hash,created_at) VALUES(?,?,?,?)",
    ).run(n, r, hash(p), now());
}
function read(req) {
  return new Promise((yes, no) => {
    let b = "";
    req.on("data", (c) => (b += c));
    req.on("end", () => {
      try {
        yes(b ? JSON.parse(b) : {});
      } catch {
        no();
      }
    });
  });
}
function cookie(req) {
  return Object.fromEntries(
    (req.headers.cookie || "")
      .split(";")
      .filter(Boolean)
      .map((x) => x.trim().split("=").map(decodeURIComponent)),
  );
}
function current(req) {
  let t = cookie(req).visit_session;
  return (
    t &&
    db
      .prepare(
        "SELECT u.id,u.username,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id=? AND s.expires_at>?",
      )
      .get(t, now())
  );
}
function guard(req, res, roles) {
  let u = current(req);
  if (!u) {
    json(res, 401, { error: "Authentication required" });
    return;
  }
  if (!roles.includes(u.role)) {
    json(res, 403, { error: "Insufficient permissions" });
    return;
  }
  return u;
}
function goodDate(d) {
  return /^\d{4}-\d{2}-\d{2}$/.test(d || "") && d >= now().slice(0, 10);
}
function availability(slug, date) {
  if (
    !goodDate(date) ||
    !db.prepare("SELECT 1 FROM activities WHERE slug=? AND active=1").get(slug)
  )
    return;
  let used = new Map(
    db
      .prepare(
        "SELECT time,SUM(guests) n FROM bookings WHERE activity_slug=? AND date=? AND status!='CANCELLED' GROUP BY time",
      )
      .all(slug, date)
      .map((x) => [x.time, x.n]),
  );
  return slots.map((time) => ({
    time,
    capacity,
    booked: used.get(time) || 0,
    remaining: Math.max(0, capacity - (used.get(time) || 0)),
    available: (used.get(time) || 0) < capacity,
  }));
}
function booking(x) {
  return {
    ...x,
    activity: x.activity_slug
      ? db
          .prepare("SELECT title FROM activities WHERE slug=?")
          .get(x.activity_slug)?.title
      : null,
    pack: x.pack_slug
      ? db.prepare("SELECT title FROM packs WHERE slug=?").get(x.pack_slug)
          ?.title
      : null,
  };
}
async function create(req, res) {
  let x;
  try {
    x = await read(req);
  } catch {
    return json(res, 400, { error: "Invalid JSON body" });
  }
  let guests = +x.guests;
  if (
    !x.customer_name?.trim() ||
    !/^\S+@\S+\.\S+$/.test(x.email || "") ||
    !x.phone?.trim() ||
    !goodDate(x.date) ||
    !Number.isInteger(guests) ||
    guests < 1 ||
    guests > capacity ||
    !slots.includes(x.time) ||
    (!x.activity && !x.pack)
  )
    return json(res, 422, {
      error: "Provide valid contact details, future date, time, and 1–8 guests",
    });
  let item = x.activity
    ? db
        .prepare(
          "SELECT slug,price_from FROM activities WHERE slug=? AND active=1",
        )
        .get(x.activity)
    : db
        .prepare("SELECT slug,price_from FROM packs WHERE slug=? AND active=1")
        .get(x.pack);
  if (!item) return json(res, 404, { error: "Selected experience not found" });
  let time = x.activity
    ? availability(x.activity, x.date)?.find((s) => s.time === x.time)
    : { remaining: capacity };
  if (!time || time.remaining < guests)
    return json(res, 409, { error: "That time no longer has enough space" });
  let dupe = db
    .prepare(
      "SELECT id FROM bookings WHERE email=? AND activity_slug IS ? AND pack_slug IS ? AND date=? AND time=? AND status!='CANCELLED'",
    )
    .get(
      x.email.toLowerCase(),
      x.activity || null,
      x.pack || null,
      x.date,
      x.time,
    );
  if (dupe)
    return json(res, 409, {
      error: "This booking already exists",
      booking_id: dupe.id,
    });
  let id = "VTL-" + crypto.randomBytes(12).toString("hex").toUpperCase(),
    base = +item.price_from,
    total = base * guests;
  db.prepare("INSERT INTO bookings VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(
    id,
    x.activity || null,
    x.pack || null,
    x.customer_name.trim(),
    x.email.toLowerCase(),
    x.phone.trim(),
    x.date,
    x.time,
    guests,
    base,
    0,
    total,
    "NOT PAID YET",
    now(),
    null,
  );
  json(res, 201, {
    booking: booking(db.prepare("SELECT * FROM bookings WHERE id=?").get(id)),
  });
}
async function login(req, res) {
  let x;
  try {
    x = await read(req);
  } catch {
    return json(res, 400, { error: "Invalid JSON body" });
  }
  let u = db
    .prepare("SELECT * FROM users WHERE username=?")
    .get(x.username || "");
  if (!u) return json(res, 401, { error: "Invalid credentials" });
  let [salt, old] = u.password_hash.split(":"),
    test = hash(String(x.password || ""), salt).split(":")[1];
  if (
    !crypto.timingSafeEqual(Buffer.from(old, "hex"), Buffer.from(test, "hex"))
  )
    return json(res, 401, { error: "Invalid credentials" });
  let id = crypto.randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions VALUES(?,?,?)").run(
    id,
    u.id,
    new Date(Date.now() + 43200000).toISOString(),
  );
  json(
    res,
    200,
    { user: { username: u.username, role: u.role } },
    {
      "Set-Cookie":
        "visit_session=" +
        id +
        "; HttpOnly; Path=/; Max-Age=43200; SameSite=Lax",
    },
  );
}
async function api(req, res, url) {
  let p = url.pathname.split("/").filter(Boolean);
  if (req.method === "GET" && url.pathname === "/api/activities") {
    let cat = url.searchParams.get("category"),
      q = cat
        ? "SELECT * FROM activities WHERE active=1 AND lower(category)=lower(?)"
        : "SELECT * FROM activities WHERE active=1";
    return json(res, 200, {
      activities: db
        .prepare(q)
        .all(...(cat ? [cat] : []))
        .map(activity),
    });
  }
  if (req.method === "GET" && p[1] === "activities" && p[2]) {
    let a = db
      .prepare("SELECT * FROM activities WHERE slug=? AND active=1")
      .get(p[2]);
    return a
      ? json(res, 200, { activity: activity(a) })
      : json(res, 404, { error: "Activity not found" });
  }
  if (req.method === "GET" && url.pathname === "/api/packs")
    return json(res, 200, {
      packs: db
        .prepare("SELECT * FROM packs WHERE active=1")
        .all()
        .map((x) => ({ ...x, includes: list(x.includes_json) })),
    });
  if (req.method === "GET" && url.pathname === "/api/availability") {
    let s = availability(
      url.searchParams.get("activity"),
      url.searchParams.get("date"),
    );
    return s
      ? json(res, 200, { slots: s })
      : json(res, 422, {
          error: "A valid active activity and future date are required",
        });
  }
  if (req.method === "POST" && url.pathname === "/api/bookings")
    return create(req, res);
  if (req.method === "GET" && p[1] === "bookings" && p[2]) {
    let b = db.prepare("SELECT * FROM bookings WHERE id=?").get(p[2]);
    return b
      ? json(res, 200, { booking: booking(b) })
      : json(res, 404, { error: "Booking not found" });
  }
  if (req.method === "POST" && p[1] === "bookings" && p[3] === "arrive") {
    if (!guard(req, res, ["owner", "staff"])) return;
    let b = db.prepare("SELECT * FROM bookings WHERE id=?").get(p[2]);
    if (!b) return json(res, 404, { error: "Booking not found" });
    if (b.status === "ARRIVED")
      return json(res, 409, { error: "Guest has already arrived" });
    db.prepare(
      "UPDATE bookings SET status='ARRIVED',arrived_at=? WHERE id=?",
    ).run(now(), b.id);
    db.prepare(
      "INSERT INTO notifications(booking_id,type,message,created_at) VALUES(?,?,?,?)",
    ).run(
      b.id,
      "arrival",
      b.customer_name + " arrived for booking " + b.id,
      now(),
    );
    return json(res, 200, {
      booking: booking(
        db.prepare("SELECT * FROM bookings WHERE id=?").get(b.id),
      ),
    });
  }
  if (req.method === "POST" && url.pathname === "/api/auth/login")
    return login(req, res);
  if (req.method === "POST" && url.pathname === "/api/auth/logout") {
    let t = cookie(req).visit_session;
    if (t) db.prepare("DELETE FROM sessions WHERE id=?").run(t);
    return json(
      res,
      200,
      { ok: true },
      {
        "Set-Cookie":
          "visit_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
      },
    );
  }
  if (req.method === "GET" && url.pathname === "/api/auth/me") {
    let u = current(req);
    return u
      ? json(res, 200, { user: u })
      : json(res, 401, { error: "Authentication required" });
  }
  if (req.method === "GET" && url.pathname === "/api/admin/bookings") {
    if (!guard(req, res, ["owner"])) return;
    return json(res, 200, {
      bookings: db
        .prepare("SELECT * FROM bookings ORDER BY created_at DESC")
        .all()
        .map(booking),
    });
  }
  if (req.method === "GET" && url.pathname === "/api/admin/notifications") {
    if (!guard(req, res, ["owner"])) return;
    return json(res, 200, {
      notifications: db
        .prepare("SELECT * FROM notifications ORDER BY created_at DESC")
        .all(),
    });
  }
  json(res, 404, { error: "API route not found" });
}
function file(res, name) {
  let f = path.normalize(path.join(root, name));
  if (!f.startsWith(root)) return json(res, 403, { error: "Forbidden" });
  fs.readFile(f, (e, d) => {
    if (e) return json(res, 404, { error: "Not found" });
    let t =
      {
        ".html": "text/html; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
      }[path.extname(f)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": t });
    res.end(d);
  });
}
setup();
http
  .createServer((req, res) => {
    let u = new URL(req.url, "http://" + req.headers.host);
    if (u.pathname.startsWith("/api/"))
      return api(req, res, u).catch((e) => {
        console.error(e);
        json(res, 500, { error: "Internal server error" });
      });
    file(
      res,
      u.pathname === "/" || !path.extname(u.pathname)
        ? "index.html"
        : u.pathname.slice(1),
    );
  })
  .listen(port, () => console.log("Visitimlaline → http://localhost:" + port));
