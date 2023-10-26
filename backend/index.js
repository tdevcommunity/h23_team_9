const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();

const cors = require("cors");
const mongoose = require("mongoose")

const { PrismaClient } = require('@prisma/client');

const cron = require('node-cron');

//const { data } = require('cheerio/lib/api/attributes');
//const prisma = new PrismaClient();

app.use(cors({
      origin: '*'
      })
);

mongoose.connect("mongodb+srv://scraping001:scraping@cluster0.l2tgs1x.mongodb.net/Scraping?retryWrites=true&w=majority")
.then(() => console.log("MongoDb connected"))
.catch((e) => console.log(e));

const prisma = new PrismaClient();
/* app.get('/getArticles', async (req, res) => {
  try {
    const articles = await prisma.article.findMany({}); // Retrieve all documents from the Category collection
    res.status(200).send({
      success: true,
      msg: "User Data",
      data: articles,
    });
    console.log("Bonjour");
  } catch (error) {
    res.status(400).send({
      success: false,
      msg: error.message,
    });
  }
}) */

/* async function scrapeAndSaveData() {
  const url = 'https://www.republiquetogolaise.com/';
  const response = await axios.get('https://www.republiquetogolaise.com/');
  const $ = cheerio.load(response.data);

  // Sélectionnez les éléments à partir desquels vous souhaitez extraire les données (par exemple, des articles)
  const articles = $('.titre-tg-officiel a');

  // Limitez la boucle à 5 éléments
  const maxArticles = Math.min(articles.length, 5);

  for (let i = 0; i < maxArticles; i++) {
    const article = articles.eq(i);

    $('article').each(async (index, element) => {
      const title = $(element).find('.titre-tg-officiel a')[0].children[0].data;
      const image = $(element).find('img').attr('src')[0].children[0].data;
      const description = $(element).find('.description')[0].children[0].data;


      // Vérifiez si l'URL existe déjà dans la base de données
      const existingArticle = await prisma.article.findUnique({
        where: { title },
      });

      if (!existingArticle) {
        console.log(title);
        console.log(description);
        // Si l'URL n'existe pas, enregistrez les données dans la base de données
        const articleData =  await prisma.article.create({
          data: {
            title,
            image,
            description,
            //url,
          },
        });
        res.status(200).send({
          success: true,
          msg: "Scraping completed and data stored in the database", 
          data: articleData,
      });
      }
    });

    console.log(`Donnée ${i + 1} extraite et enregistrée.`);
  }

  console.log('Scraping terminé.');
} */



const article_r = require('./article_route')

app.use('/api', article_r);

app.listen(8090, function(){
  console.log("Server is running");
});



