const webhookUrl = 'https://discord.com/api/webhooks/1260962571981426719/QJ2n5_4G8N6hRVkvo0yTQ5FtRWJ9gS2nxFHvrdlyLaFOXQSu11hhmdt2SqepVA3-X1H5';

function sendToDis(webhookUrl) {
  window.addEventListener("load", (event) => {
    console.log("page is fully loaded");
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "content": `Someone is on your website from ${navigator.appVersion.slice(5, 33)}
          `,
      })
    })
    console.log('sent');
  });
}

sendToDis(webhookUrl);
