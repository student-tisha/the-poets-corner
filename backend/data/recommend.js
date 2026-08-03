const { getPoems } = require('./loadPoems');

// Simple synonym map to catch related words for common moods/occasions
const synonymMap = {
  heartbreak: ['heartbreak', 'breakup', 'lost love', 'grief', 'sorrow'],
  love: ['love', 'romance', 'romantic', 'passion'],
  friendship: ['friendship', 'friend', 'friends'],
  nature: ['nature', 'trees', 'flowers', 'earth', 'garden'],
  motivation: ['motivation', 'inspire', 'inspiration', 'strength'],
  success: ['success', 'achievement', 'victory'],
  failure: ['failure', 'defeat', 'loss'],
  loneliness: ['loneliness', 'lonely', 'alone', 'isolation'],
  happiness: ['happiness', 'happy', 'joy', 'joyful'],
  rain: ['rain', 'storm', 'weather'],
  festivals: ['festival', 'celebration', 'holiday'],
  birthday: ['birthday', 'celebration'],
  wedding: ['wedding', 'marriage', 'bride', 'groom'],
  graduation: ['graduation', 'achievement', 'school'],
  stress: ['stress', 'anxiety', 'pressure'],
  hope: ['hope', 'hopeful', 'faith'],
  family: ['family', 'mother', 'father', 'parents', 'children']
};

function expandQuery(query) {
  const q = query.toLowerCase().trim();
  const words = new Set([q]);

  // Add mapped synonyms if the query matches a known mood key
  if (synonymMap[q]) {
    synonymMap[q].forEach(word => words.add(word));
  }

  // Also check if query appears inside any synonym group
  Object.values(synonymMap).forEach(group => {
    if (group.includes(q)) {
      group.forEach(word => words.add(word));
    }
  });

  return Array.from(words);
}

function scorePoem(poem, searchTerms) {
  let score = 0;
  const poemTagsText = poem.tags.join(' ').toLowerCase();
  const poemBodyText = (poem.title + ' ' + poem.poem).toLowerCase();

  searchTerms.forEach(term => {
    // Tag match = strong signal
    if (poem.tags.includes(term)) score += 10;
    else if (poemTagsText.includes(term)) score += 5;

    // Loose match in title/poem body = weaker signal
    if (poemBodyText.includes(term)) score += 1;
  });

  return score;
}

function recommendPoems(query, limit = 10) {
  const poems = getPoems();
  if (!query || !query.trim()) return [];

  const searchTerms = expandQuery(query);

  const scored = poems
    .map(poem => ({ poem, score: scorePoem(poem, searchTerms) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => ({ ...item.poem, relevanceScore: item.score }));

  return scored;
}

module.exports = { recommendPoems };