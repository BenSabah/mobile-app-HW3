function formatEpochToLocal(epoch) {
    const date = new Date(parseInt(epoch, 10));
    return !isNaN(date.getTime()) ? date.toLocaleString() : "Invalid Date";
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialization: Format all timestamps
    document.querySelectorAll('.last-update').forEach(el => {
        const timestamp = el.getAttribute('data-time');
        if (timestamp) {
            el.textContent = formatEpochToLocal(timestamp);
        }
    });

    // Register button
    const registerBtn = document.getElementById('register');
    if (registerBtn) {
        registerBtn.addEventListener('click', async () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('loginErrorMessage');

            try {
                const response = await fetch(`/register/${username}/${password}`, {method: 'POST'});
                if (response.ok) {
                    errorEl.textContent = "You were successfully registered, please login";
                    errorEl.style.color = "#00ff7f";
                    errorEl.style.visibility = "visible";
                } else {
                    throw new Error("User name already taken");
                }
            } catch (err) {
                errorEl.textContent = err.message;
                errorEl.style.color = "#ff4444";
                errorEl.style.visibility = "visible";
                setTimeout(() => errorEl.style.visibility = "hidden", 3000);
            }
        });
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('loginErrorMessage');

            try {
                const response = await fetch(`/login/${username}/${password}`, {method: 'POST'});
                if (response.ok) {
                    window.location.replace('/events');
                } else {
                    throw new Error("Wrong user name or password");
                }
            } catch (err) {
                errorEl.textContent = err.message;
                errorEl.style.color = "#ff4444";
                errorEl.style.visibility = "visible";
                setTimeout(() => errorEl.style.visibility = "hidden", 3000);
            }
        });
    }

    // Inline Edit handler
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            row.querySelector('.last-update').style.visibility = 'hidden';

            row.querySelectorAll('.editable').forEach(cell => {
                const val = cell.textContent;
                cell.innerHTML = `<input type="text" value="${val}" class="edit-input">`;
            });

            const imgCell = row.querySelector('.img-cell');
            const imgVal = imgCell.querySelector('a').href;
            imgCell.innerHTML = `<input type="text" value="${imgVal}" class="edit-input">`;

            btn.style.display = 'none';
            row.querySelector('.save-btn').style.display = 'inline-block';
        });
    });

    // Inline Save handler
    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const row = e.target.closest('tr');
            const id = row.getAttribute('data-id');
            const updatedEvent = {id};

            row.querySelectorAll('.editable').forEach(cell => {
                const field = cell.getAttribute('data-field');
                const val = cell.querySelector('input').value;
                updatedEvent[field] = val;
                cell.textContent = val;
            });

            const imgCell = row.querySelector('.img-cell');
            const imgVal = imgCell.querySelector('input').value;
            updatedEvent['img'] = imgVal;
            imgCell.innerHTML = `
                <a href="${imgVal}" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored img-preview-trigger" target="_blank">
                    <div class="material-icons md-dark">image</div>
                    <img src="${imgVal}" class="hover-preview" alt="Preview">
                </a>`;

            try {
                const response = await fetch('/item/', {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(updatedEvent)
                });

                if (response.ok) {
                    // Update UI with the current time using the browser's local format logic
                    row.querySelector('.last-update').textContent = formatEpochToLocal(Date.now());
                }

                row.querySelector('.last-update').style.visibility = 'visible';
                row.querySelector('.edit-btn').style.display = 'inline-block';
                btn.style.display = 'none';
            } catch (err) {
                console.error("Update failed", err);
            }
        });
    });

    // Delete handler
    document.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.id;
            try {
                await fetch(`/item/${id}`, {method: 'DELETE'});
                window.location.reload();
            } catch (err) {
                console.error("Delete failed", err);
            }
        });
    });
});
