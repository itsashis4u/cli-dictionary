#!/usr/bin/env node
const dotenv = require('dotenv').config();
const fetch = require('node-fetch');
const baseUrl = 'http://api.wordnik.com:80/v4/word.json/';
var option = process.argv[2];
if (!option) {
  return console.log( "Error : Please provide an option" );
}
option = option.toLowerCase();

switch(option) {
  case 'def':
          var word = process.argv[3];
          getDefinition(word, 'definitions', formatDefinition, option);
          break;
  case 'syn':
          var word = process.argv[3];
          getDefinition(word, 'relatedWords', formatDefinition, option);
          break;
  case 'ant':
          var word = process.argv[3];
          getDefinition(word, 'relatedWords', formatDefinition, option);
          break;

}
/**
 * Format the data fetched from the definitions endpoint for the word
 * @param  {JSON} data [JSON data received from API]
 * @return {String}      [Word definitions or error]
 */
function formatDefinition(type, data) {
  if(data.length === 0) {
    return console.log( "Check if word \'" + process.argv[3] + "\' is valid English word" );
  }
  if (type === 'def') {
    console.log("\nWord : " +  data[0].word + "\n\nShowing definitions\n----------");

    for (var i = 0; i < data.length; i++) {
      console.log(i+1 + " : " + data[i].text)
    }
  }
  else if (type === 'syn') {

    for (var i = 0; i < data.length; i++) {
      if (data[i].relationshipType === 'synonym') {
        console.log("\nWord : " +  process.argv[3] + "\n\nShowing synonyms\n----------");
        var synonymArray = data[i].words;
        for (var j = 0; j < synonymArray.length; j++) {
          console.log(j + 1 + ' : ' + synonymArray[j])
        }
      }
    }
  }

  else if (type === 'ant') {

    for (var i = 0; i < data.length; i++) {
      if (data[i].relationshipType === 'antonym') {
        console.log("\nWord : " +  process.argv[3] + "\n\nShowing antonyms\n----------");
        var antonymArray = data[i].words;
        for (var j = 0; j < antonymArray.length; j++) {
          console.log(j + 1 + ' : ' + antonymArray[j])
        }
      }
    }
  }
  console.log('\n');
}
/**
 * Get the definition of the word provided
 * @param  {[type]} word             [word to be checked]
 * @param  {[type]} formatDefinition [callback for handling data]
 * @return {[type]}                  [error or callback]
 */
function getDefinition(word, route,  formatDefinition, type) {
  if (!word) {
    return console.log( "Please provide a word" );
  }
  word = word.toLowerCase();
  fetch(baseUrl + word + '/' + route + '?api_key=' + process.env.API_KEY)
    .then((res) => {
      return res.json();
    }).then((data) => {
      formatDefinition(type, data);
    }).catch((err) => {
      return console.log(err);
    });

}