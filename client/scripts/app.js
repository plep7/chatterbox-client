// YOUR CODE HERE:
class App {
  constructor() {
    this.server = 'https://api.parse.com/1/classes/messages';
    this.friends = {};
    this.rooms = ['lobby'];
    this.currentRoom = 'lobby';
  }
  
  init () {
    console.log('We have init!');
    var context = this;
    $('.username').on('click', function() {
      console.log($(this).text());
      context.handleUsernameClick($(this).text());
    });

    $('#send').off('submit').on('submit', function(event) {
      var ourMessage = {};
      ourMessage.username = window.location.search.slice(10); 
      ourMessage.text = $('#message').val();
      ourMessage.roomname = this.currentRoom;
      console.log(ourMessage);
      this.handleSubmit(ourMessage);
      event.preventDefault();
    }.bind(this));

    $('#createRoom').off('submit').on('submit', function(event) {
      
      var newRoom = $('#createRoomName').val();
      context.renderRoom(newRoom);
      context.currentRoom = newRoom;
      context.rooms.push(newRoom);
      context.clearMessages();
      context.fetch();

      console.log(newRoom);

      event.preventDefault();
    });

    $('#refresh').off('click').on('click', function() {
      this.clearMessages();
      this.fetch();
    }.bind(this));    


    $('#roomSelect li a').off('click').on('click', function() {
      console.log($(this).text());
      context.currentRoom = $(this).text();
      context.clearMessages();
      context.fetch();
      //context.handleUsernameClick($(this).text());
    });


    // $('#roomSelect').off('change').on('change', function() {
    //   if ($('#roomSelect').val() === 'createNewRoom') {
    //     console.log('new room');
    //     var newRoom = prompt('What is the name of your new room?');
    //     this.renderRoom(newRoom);
    //     $('#roomSelect').val(newRoom).change();
    //   }
    //   this.clearMessages();
    //   this.fetch();
    // }.bind(this));
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
        for (var i = 0; i < 100; i++) {
          //if (!$(`#roomSelect option[value="${escape(data.results[i].roomname)}"]`).length > 0) {
          if (!this.rooms.includes(escape(data.results[i].roomname))) {
            this.rooms.push(escape(data.results[i].roomname));
            this.renderRoom(this.escapeHTML(data.results[i].roomname));
          }

          if ((data.results[i].roomname) === this.currentRoom && count < 100) {
            this.renderMessage(data.results[i]);
            count++;
          }
        }
        this.init();
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

  escapeHTML(value) {
    var div = document.createElement('div');
    if (value) {
      value = value.replace(/(['"])/g, '\\$1');
    }
    div.appendChild(document.createTextNode(value));
    return div.innerHTML;
  }


  renderMessage(message) {
    var friendStatus = '';
    if (this.friends[this.escapeHTML(message.username)]) {
      friendStatus = 'friend';
    }

    var post = `<div class="message ${friendStatus} ${this.escapeHTML(message.username)}"><p class="username">${this.escapeHTML(message.username)}</p><p>${this.escapeHTML(message.text)}</p></div>`;
    $('#chats').append(post);
  }

  renderRoom(name) {
    //$('#roomSelect').append(`<option value="${name}">${name}</option>`);
    $('#roomSelect').append(`<li class="${name}"><a href="#">${name}</a></li>`);
  }

  handleUsernameClick(username) {
    console.log('username clicked');

    this.friends[username] = true;

    $('.' + username).addClass('friend');

    console.log(this.friends);

  }

  handleSubmit(input) {
    $('#message').val('');
    this.send(input);
    //this.renderMessage(input);
  }
}

var app = new App();

//app.init();
