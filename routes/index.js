//var PORT = 8000;
var axios = require('axios');
var cheerio = require('cheerio');
var express = require('express');

const app = express();
const router = express.Router();

router.get('/senate', (req, res) => {
  const actionsList = [];
  const floorActionsMap = {};
  const today = new Date();

  const source = {
    name: 'Senate Floor Actions',
    address: `https://www.senate.gov/legislative/LIS/floor_activity/floor_activity.htm`,
    base: '',
    slug: 'senate',
  };

  console.log(source);
  axios.get(source.address)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const actionsField = $('body main').find('div').first();
      const actions = actionsField.find('div');


      let count = 1;
      actions.each((index, action) => {

        // const thisActionItem = {};

        const header = $(action).find('h2').first().text().trim();
        const actionItem = $(action).first().text().replace(header, '').trim();

        // console.log(thisActionItem);
        if (header.length != 0) {
          actionsList.push({ count, header, actionItem });
          count += 1;
        }


      });
      // console.log(senateActionsList);
      floorActionsMap["retrieved-date"] = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      floorActionsMap["actions-date"] = actionsField.find('h2').first().text();
      floorActionsMap["actions-title"] = actionsField.find('section h1').first().text();
      floorActionsMap["actions-count"] = actionsList.length;
      floorActionsMap["actions-list"] = actionsList;
      res.json(floorActionsMap);
    });
});

router.get('/house', (req, res) => {
  const actionsList = [];
  const floorActionsMap = {};
  const today = new Date();

  const source = {
    name: 'House Floor Actions',
    address: `https://clerk.house.gov/Home/Feed`,
    base: '',
    slug: 'house',
  };

  console.log(source);
  axios.get(source.address)
    .then(response => {
      console.log(response.data);
      const html = response.data;
      const $ = cheerio.load(html);
      const actionsField = $('channel');
      const actions = actionsField.find('item');


      let count = 1;
      actions.each((index, action) => {

        // const thisActionItem = {};

        const fullDescription = $(action).find('description').text();

        var header = '';
        var actionItem = '';

        if (fullDescription.includes(' - ')) {
          header = fullDescription.split(' - ')[0].trim();
          actionItem = fullDescription.split(' - ')[1];
        } else {
          header = "--";
          actionItem = fullDescription;
        }

        // console.log(thisActionItem);
        if (header.length > 0) {
          actionsList.push({ count, header, actionItem });
          count += 1;
        }


      });
      // console.log(senateActionsList);
      floorActionsMap["retrieved-date"] = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      floorActionsMap["actions-date"] = actionsField.find('pubDate').first().text();
      floorActionsMap["actions-title"] = actionsField.find('title').first().text();
      floorActionsMap["actions-count"] = actionsList.length;
      floorActionsMap["actions-list"] = actionsList;
      res.json(floorActionsMap);
    });
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'US Congress Floor Actions API' });

});


module.exports = router;

//app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));