'use strict'

const Article = require('../models/article')

class articleController {
  static create(req, res, next) {
    const { title, content, image } = req.body
    Article
      .create({
        title,
        content,
        featured_image: image,
        created_at: new Date(),
        userId: req.decoded._id
      })
      .then(article => {
        res.status(201).json(article)
      })
      .catch(next)
  }

  static read(req, res, next) {
    let keys = ['title', 'content']
    let value = {
      // userId: req.decoded._id
    }

    keys.forEach(element => {
      if (req.query[element]) {
        value[element] = { $regex: `${req.query[element]}` }
      }
    })

    Article
      .find(value).sort({ created_at: -1 }).populate('userId')
      .then(articles => {
        res.status(200).json(articles)
      })
      .catch(next)
  }

  static update(req, res, next) {
    let id = req.params.id
    let { title, content, image } = req.body
    let value = {
      title: title || undefined,
      content: content || undefined,
      featured_image: image || undefined
    }

    Article
      .findByIdAndUpdate(id, value, { new: true, omitUndefined: true })
      .then(article => {
        res.status(200).json(article)
      })
      .catch(next)
  }

  static delete(req, res, next) {
    let id = req.params.id

    Article
      .findByIdAndDelete(id)
      .then(article => {
        res.status(200).json(article)
      })
      .catch(next)
  }
}

module.exports = articleController

