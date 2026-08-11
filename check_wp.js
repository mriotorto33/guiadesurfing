const https = require('https');

https.get('https://nuevo.guiadesurfing.com/wp-json/wp/v2/types', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const types = JSON.parse(data);
    const customTypes = Object.keys(types).filter(t => !['post', 'page', 'attachment', 'nav_menu_item', 'wp_block', 'wp_template', 'wp_template_part', 'wp_navigation', 'wp_font_family', 'wp_font_face', 'user_request'].includes(t));
    console.log('Custom Post Types:', customTypes);
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});
