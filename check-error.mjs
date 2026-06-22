import http from 'node:http';
http.get('http://127.0.0.1:3000', (r) => {
  let d = '';
  r.on('data', (c) => d += c);
  r.on('end', () => {
    console.log('Status:', r.statusCode);
    console.log('Body length:', d.length);
    console.log('Body:', d.slice(0, 3000));
  });
}).on('error', (e) => console.log('ERR:', e.message));
