const { Client } = require("pg")
const path = require("path")

const db = new Client({
  host: "localhost",
  port: 5432,
  database: "sdc",
  user: "jaelee",
  password: "1234",
})

db.connect()

const productDb = `COPY products(id, name, slogan, description, category, default_price)
  FROM '${path.join(__dirname, "./csv/product.csv")}'
  DELIMITER ','
  CSV HEADER;`
async function loadProducts() {
  await db.query(`DROP TABLE IF EXISTS products`)
  await db
    .query(
      `CREATE TABLE products(
          id INTEGER PRIMARY KEY,
        name VARCHAR (30) NOT NULL,
        slogan VARCHAR (256) NOT NULL,
        description VARCHAR (512) NOT NULL,
        category VARCHAR (20) NOT NULL,
        default_price VARCHAR (10) NOT NULL
        );`
    )
    .then((data) => console.log("added products"))
    .then(() => db.query(productDb))
    .then((results) => console.log("products", results.rowCount))
    .catch((error) => console.log(error, "err"))
}
// ===============================================================================================================
const relatedDb = `COPY related(id, current_product_id, related_product_id)
  FROM '${path.join(__dirname, "./csv/related.csv")}'
  DELIMITER ','
  CSV HEADER
  NULL '0'
  WHERE current_product_id IS NOT NULL AND related_product_id IS NOT NULL;`

async function loadRelated() {
  await db.query(`DROP TABLE IF EXISTS related`)
  await db
    .query(
      `CREATE TABLE IF NOT EXISTS related (
        id INTEGER PRIMARY KEY,
        current_product_id INTEGER NOT NULL
          REFERENCES products(id),
        related_product_id INTEGER NOT NULL
          REFERENCES products(id)
        );`
    )
    .then((data) => console.log("added related"))
    .then(() => db.query(relatedDb))
    .then((results) => console.log("related", results.rowCount))
    .catch((error) => console.log(error, "err"))
}
// CREATE INDEX related_current_product_id_idx ON related (current_product_id);
// ===============================================================================================================
const featureDB = `COPY features(id, product_id, feature, value)
  FROM '${path.join(__dirname, "./csv/features.csv")}'
  DELIMITER ','
  CSV HEADER;`

async function loadFeatures() {
  await db.query(`DROP TABLE IF EXISTS features`)
  await db
    .query(
      `CREATE TABLE features(
        id INTEGER PRIMARY KEY,
        product_id INTEGER
          REFERENCES products(id),
        feature VARCHAR (24) NOT NULL,
        value VARCHAR (30)
        );`
    )
    .then((data) => console.log("added feat"))
    .then(() => db.query(featureDB))
    .then((results) => console.log("features", results.rowCount))
    .catch((error) => console.log(error, "err"))
}

// CREATE INDEX features_product_id_idx ON features (product_id);
// ===============================================================================================================
const stylesDb = `COPY styles(id, product_id, name, sale_price, original_price, default_style)
  FROM '${path.join(__dirname, "./csv/styles.csv")}'
  DELIMITER ','
  CSV HEADER;`

async function loadStyles() {
  await db.query(`DROP TABLE IF EXISTS styles`)
  await db
    .query(
      `CREATE TABLE styles(
          id INTEGER PRIMARY KEY,
          product_id INTEGER
          REFERENCES products(id),
          name VARCHAR (30),
          sale_price VARCHAR (10),
          original_price VARCHAR (10),
          default_style BOOLEAN
      );`
    )
    .then((data) => console.log("added styles"))
    .then(() => db.query(stylesDb))
    .then((results) => console.log("styles", results.rowCount))
    .catch((error) => console.log(error, "err"))
}
// CREATE INDEX styles_product_id_idx ON styles (product_id);
// ===============================================================================================================
const skusDb = `COPY skus(id, style_id, size, quantity)
  FROM '${path.join(__dirname, "./csv/skus.csv")}'
  DELIMITER ','
  CSV HEADER;`

async function loadSkus() {
  await db.query(`DROP TABLE IF EXISTS skus`)
  await db
    .query(
      `CREATE TABLE IF NOT EXISTS skus (
          id INTEGER PRIMARY KEY,
          style_id INTEGER NOT NULL
            REFERENCES styles(id),
          size VARCHAR (10),
          quantity INTEGER
        );`
    )
    .then((data) => console.log("added skus"))
    .then(() => db.query(skusDb))
    .then((results) => console.log("skus", results.rowCount))
    .catch((error) => console.log(error, "err"))
}
// CREATE INDEX skus_style_id_idx ON skus (style_id);
// ===============================================================================================================
const photoDb = `COPY photos(id, style_id, url, thumbnail_url)
  FROM '${path.join(__dirname, "./csv/photos.csv")}'
  DELIMITER ','
  CSV HEADER;`

async function loadPhoto() {
  await db.query(`DROP TABLE IF EXISTS photos`)
  await db
    .query(
      `CREATE TABLE IF NOT EXISTS photos (
          id INTEGER PRIMARY KEY,
          style_id INTEGER NOT NULL
            REFERENCES styles(id),
          url TEXT,
          thumbnail_url TEXT
          );`
    )
    .then((data) => console.log("added photo"))
    .then(() => db.query(photoDb))
    .then((results) => console.log("photos", results.rowCount))
    .catch((error) => console.log(error, "err"))
}
// CREATE INDEX photos_style_id_idx ON photos (style_id);
// ===============================================================================================================
async function loadDb() {
  await db.query(`DROP TABLE IF EXISTS related`)
  await db.query(`DROP TABLE IF EXISTS photos`)
  await db.query(`DROP TABLE IF EXISTS skus`)
  await db.query(`DROP TABLE IF EXISTS styles`)
  await db.query(`DROP TABLE IF EXISTS features`)
  await db.query(`DROP TABLE IF EXISTS products`)
  await Promise.all[loadProducts()]
  await Promise.all[loadRelated()]
  await Promise.all[loadFeatures()]
  await Promise.all[loadStyles()]
  await Promise.all[loadSkus()]
  await Promise.all[loadPhoto()]
  await db.query(
    `CREATE INDEX features_product_id_idx ON features (product_id);`
  )
  await db.query(`CREATE INDEX styles_product_id_idx ON styles (product_id);`)
  await db.query(`CREATE INDEX skus_style_id_idx ON skus (style_id);`)
  await db.query(`CREATE INDEX photos_style_id_idx ON photos (style_id);`)
  await db.query(
    `CREATE INDEX related_current_product_id_idx ON related (current_product_id);`
  )
  await db.query(`CREATE INDEX products_id_idx ON products (id);`)
}
loadDb()
// ===============================================================================================================

let findProducts = (id) => {
  return db
    .query(
      `SELECT products.id, products.name , products.description, products.category, products.default_price, c.feature, c.value
  FROM products products
  JOIN features c
  ON products.id = c.product_id
  WHERE products.id = ${id}
  AND products.id = ${id};`
    )
    .then((data) => {
      var curr = data.rows[0]
      var obj = {}
      obj.id = curr.id
      obj.name = curr.name
      obj.description = curr.description
      obj.category = curr.category
      obj.default_price = curr.default_price
      obj.features = []
      for (var i = 0; i < data.rows.length; i++) {
        var Objpush = {}
        var current = data.rows[i]
        Objpush.feature = current.feature
        Objpush.value = current.value
        obj.features.push(Objpush)
      }
      return obj
    })
}

module.exports.findProducts = findProducts

// ===============================================================================================================

let findRelated = (id) => {
  return db
    .query(
      `SELECT * FROM related WHERE current_product_id = ${id} AND current_product_id = ${id};`
    )
    .then((data) => {
      var array = []
      for (var i = 0; i < data.rows.length; i++) {
        var curr = data.rows[i]
        array.push(curr.related_product_id)
      }
      return array
    })
}
module.exports.findRelated = findRelated

// ===============================================================================================================
var dummy = [
  {
    style_id: 4,
    name: "No styles",
    original_price: "140",
    sale_price: null,
    "default?": false,
    photos: [
      {
        thumbnail_url:
          "https://t3.ftcdn.net/jpg/03/34/83/22/360_F_334832255_IMxvzYRygjd20VlSaIAFZrQWjozQH6BQ.jpg",
        url: "https://t3.ftcdn.net/jpg/03/34/83/22/360_F_334832255_IMxvzYRygjd20VlSaIAFZrQWjozQH6BQ.jpg",
      },
    ],
    skus: {
      19: {
        quantity: 8,
        size: "XS",
      },
      20: {
        quantity: 16,
        size: "S",
      },
      21: {
        quantity: 17,
        size: "M",
      },
      22: {
        quantity: 10,
        size: "L",
      },
      23: {
        quantity: 15,
        size: "XL",
      },
      24: {
        quantity: 6,
        size: "XXL",
      },
    },
  },
]
// ===============================================================================================================
let findStyles = (id) => {
  return db
    .query(
      `SELECT s.id AS style_id, s.name, s.original_price, NULLIF(s.sale_price, 'null') AS sale_price, s.default_style AS "default?", json_agg(json_build_object('thumbnail_url', p.thumbnail_url, 'url', p.url)) AS photos, json_object_agg(sk.id, json_build_object('quantity', sk.quantity, 'size', sk.size)) AS skus
    FROM styles s
    INNER JOIN photos p ON s.id = p.style_id
    INNER JOIN skus sk ON s.id = sk.style_id
    WHERE s.product_id = ${id} GROUP BY s.id, s.name, s.original_price, s.sale_price, s.default_style
    AND s.product_id = ${id}`
    )
    .then((data) => {
      for (var i = 0; i < data.rows.length; i++) {
        if (data.rows[i].sale_price === null) {
          data.rows[i].sale_price === "0"
        }
        for (var j = 0; j < data.rows[i].photos.length; j++) {
          var curr = data.rows[i].photos[j]
          var next = data.rows[i].photos[j + 1] || "hello"
          if (curr.thumbnail_url === next.thumbnail_url) {
            data.rows[i].photos.splice(j, 1)
            j--
          } else {
            continue
          }
        }
      }
      var obj = {}
      obj.product_id = id
      obj.results = data.rows.length > 1 ? data.rows : dummy
      return obj
    })
}
module.exports.findStyles = findStyles

// ===============================================================================================================
