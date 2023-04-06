const csv = require("csvtojson");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/sdc", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
});

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number,
  features: [
    {
      feature: String,
      value: String,
    },
  ],
});

const Products = mongoose.model("products", productSchema);

const relatedSchema = new mongoose.Schema({
  id: Number,
  related: Array,
});

const Related = mongoose.model("related", relatedSchema);

const styleSchema = mongoose.Schema({
  id: Number,
  results: [
    {
      style_id: Number,
      name: String,
      original_price: String,
      sale_price: Boolean,
      photos: [{ thumbnail_url: String, url: String }],
      skus: {},
    },
  ],
});

const Style = mongoose.model("style", styleSchema);

const photoSchema = mongoose.Schema({
  id: Number,
  styleId: Number,
  url: String,
  thumbnail_url: String,
});

const Photo = mongoose.model("photo", photoSchema);

const csvFilePath4 = `${__dirname}/skus.csv`;
const csvFilePath5 = `${__dirname}/photos.csv`;
const csvFilePath6 = `${__dirname}/styles.csv`;
// csv()
//   .fromFile(csvFilePath6)
//   .then((jsonObj) => {
//     console.log(jsonObj);
//   });

Photo.find().then((data) => {
  console.log(data);
});
// const csvFilePath = `${__dirname}/product.csv`;

// const csvFilePath2 = `${__dirname}/features.csv`;
// const csvFilePath3 = `${__dirname}/related.csv`;
// async function add() {
//   console.log("hello");
//   csv()
//     .fromFile(csvFilePath3)
//     .then((jsonObj) => {
//       // console.log(jsonObj);
//       var relatedArr = [];
//       for (var i = 0; i < jsonObj.length; i++) {
//         var index = Number(jsonObj[i].current_product_id) - 1;
//         if (relatedArr[index]) {
//           relatedArr[index].related.push(jsonObj[i].related_product_id);
//         } else {
//           relatedArr[index] = {};
//           relatedArr[index].id = index + 1;
//           relatedArr[index].related = [];
//           relatedArr[index].related.push(jsonObj[i].related_product_id);
//         }
//       }
//       // console.log(relatedArr);

//       for (var j = 800000; j < 900000; j++) {
//         Related.insertMany([relatedArr[j]]).then((data) => {
//           console.log(data, "hasbeenadded");
//         });
//       }
//       for (var j = 900000; j < 1000000; j++) {
//         Related.insertMany([relatedArr[j]]).then((data) => {
//           console.log(data, "hasbeenadded");
//         });
//       }
//       for (var j = 1000000; j < relatedArr.length; j++) {
//         Related.insertMany([relatedArr[j]]).then((data) => {
//           console.log(data, "hasbeenadded");
//         });
//       }

//       // csv()
//       //   .fromFile(csvFilePath2)
//       //   .then((jsonObj2) => {
//       //     // console.log(jsonObj, "hello");
//       //     for (var i = 0; i < jsonObj2.length; i++) {
//       //       var index = Number(jsonObj2[i].product_id) - 1;
//       //       var obj = {};
//       //       obj.feature = jsonObj2[i].feature;
//       //       obj.value = jsonObj2[i].value;
//       //       if (jsonObj[index].features) {
//       //         jsonObj[index].features.push(obj);
//       //       } else {
//       //         jsonObj[index].features = [];
//       //         jsonObj[index].features.push(obj);
//       //       }
//       //     }
//       //     console.log(jsonObj.length);
//       //     for (var i = 1000000; i < jsonObj.length; i++) {
//       //       Products.insertMany([jsonObj[i]]).then((data) => {
//       //         console.log(data, "hasbeenadded", i);
//       //       });
//       //     }
//       // for (var i = 950000; i < 1000000; i++) {
//       //   Products.insertMany([jsonObj[i]]).then((data) => {
//       //     console.log(data, "hasbeenadded", i);
//       //   });
//       // }
//       // jsonObj.forEach(async (prod) => {
//       //   try {
//       //     await Products.insertMany([prod]);
//       //     console.log("Inserted", prod.id);
//       //   } catch (err) {
//       //     console.error(err);
//       //   }
//       // });
//       // while (count > jsonObj.length) {
//       //   Products.insertMany([jsonObj[count]]).then((data) => {
//       //     console.log(data, "hasbeenadded", count);
//       //     count++;
//       //   });
//       // }
//       // });
//     });
// }
// add();
