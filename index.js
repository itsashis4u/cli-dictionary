#!/usr/bin/env node
const dotenv = require('dotenv').config();
const fetch = require('node-fetch');
const baseUrl = 'http://api.wordnik.com:80/v4/word.json/';
const wordsUrl = 'http://api.wordnik.com:80/v4/words.json/';
var option = process.argv[2];
var word = process.argv[3];
const limit = 10;
if (!option) {
  getWordOfTheDay(formatWordOfTheDay);
} else {
  option = option.toLowerCase();

  switch(option) {
    case 'def':
            getDefinition(word, 'definitions', formatDefinition, option);
            break;
    case 'syn':
            getDefinition(word, 'relatedWords', formatDefinition, option);
            break;
    case 'ant':
            getDefinition(word, 'relatedWords', formatDefinition, option);
            break;
    case 'ex':
            getDefinition(word, 'examples', formatDefinition, option);
            break;
    case 'dict':
            getDefinition(word, 'definitions', formatDefinition, 'def');
            getDefinition(word, 'relatedWords', formatDefinition, option);
            break;
    default:
            getDefinition(process.argv[2], 'relatedWords', formatDefinition, 'dict');
            getDefinition(process.argv[2], 'definitions', formatDefinition, 'def');
            break;

  }
}


/**
 * Format the data fetched from the definitions endpoint for the word
 * @param  {String} type [option to search for]
 * @param  {JSON} data [JSON data received from API]
 * @param  {String} word [The word to lookup for]
 * @return {String}      [Error]
 */
function formatDefinition(type, data, word) {
  if(data.length === 0) {
    return console.log( "Check if word \'" + word + "\' is valid English word" );
  }
  if (type === 'def') {
    console.log("\nWord : " +  word+ "\n\nShowing definitions\n----------");

    for (var i = 0; i < data.length; i++) {
      console.log(i+1 + " : " + data[i].text)
    }
  } else if (type === 'syn') {
    for (var i = 0; i < data.length; i++) {
      if (data[i].relationshipType === 'synonym') {
        console.log("\nWord : " +  word + "\n\nShowing synonyms\n----------");
        var synonymArray = data[i].words;
        for (var j = 0; j < synonymArray.length; j++) {
          console.log(j + 1 + ' : ' + synonymArray[j])
        }
      }
    }
  } else if (type === 'ant') {
    for (var i = 0; i < data.length; i++) {
      if (data[i].relationshipType === 'antonym') {
        console.log("\nWord : " +  word + "\n\nShowing antonyms\n----------");
        var antonymArray = data[i].words;
        for (var j = 0; j < antonymArray.length; j++) {
          console.log(j + 1 + ' : ' + antonymArray[j])
        }
      }
    }
  } else if (type === 'ex') {
    console.log("\nWord : " +  word + "\n\nShowing examples\n----------");
    for (var i = 0; i < data.examples.length; i++) {
      console.log(i+1 + " : " + data.examples[i].text)
    }
  } else if (type === 'dict') {
    formatDefinition('syn', data, word);
    formatDefinition('ant', data, word);
  }
  console.log('\n');
}
/**
 * Get the definition of the word provided
 * @param  {String} word             [The word to lookup for]
 * @param  {String} route            [API route to access]
 * @param  {Function} formatDefinition [callback for handling data]
 * @param  {String} type             [option to search for]
 * @return {[type]}                  [error or success callback]
 */
function getDefinition(word, route,  formatDefinition, type) {
  if (!word) {
    return console.log( "Please provide a word" );
  }
  word = word.toLowerCase();
  fetch(baseUrl + word + '/' + route + '?api_key=' + process.env.API_KEY + '&limit=' + limit)
    .then((res) => {
      return res.json();
    }).then((data) => {
      formatDefinition(type, data, word);
    }).catch((err) => {
      return console.log(err);
    });
}

/**
 * Get word of the day
 * @param  {Function} formatWord [Callback to format the data from the API]
 */
function getWordOfTheDay(formatWord) {
  fetch(wordsUrl + 'wordOfTheDay' + '?api_key=' + process.env.API_KEY)
    .then((res) => {
      return res.json();
    }).then((data) => {
      formatWord(data);
    }).catch((err) => {
      return console.log(err);
    });
}

/**
 * Format the "word of the day"
 * @param  {JSON} data [JSON data received from API]
 */
function formatWordOfTheDay(data) {
  console.log('Word of the Day\n---------')
  console.log("Word : " + data.word);
  console.log('\nDefinitions : ');
  for (var i = 0; i < data.definitions.length; i++) {
    console.log((i + 1) + ' : ' + data.definitions[i].text);
  }
  console.log('\nExamples : ');
  for (var i = 0; i < data.examples.length; i++) {
    console.log((i + 1) + ' : ' + data.examples[i].text);
  }
}