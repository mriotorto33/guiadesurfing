const https = require('https');

// Check REST API
https.get('https://nuevo.guiadesurfing.com/wp-json/wp/v2/types', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const types = JSON.parse(data);
      const customTypes = Object.keys(types).filter(t => !['post', 'page', 'attachment', 'nav_menu_item', 'wp_block', 'wp_template', 'wp_template_part', 'wp_navigation', 'wp_font_family', 'wp_font_face', 'user_request'].includes(t));
      console.log('Custom Post Types (REST):', customTypes);
    } catch (e) {
      console.log('REST API not returning JSON:', data.substring(0, 100));
    }
  });
}).on('error', err => {
  console.log('Error REST: ', err.message);
});

// Check GraphQL API
const req = https.request('https://nuevo.guiadesurfing.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      console.log('GraphQL Schema (First 200 chars):', data.substring(0, 200));
    } catch (e) {
      console.log('GraphQL not returning correctly:', data.substring(0, 100));
    }
  });
});
req.on('error', err => {
  console.log('Error GraphQL: ', err.message);
});
req.write(JSON.stringify({ query: '{ __schema { queryType { name } } }' }));
req.end();
