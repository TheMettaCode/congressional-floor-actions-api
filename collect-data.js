const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const today = new Date();

const senateActionsList = [];
const senateFloorActionsMap = {};

const senateSource = {
  name: 'Senate Floor Actions',
  address: `https://www.senate.gov/legislative/LIS/floor_activity/floor_activity.htm`,
  base: '',
  slug: 'senate',
};

axios.get(senateSource.address)
  .then(senateResponse => {
    const html = senateResponse.data;
    const $ = cheerio.load(html);
    const senateActionsField = $('body main').find('div').first();
    const senateActions = senateActionsField.find('div');

    let senateCount = 1;
    $(senateActions).find('div').each((index, action) => {

      // const thisActionItem = {};

      const header = $(action).find('h2').first().text().trim();
      const actionItem = $(action).first().text().replace(header, '').trim();
      const actionTimeStamp = '--';

      // console.log(thisActionItem);
      if (header.length != 0) {
        senateActionsList.push({ "index": senateCount, header, actionItem, actionTimeStamp });
        senateCount += 1;
      }


    });
    // console.log(senateActionsList);
    senateFloorActionsMap["retrieved-date"] = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    senateFloorActionsMap["actions-date"] = senateActionsField.find('h2').first().text();
    senateFloorActionsMap["actions-title"] = senateActionsField.find('section h1').first().text();
    senateFloorActionsMap["actions-count"] = senateActionsList.length;
    senateFloorActionsMap["actions-list"] = senateActionsList;
    // res.json(senateFloorActionsMap);
    fs.writeFile("./floor_actions_senate.json", JSON.stringify(senateFloorActionsMap), (err) => {
      if (err) { console.log(err); }
    });
  });

const houseActionsList = [];
const houseFloorActionsMap = {};

const houseSource = {
  name: 'House Floor Actions',
  address: `https://clerk.house.gov/Home/Feed`,
  base: '',
  slug: 'house',
};

axios.get(houseSource.address)
  .then(houseResponse => {
    const html = houseResponse.data;
    const $ = cheerio.load(html);
    const houseActionsField = $('channel');
    const houseActions = houseActionsField.find('item');


    let houseCount = 1;
    houseActions.each((index, action) => {

      // const thisActionItem = {};

      const fullDescription = $(action).find('description').text();
      const actionTimeStamp = $(action).find('pubDate').text();

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
        houseActionsList.push({ "index": houseCount, header, actionItem, actionTimeStamp });
        houseCount += 1;
      }


    });
    // console.log(senateActionsList);
    houseFloorActionsMap["retrieved-date"] = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    houseFloorActionsMap["actions-date"] = houseActionsField.find('pubDate').first().text();
    houseFloorActionsMap["actions-title"] = houseActionsField.find('title').first().text();
    houseFloorActionsMap["actions-count"] = houseActionsList.length;
    houseFloorActionsMap["actions-list"] = houseActionsList;
    // res.json(houseFloorActionsMap);
    fs.writeFile("./floor_actions_house.json", JSON.stringify(houseFloorActionsMap), (err) => {
      if (err) { console.log(err); }
    });
  });