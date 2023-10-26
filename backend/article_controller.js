const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const cheerio = require('cheerio');

const getArticles = ('/getArticles', async (req, res) => {
    try {
      const articles = await prisma.article.findMany({}); 
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
  })

  const scrapeAndSaveData = ('/scrapArticles', async (req, res) =>{
    console.log("bonsoir");
    const response = await axios.get('https://www.republiquetogolaise.com/', {
      timeout: 25000,
    });
    console.log("ou");
    const $ = cheerio.load(response.data);
  
    // Sélectionnez les éléments à partir desquels vous souhaitez extraire les données (par exemple, des articles)
    const articles = $('row');
  
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
  })

  module.exports = {
    getArticles, scrapeAndSaveData
  };