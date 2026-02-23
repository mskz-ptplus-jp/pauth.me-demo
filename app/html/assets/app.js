document.addEventListener('DOMContentLoaded', async () => {
  let controller;
  let events = document.getElementById('events');

  document.getElementById('entry').addEventListener('click', (event) => {
    let phone = document.getElementById('phone').value;

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

  // Apply button click handler - verify PIN
  document.querySelector('#applyModal .btn-primary:not([data-bs-toggle])').addEventListener('click', async (event) => {
    const phone = document.getElementById('phone').value;
    const confirmationPin = document.getElementById('confirmation-pin').value;

    if (!phone || !confirmationPin) {
      return;
    }

    const button = event.target;
    button.disabled = true;
    button.textContent = 'Verifying...';

    try {
      const res = await fetch(`${url}/api/v1/apply?callerd_number=${encodeURIComponent(phone)}&pin=${encodeURIComponent(confirmationPin)}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        events.innerHTML = `<div class="text-success fw-bold">Verified successfully!</div>` + events.innerHTML;
        button.textContent = 'Verified';
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
      } else {
        events.innerHTML = `<div class="text-danger fw-bold">Verification failed. (${res.status})</div>` + events.innerHTML;
        button.textContent = 'Apply';
        button.disabled = false;
      }
    } catch (err) {
      console.error('Apply error:', err);
      events.innerHTML = `<div class="text-danger fw-bold">Error: ${err.message}</div>` + events.innerHTML;
      button.textContent = 'Apply';
      button.disabled = false;
    }
  });

  const applyModal = document.getElementById('applyModal');
  applyModal.addEventListener('show.bs.modal', (event) => {
    document.getElementById('pin').value = '';
    document.getElementById('confirmation-pin').value = '';
    document.getElementById('confirmation-pin').setAttribute('disabled', '');
    const applyBtn = document.querySelector('#applyModal .btn-primary:not([data-bs-toggle]), #applyModal .btn-success');
    if (applyBtn) {
      applyBtn.textContent = 'Apply';
      applyBtn.disabled = false;
      applyBtn.classList.remove('btn-success');
      applyBtn.classList.add('btn-primary');
    }
    events.innerHTML = '';
  });
  applyModal.addEventListener('hidden.bs.modal', (event) => {
    if (controller) {
      controller.abort();
    }
  });
 });
