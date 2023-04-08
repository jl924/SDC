var assert = require("assert")
const pg = require("../server/productDbs/postgresdb")
const chai = require("chai")
const chaiHttp = require("chai-http")
chai.should()
chai.use(chaiHttp)
const server = require("../server/index.js")

// beforeEach(async function () {
//   await db.clear()
//   await db.save([tobi, loki, jane])
// })

describe("API related", function () {
  it("getting back inital related", async function () {
    const users = await pg.findRelated(1)
    users.should.have.length(4)
  })
})

describe("API products", function () {
  it("getting back id of 9", async function () {
    const users = await pg.findProducts(9)
    assert.equal(users.id, 9)
  })
})

describe("API styles", function () {
  it("getting back id of 10", async function () {
    const users = await pg.findStyles(10)
    assert.equal(users.product_id, 10)
  })
})

describe("API styles results", function () {
  it("getting back id of 9", async function () {
    const users = await pg.findStyles(1)
    users.results.should.have.length(6)
  })
})

// pg.findStyles(1)
//   .then((data) => {
//     // console.log(data)
//     describe("API", function () {
//       describe("related", function () {
//         it("should call related", function () {
//           pg.findRelated(1).then((data) => {
//             assert.equal([1, 2, 3].indexOf(4), -2)
//           })
//         })
//       })
//     })
//   })
//   .catch((err) => {
//     console.log(err)
//   })

// describe("API", function () {
//   describe("related", function () {
//     it("should call related", function () {
//       pg.findRelated(1).then((data) => {
//         assert.equal([1, 2, 3].indexOf(4), -2)
//       })
//     })
//   })
// })

// describe("API Tests", function () {
//   it("should return status 200", function (done) {
//     chai
//       .request(server)
//       .get("/helloworld")
//       .end(function (err, res) {
//         // chai.expect(res).to.have.status(200)
//         console.log(res)
//         res.should.have.status(200)
//         done()
//       })
//   })
// })
