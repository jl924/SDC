const csv = require("csvtojson");
const mongoose = require("mongoose");
const fs = require("fs");

mongoose.connect("mongodb://localhost:27017/sdc", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function () {
//   // we're connected!
// });

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

const styleSchema = mongoose.Schema(
  {
    _id: Number,
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
  },
  { minimize: false }
);

const Style = mongoose.model("Style", styleSchema);

const photoSchema = mongoose.Schema({
  id: Number,
  styleId: Number,
  url: String,
  thumbnail_url: String,
});

const Photo = mongoose.model("photo", photoSchema);

const skusSchema = mongoose.Schema({
  skus: {},
});

const Skus = mongoose.model("skus", skusSchema);

// Photo.find({ styleId: 10000 }).then((data) => {
//   console.log(data);
// });

// let findPhoto = (id) => {
//   return Photo.find({ styleId: id }).then((data) => {
//     return data;
//   });
// };

// let findStyle = (num, callback) => {
//   Style.find({ productId: num }).then((data) => {
//     console.log(data);
//   });
// };

// findStyle(1);
// let findSkus = (id) => {
//   return Skus.find({ styleId: id }).then((data) => {
//     return data;
//   });
// };
// console.log(findSkus(1));

// const photoJson = require("./csv/photos.json");
// console.log(photoJson.results[0]);

// const fileJson = require("./csv/file.json");
// console.log(fileJson.results[0]);
// module.exports.findSkus = findSkus;
// module.exports.findStyle = findStyle;
// module.exports.findPhoto = findPhoto;
// const csvFilePath4 = `${__dirname}/csv/skus.csv`;
// const csvFilePath5 = `${__dirname}/csv/photos.csv`;
// const csvFilePath6 = `${__dirname}/csv/styles.csv`;

// csv()
//   .fromFile(csvFilePath6)
//   .then((jsonObj) => {
//     console.log(jsonObj);
//     fs.writeFileSync("test1.txt", `${jsonObj}`, (err) => {
//       if (err) {
//         console.log(err);
//       }
//       console.log("success");
//     });
//   });

// const photoJson = require("./csv/photos.json");

// for (var i = 0; i < photoJson.results.length; i++) {
//   console.log(photoJson.results[i]);
// }

// Photo.find({ styleId: 1 }).then((data) => {
//   console.log(data);
// });
// var array1 = [];
// csv()
//   .fromFile(csvFilePath6)
//   .then((jsonObj) => {
//     // console.log(jsonObj);
//     let addData = (i) => {
//       var current = Number(jsonObj[i].id);
//       var obj = jsonObj[i];
//       return Photo.find({ styleId: current }).then((data) => {
//         var photodata = data;
//         Skus.find({ styleId: current }).then((data1) => {
//           var skusdata = data1;
//           // console.log(photodata, skusdata, "hi");
//           obj.photos = photodata;
//           obj.skus = skusdata;
//           // console.log(obj);
//           return Style.insertMany([obj]);
//         });
//       });
//     };
//     let loadhelper = async (start) => {
//       var promise = [];
//       var position = start * 100;
//       for (var j = position; j < position + 100; j++) {
//         // console.log(addData(j))
//         promise.push(addData(j));
//       }
//       await Promise.all(promise);
//       console.log("added" + position);
//       return;
//     };

//     const loader = async () => {
//       for (n = 0; n < 19580; n++) {
//         await loadhelper(n);
//       }
//     };
//     loader();
//   });

// let addData = (i) => {
//   var current = Number(jsonObj[i].id);
//   var obj = jsonObj[i];
//   return Photo.find({ styleId: current }).then((data) => {
//     var photodata = data;
//     Skus.find({ styleId: current }).then((data1) => {
//       var skusdata = data1;
//       // console.log(photodata, skusdata, "hi");
//       obj.photos = photodata;
//       obj.skus = skusdata;
//       // console.log(obj);
//       return Style.insertMany([obj]);
//     });
//   });
// for (var j = 0; j < 1; j++) {
//   promise.push(addData(j));
// }
// Promise.all(promise)

// Related.find().then((data) => {
//   console.log(data);
// });
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
