#!/usr/bin/env node
const dotenv = require('dotenv').config();
const fetch = require('node-fetch');
var readlineSync = require('readline-sync');
const baseUrl = 'http://api.wordnik.com:80/v4/word.json/';
const wordsUrl = 'http://api.wordnik.com:80/v4/words.json/';
var option = process.argv[2];
var word = process.argv[3];
var wordData = [];
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
    case 'play':
            setupPlay(fetchWordMeaning);
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
function getDefinition(word, route, formatDefinition, type) {
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

/**
 * Start the game and fetch the random word
 * @param  {Function} fetchWordMeaning [Callback to handle data]
 * @return {String}                  [Error]
 */
function setupPlay(fetchWordMeaning) {
  fetch(wordsUrl + 'randomWord' + '?api_key=' + process.env.API_KEY + '&hasDictionaryDef=true')
    .then((res) => {
      return res.json();
    }).then((data) => {
      if (!data.word) {
        return console.log("Error occured while fetching the word. Try again.");
      }
      fetchWordMeaning(data.word);
    }).catch((err) => {
      return console.log(err);
    });
}

/** Fetch the definition and synonym, antonym */
function fetchWordMeaning(word) {
  getDefinition(word, 'definitions', function(type, data, word) {
    var temp = ['Definition'];
    for (var i = 0; i < data.length; i++) {
      temp.push(data[i].text);
    }
    if(temp.length > 1) wordData.push(temp);

    getDefinition(word, 'relatedWords', function(type, data, word) {
    
      var temp1 = ['Synonym'], temp2 = ['Antonym'];
      for (var i = 0; i < data.length; i++) {
        if (data[i].relationshipType === 'synonym') {
          var synonymArray = data[i].words;
          for (var j = 0; j < synonymArray.length; j++) {
            temp1.push(synonymArray[j].toLowerCase());
          }
        }

        if (data[i].relationshipType === 'antonym') {
          var antonymArray = data[i].words;
          for (var j = 0; j < antonymArray.length; j++) {
            temp2.push(antonymArray[j]);
          }
        }
      }
      if(temp1.length > 1) wordData.push(temp1);
      if(temp2.length > 1) wordData.push(temp2);
      playGame(wordData, word);
    }, 'dict');

  }, 'dict');

}

/** Game logic */
function playGame(wordDetails, word) {
  if(!wordDetails.length) {
    return console.log("Chosen word has no details");
  }

  var detailObject = getRandomHint(wordDetails);
  console.log("Here is your question");
  console.log(detailObject.type  + ' : ' + detailObject.value);
  var answer = readlineSync.question('Enter answer : ');
  var synArray = detailObject.wordDetails.filter(function(val) {return val[0] == 'Synonym'})[0];

  if (answer.toLowerCase() === word.toLowerCase() || (synArray && synArray.indexOf(answer.toLowerCase()) > 0)) {
    console.log("Yippie !!\tAnswer is correct");
    return;
  } else {
    console.log("Wrong answer");
  }

  while(1) {
    console.log('1. Try Again\n2. Hint\n3. Quit');
    var choice = readlineSync.question("Enter your choice : ");

    switch (choice) {
      case '1' :
        break;
      case '2':
        if (!detailObject.wordDetails.length) {
          console.log("No more hints");
        } else {
          detailObject = getRandomHint(wordDetails);
          console.log(detailObject.type  + ' : ' + detailObject.value);
        }
        break;
      case '3':
        console.log("The answer is " + word);
        return;
      default :
        console.log("Wrong Input");
        continue;
    }
    answer = readlineSync.question("Enter your answer : ");
    var synArray = detailObject.wordDetails.filter(function(val) {return val[0] == 'Synonym'})[0];
    if (answer.toLowerCase() === word.toLowerCase() || (synArray && synArray.indexOf(answer.toLowerCase()) > 0)) {
      console.log("Yippie !!\tAnswer is correct");
      return;
    } else {
      console.log("Wrong answer");
    }
  }
}

/** Generate random hint */
function getRandomHint(wordDetails) {
  var choice = Math.floor(Math.random() * wordDetails.length);
  var val = wordDetails[choice].pop();
  var ret = {value : val, type : wordDetails[choice][0]}
  if (wordDetails[choice].length < 2) {
    wordDetails.splice(choice);
  }
  ret.wordDetails = wordDetails;
  return ret;
}