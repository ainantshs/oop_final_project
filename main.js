const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

document.addEventListener('DOMContentLoaded', function () {
  var searchInput = document.getElementById('searchInput');
  var lookupButton = document.getElementById('lookupButton');
  var result = document.getElementById('result');

  lookupButton.addEventListener('click', function () {
    var word = searchInput.value;

    if (!word) {
      result.innerHTML = 'Please enter a word.';
      return;
    }

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(response => response.json())
      .then(data => {
        var wordData = data[0];
        result.innerHTML = `
          <h2>${wordData.word}</h2>
          <p>Part of speech: ${wordData.meanings[0].partOfSpeech}</p>
          <p>Meaning: ${wordData.meanings[0].definitions[0].definition}</p>
          <audio controls>
            <source src="${wordData.phonetics[0].audio}" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        `;

        // Fetch synonyms and antonyms
        fetch(`https://api.datamuse.com/words?rel_syn=${word}`)
          .then(response => response.json())
          .then(data => {
            var synonyms = data.map(word => word.word).join(', ');
            result.innerHTML += `<p>Synonyms: ${synonyms}</p>`;
          })
          .catch(error => {
            console.error(error);
            alert('Error fetching synonyms. Please try again.');
          });

        fetch(`https://api.datamuse.com/words?rel_ant=${word}`)
          .then(response => response.json())
          .then (data => {
            var antonyms = data.map(word => word.word).join(', ');
            result.innerHTML += `<p>Antonyms: ${antonyms}</p>`;
          })
          .catch(error => {
            console.error(error);
            alert('Error fetching antonyms. Please try again.');
          });
      })
      .catch(error => {
        result.innerHTML = `
          <h2>Error</h2>
          <p>Could not find the word information. Please try again.</p>
        `;
      });
  });

  var btnCreate = document.getElementById('btnCreate');
  var btnRead = document.getElementById('btnRead');
  var btnDelete = document.getElementById('btnDelete');
  var fileName = document.getElementById('fileName');
  var fileContents = document.getElementById('fileContents');

  let pathName = path.join(__dirname, 'Files');

  btnCreate.addEventListener('click', function () {
    let file = path.join(pathName, fileName.value);
    let contents = fileContents.value;
    fs.writeFile(file, contents, function (err) {
      if (err) {
        return console.log(err);
      }
      var txtfile = document.getElementById('fileName').value;
      alert(txtfile + ' text file was created');
      console.log('The file was created');
    });
  });

  btnRead.addEventListener('click', function () {
    let file = path.join(pathName, fileName.value);
    fs.readFile(file, function (err, data) {
      if (err) {
        return console.log(err);
      }
      fileContents.value = data;
      console.log('The file was read!');
    });
  });

  btnDelete.addEventListener('click', function () {
    let file = path.join(pathName, fileName.value);
    fs.unlink(file, function (err) {
      if (err) {
        return console.log(err);
      }
      fileName.value = '';
      fileContents.value = '';
      console.log('The file was deleted!');
    });
  });

  // Review functionality
  const reviewInput = document.getElementById('reviewInput');
  const sendReviewButton = document.getElementById('lookupButton');
  const userReviews = document.querySelector('.user-reviews');

  sendReviewButton.addEventListener('click', function () {
    const reviewText = reviewInput.value.trim();

    if (reviewText) {
      const reviewElement = document.createElement('div');
      reviewElement.classList.add('review');
      reviewElement.textContent = reviewText;

      userReviews.appendChild(reviewElement);
      reviewInput.value = '';
    }
  });
});

