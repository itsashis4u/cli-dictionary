#!/usr/bin/env node
const dotenv = require('dotenv').config();
const fetch = require('node-fetch');
const baseUrl = 'http://api.wordnik.com:80/v4/word.json/';
var option = process.argv[2].toLowerCase();
if (!option) {
  return console.log( "Error : Please provide an option" );
}


switch(option) {
  case 'def':
          var word = process.argv[3];
          getDefinition(word, formatDefinition);
          break;
}
/**
 * Format the data fetched from the definitions endpoint for the word
 * @param  {JSON} data [JSON data received from API]
 * @return {String}      [Word definitions or error]
 */
function formatDefinition(data) {
  if(data.length === 0) {
    return console.log( "Check if word \'" + process.argv[3] + "\' is valid English word" );
  }
  console.log("\nWord : " +  data[0].word + "\n\nShowing definitions\n----------");

  for (var i = 0; i < data.length; i++) {
    console.log(i+1 + " : " + data[i].text)
  }
  console.log('\n');
}
/**
 * Get the definition of the word provided
 * @param  {[type]} word             [word to be checked]
 * @param  {[type]} formatDefinition [callback for handling data]
 * @return {[type]}                  [error or callback]
 */
function getDefinition(word, formatDefinition) {
  if (!word) {
    return console.log( "Please provide a word" );
  }
  word = word.toLowerCase();
  fetch(baseUrl + word + '/definitions?api_key=' + process.env.API_KEY)
    .then((res) => {
      return res.json();
    }).then((data) => {
      formatDefinition(data);
    }).catch((err) => {
      return console.log(err);
    });

}