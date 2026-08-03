const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

let poemsCache = [];

function loadPoems() {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, '..', '..', 'dataset', 'poems.csv');

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const title = row['Title'] ? row['Title'].trim() : '';
        const poet = row['Poet'] ? row['Poet'].trim() : '';
        const poemText = row['Poem'] ? row['Poem'].trim() : '';
        const tagsRaw = row['Tags'] ? row['Tags'].trim() : '';

        // Skip rows missing essential data
        if (!title || !poemText) return;

        const tags = tagsRaw
          ? tagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
          : [];

        results.push({
          title,
          poet: poet || 'Unknown',
          poem: poemText,
          tags
        });
      })
      .on('end', () => {
        poemsCache = results;
        console.log(`Loaded ${poemsCache.length} poems successfully.`);
        resolve(poemsCache);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

function getPoems() {
  return poemsCache;
}

module.exports = { loadPoems, getPoems };