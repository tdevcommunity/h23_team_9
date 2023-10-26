const express = require('express');
const article_route = express();

const bodyParser = require("body-parser");

article_route.use(bodyParser.json());

article_route.use(bodyParser.urlencoded({extended:true}));


const articleController = require("./article_controller");
article_route.get('/article-list', articleController.getArticles);
article_route.get('/scrap-articles', articleController.scrapeAndSaveData);

module.exports = article_route;