const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();

const cors = require("cors");
const mongoose = require("mongoose")

const { PrismaClient } = require('@prisma/client');
//const { data } = require('cheerio/lib/api/attributes');
const prisma = new PrismaClient();

app.use(cors({
      origin: '*'
      })
);

mongoose.connect("mongodb+srv://scraping001:scraping@cluster0.l2tgs1x.mongodb.net/?retryWrites=true&w=majority")
.then(() => console.log("MongoDb connected"))
.catch((e) => console.log(e));

app.get('/scrape', async (req, res) => {
    try {
      const response = await axios.get('https://www.republiquetogolaise.com/', {
        timeout: 15000,
      });
      const $ = cheerio.load(response.data);
  
      $('article').each(async (index, element) => {
        const title = $(element).find('.titre-tg-officiel a')[0].children[0].data;
        const image = $(element).find('img').attr('src')[0].children[0].data;
        const description = $(element).find('.description')[0].children[0].data;

  
        // Vérifiez si l'URL existe déjà dans la base de données
        const existingArticle = await prisma.article.findUnique({
          where: { title },
        });
  
        if (!existingArticle) {
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
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred.');
    }
  });
  

app.listen(8090, function(){
    console.log("Server is running");
});

