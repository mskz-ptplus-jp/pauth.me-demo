document.addEventListener('DOMContentLoaded', async () => {
  let controller;
  let events = document.getElementById('events');

  document.getElementById('entry').addEventListener('click', (event) => {
<<<<<<< Updated upstream
    let phone = document.getElementById('phone').value;        
=======
    let phone = document.getElementById('phone').value;
>>>>>>> Stashed changes

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
        let pin = document.getElementById('pin');
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        reader.read().then(async function progress({ done, value }) {
          if (done) {
            console.log('Stream complete');
            return;
          }
          const data = JSON.parse(decoder.decode(value).replace(/^data: /, '').trim());
          console.log(data);

          if(data.pin) {
            pin.value = data.pin;

            let sibling = pin.closest('.col-4').nextElementSibling;
            while (sibling) {
              sibling.classList.add('d-none');
              sibling = sibling.nextElementSibling;
            }

            document.getElementById('confirmation-pin').removeAttribute('disabled');
            sibling = document.getElementById('confirmation-pin')
                      .closest('.col-3').nextElementSibling;
            while (sibling) {
              sibling.classList.remove('d-none');
              sibling = sibling.nextElementSibling;
            }
          }

          events.innerHTML = `<div>${JSON.stringify(data, null, 2)}</div>`
                           + events.innerHTML;
          return reader.read().then(progress);
        }).catch(err => {
          if (err.name === 'AbortError') {
            console.log('Stream reading aborted');
          } else {
            console.error('Stream reading error:', err);
          }
        });
      }).catch(err => {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fetch error:', err);
        }
      });

  });

  const applyModal = document.getElementById('applyModal');
  applyModal.addEventListener('show.bs.modal', (event) => {
    pin.value = '';
    events.innerHTML = '';
  });
  applyModal.addEventListener('hidden.bs.modal', (event) => {
    if (controller) {
      controller.abort();
    }
  });
 });
