const https = require('https');
const fs = require('fs');
const path = require('path');

https.get('https://nuevo.guiadesurfing.com', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Buscar cualquier imagen que contenga logo o similar
    const matches = data.match(/<img[^>]+src="([^">]+\.(png|svg|jpg|webp))"[^>]*>/gi);
    if (matches) {
      matches.forEach(m => console.log(m));
    } else {
      console.log('No img tags found');
    }
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});
