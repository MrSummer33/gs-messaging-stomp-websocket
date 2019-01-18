var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function (greeting) {
          showGreeting(JSON.parse(greeting.body).content);
        });
        // stompClient.subscribe('/user/user/topic/'+ $("#name").val() +'/message', function (greeting) {
        //     showGreeting(JSON.parse(greeting.body).content);
        // });
      stompClient.subscribe('/user/hello/broker', function (greeting) {
        showGreeting(greeting);
      });

      stompClient.subscribe('/app/hello_subscription', function (greeting) {
        showGreeting(greeting);
      });

    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/hello1", {}, JSON.stringify({'name': $("#name").val(),'toUser': $("#toName").val()}));
}


function sendBroker() {
  stompClient.send("/user/hello/broker", {}, JSON.stringify({'name': $("#name").val(),'toUser': $("#toName").val()}));
}

function sendHandler() {
  stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val()}));
}

function sendSubscription() {
  stompClient.send("/app/hello_subscription", {}, JSON.stringify({'name': $("#name").val()}));
}

function sendDot() {
  stompClient.send("/app/hello/baocai", {}, null);
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
    $( "#sendBroker" ).click(function() { sendBroker(); });
    $( "#sendHandler" ).click(function() { sendHandler(); });
    $( "#sendSubscription" ).click(function() { sendSubscription(); });
    $( "#sendDot" ).click(function() { sendDot(); });
});

