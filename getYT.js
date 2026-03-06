const https = require('https');

function getLiveId(channelId) {
  return new Promise((resolve) => {
    https.get(`https://www.youtube.com/channel/${channelId}/live`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/"videoId":"([^"]+)"/);
        resolve(match ? match[1] : null);
      });
    });
  });
}

(async () => {
  console.log('Sky News:', await getLiveId('UCoMdktPbSTqxWQVqz7JH6vg'));
  console.log('DW News:', await getLiveId('UC_qfT_Ycl87V6_Bsq_lV_qA'));
  console.log('ABC News:', await getLiveId('UCBi2erQH1hbG97KdeOndyLA'));
})();
