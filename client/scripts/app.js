// YOUR CODE HERE:
class App {
  constructor() {
    this.server = 'https://api.parse.com/1/classes/messages';
  }
  
  init () {
    console.log('We have init!');
    $('.username').off('click').on('click', function() {
      this.handleUsernameClick();
    }.bind(this));

    $('#send').off('submit').on('submit', function(event) {
      var ourMessage = {};
      ourMessage.username = window.location.search.slice(10); 
      ourMessage.text = $('#message').val();
      ourMessage.roomname = $('#roomSelect').val();
      console.log(ourMessage);
      this.handleSubmit(ourMessage);
      event.preventDefault();
    }.bind(this));

    $('#refresh').off('click').on('click', function() {
      this.clearMessages();
      this.fetch();
    }.bind(this));

    this.fetch();
  

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
        //this.renderMessage(message);
        this.clearMessages();
        this.fetch();
      }.bind(this),
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
      data: {order: '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Messages fetched', data);
        var count = 0;
        for (var i = 0; i < 30; i++) {
          if (data.results[i].roomname === $('#roomSelect').val() && count < 30) {
            this.renderMessage(data.results[i]);
            count++;
          }
        }
      }.bind(this),
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
    //var post = `<div class="message"><p class="username">${message.username}</p><p>${message.text}</p><p>${message.roomname}</p></div>`;
    var post = `<div class="message"><p class="username">${message.username}</p><p>${message.text}</p><p>${message.roomname}</p></div>`;
    $('#chats').append(post);
  }
  renderRoom(name) {
    $('#roomSelect').append(`<option value="${name}">${name}</option>`);

  }

  handleUsernameClick() {
    console.log('username clicked');
  }

  handleSubmit(input) {
    $('#message').val('');
    this.send(input);
    //this.renderMessage(input);
  }
}

//var app = new App();

//app.init();
