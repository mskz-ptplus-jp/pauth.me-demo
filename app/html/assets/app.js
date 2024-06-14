document.addEventListener('DOMContentLoaded', async () => {
  let phone = document.getElementById('phone').value;        
  let events = document.getElementById('events');
document.getElementById('entry').addEventListener('click', (event) => {

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

            let sibling = pin.closest('.col-3').nextElementSibling;
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

          events.innerHTML += `<div>${JSON.stringify(data, null, 2)}</div>`;
          return reader.read().then(progress);
        });
      });

    });

    const applyModal = document.getElementById('applyModal');
    applyModal.addEventListener('show.bs.modal', (event) => {
      pin.value = '';
      events.innerHTML = '';
    });
    applyModal.addEventListener('hidden.bs.modal', (event) => {
      controller.abort();
    });
 });
