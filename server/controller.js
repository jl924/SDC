const API = require("./API.js")
const pg = require("./productDbs/postgresdb")
const pg2 = require("./productDbs/postgres2")
const getReviews = (req, res) => {
  //console.log('in getReviews')
  const params = req.query
  API.getReviews(params, (err, reviews) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(reviews)
    }
  })
}

const getProducts = (req, res) => {
  const params = req.params
  params.id = params.id === undefined ? "" : req.params.id
  params.related = params.related === undefined ? "" : req.params.related
  console.log(params)
  if (params.related === "related") {
    pg.findRelated(params.id)
      .then((data) => {
        var array = [3, 8, 9, 12]
        console.log(data, "data")
        res.send(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  if (params.related === "") {
    pg.findProducts(params.id)
      .then((data) => {
        res.send(data)
        // console.log(data, params.id, "product")
      })
      .catch((err) => {
        console.log(err)
      })
  }
  if (params.related === "styles") {
    pg.findStyles(params.id)
      .then((data) => {
        // console.log(data, id)
        res.send(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  // API.getProducts(params, (err, products) => {
  //   if (err) {
  //     res.status(500).send(err)
  //   } else {
  //     res.status(200).send(products)
  //   }
  // })
}

const getStyles = (req, res) => {
  //console.log('IN CONTROLLERS:', req.query)
  let params = req.query
  console.log("🚀 ~ file: controller.js:52 ~ getStyles ~ eq.query:", req.query)

  console.log(params)
  let id = params.product_id //console.log(id);
  pg.findStyles(id)
    .then((data) => {
      // console.log(data, id)
      res.send(data)
    })
    .catch((err) => {
      console.log(err)
    })
  // API.getStyles(id, (err, styles) => {
  //   if (err) {
  //     res.status(500).send(err)
  //   } else {
  //     res.status(200).send(styles)
  //   }
  // })
}

//**********************Question and Answers ****************************/
const getQuestions = (req, res) => {
  const params = req.query
  API.getQuestions(params, (err, questions) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(questions)
    }
  })
}
const updateQuestionHelpful = (req, res) => {
  const params = req.params
  API.updateQuestionHelpful(params, (err, result) => {
    if (err) {
      res.status(500).send(console.log("error in controller"))
    } else {
      res.status(200).send(result)
    }
  })
}
const updateQuestionReport = (req, res) => {
  const params = req.params
  API.updateQuestionReport(params, (err, result) => {
    if (err) {
      res.status(500).send(console.log("error in controller"))
    } else {
      res.status(200).send(result)
    }
  })
}
const updateAnswerHelpful = (req, res) => {
  const params = req.params
  API.updateAnswerHelpful(params, (err, result) => {
    if (err) {
      res.status(500).send(console.log("error in controller", err))
    } else {
      res.status(200).send(result)
    }
  })
}
const updateAnswerReport = (req, res) => {
  const params = req.params
  API.updateAnswerReport(params, (err, result) => {
    if (err) {
      res.status(500).send(console.log("error in controller", err))
    } else {
      res.status(200).send(result)
    }
  })
}

const submitAnswer = (req, res) => {
  const body = req.body
  API.submitAnswer(body, (err, result) => {
    if (err) {
      res.status(500).send(console.log("error in controller", err))
    } else {
      res.status(200).send(result)
    }
  })
}

const submitQuestion = (req, res) => {
  console.log("submit Question controller", req.body)
  const body = req.body
  API.submitQuestion(body, (err, result) => {
    if (err) {
      res.status(500).send(console.log("error in controller", err))
    } else {
      res.status(200).send(result)
    }
  })
}

const updateReviewHelpful = (req, res) => {
  const params = req.body.params
  //console.log('running')
  API.updateReviewHelpful(params, (err, reviews) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(204).send()
    }
  })
}
const getReviewsMeta = (req, res) => {
  const params = req.query
  API.getReviewsMeta(params, (err, reviews) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(reviews)
    }
  })
}
const postForm = (req, res) => {
  const params = req.body
  //console.log('params:',params)
  API.postForm(params, (err, reviews) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(201).send()
    }
  })
}
const postInteraction = (req, res) => {
  API.postInteraction(req.body, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(201).send()
    }
  })
}

module.exports = {
  getReviews,
  updateReviewHelpful,
  getReviewsMeta,
  getQuestions,
  getProducts,
  postForm,
  updateQuestionHelpful,
  updateQuestionReport,
  updateAnswerHelpful,
  updateAnswerReport,
  submitAnswer,
  submitQuestion,
  getStyles,
  postInteraction,
}

console.log('hello')
