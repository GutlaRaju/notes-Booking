$(document).ready(function() {
    const token = localStorage.getItem('token');

    if (token) {
        $('#login-btn').hide();
        $('#register-btn').hide();
    } else {
        $('#logout-btn').hide();
    }

    $('#login-btn').click(() => {
        const username = prompt('Username:');
        const password = prompt('Password:');
        $.ajax({
            url: '/auth/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function(response) {
                localStorage.setItem('token', response.token);
                location.reload();
            },
            error: function(error) {
                alert('Login failed');
            }
        });
    });

    $('#register-btn').click(() => {
        const username = prompt('Username:');
        const password = prompt('Password:');
        $.ajax({
            url: '/auth/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function(response) {
                alert('Registration successful');
            },
            error: function(error) {
                alert('Registration failed');
            }
        });
    });

    $('#logout-btn').click(() => {
        localStorage.removeItem('token');
        location.reload();
    });

    $('#save-note-btn').click(() => {
        const title = $('#note-title').val();
        const content = $('#note-content').val();
        const tags = $('#note-tags').val().split(',');
        const reminderDate = $('#note-reminder').val();
        const backgroundColor = $('#note-colors .selected').data('color');
        $.ajax({
            url: '/notes',
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            contentType: 'application/json',
            data: JSON.stringify({ title, content, tags, backgroundColor, reminderDate }),
            success: function(note) {
                $('#notes-list').prepend(`<div class="note" style="background-color: ${note.backgroundColor};">${note.title}</div>`);
                $('#note-title').val('');
                $('#note-content').val('');
                $('#note-tags').val('');
                $('#note-reminder').val('');
                $('#note-colors .color-btn').removeClass('selected');
            },
            error: function(error) {
                alert('Failed ');
            }
        });
    });

    if (token) {
        $.ajax({
            url: '/notes',
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            success: function(notes) {
                notes.forEach(note => {
                    $('#notes-list').append(`<div class="note" style="background-color: ${note.backgroundColor};">${note.title}</div>`);
                });
            },
            error: function(error) {
                alert('Failed');
            }
        });
    }
});