document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('entry').addEventListener('click', (event) => {
      let phone = document.getElementById('phone').value;        
      let events = document.getElementById('events');

      if (!phone) {
        return;
      }

      controller = new AbortController();
      const signal = controller.signal;
      fetch(`${url}/api/v1/entry/${phone}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        signal: signal,
      }).then(res => {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        reader.read().then(async function progress({ done, value }) {
          if (done) {
            console.log('Stream complete');
            return;
          }
          const data = JSON.parse(decoder.decode(value).replace(/^data: /, '').trim());
          console.log(data);
          events.innerHTML += `<div>${JSON.stringify(data, null, 2)}</div>`;
          return reader.read().then(progress);
        });
      });

    });

    const applyModal = document.getElementById('applyModal');
    applyModal.addEventListener('show.bs.modal', (event) => {
      events.innerHTML = '';
    });
    applyModal.addEventListener('hidden.bs.modal', (event) => {
      controller.abort();
    });
 });
