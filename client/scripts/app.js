// YOUR CODE HERE:
class App {
  constructor() {
    this.server = 'https://api.parse.com/1/classes/messages';
    this.init();
  }
  
  init () {
    $('.username').off('click').on('click', function() {
      this.handleUsernameClick();
    }.bind(this));

    $('#send').off('submit').on('submit', function() {
      this.handleSubmit();
      
    }.bind(this));
  

  }

  send(message) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch() {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      //data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Messages fetched', data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch messages', data);
      }
    });
  }

  clearMessages() {
    $('#chats').html('');
  }

  renderMessage(message) {
    var post = `<div><p class="username">${message.username}</p><p>${message.text}</p><p>${message.roomname}</p></div>`;
    $('#chats').append(post);
  }

  renderRoom(name) {
    $('#roomSelect').append(`<option value="${name}">${name}</option>`);

  }

  handleUsernameClick() {
    console.log('username clicked');
  }

  handleSubmit() {
    console.log('submitted');
  }
}

var app = new App();
