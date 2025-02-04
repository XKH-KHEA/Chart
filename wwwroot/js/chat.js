// "use strict";

// var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// //Disable the send button until connection is established.
// document.getElementById("sendButton").disabled = true;

// connection.on("ReceiveMessage", function (user, message) {
//     var li = document.createElement("li");
//     document.getElementById("messagesList").appendChild(li);
//     // We can assign user-supplied strings to an element's textContent because it
//     // is not interpreted as markup. If you're assigning in any other way, you 
//     // should be aware of possible script injection concerns.
//     li.textContent = `${user} says : ${message}`;
// });

// connection.start().then(function () {
//     document.getElementById("sendButton").disabled = false;
// }).catch(function (err) {
//     return console.error(err.toString());
// });

// document.getElementById("sendButton").addEventListener("click", function (event) {
//     var user = document.getElementById("userInput").value;
//     var message = document.getElementById("messageInput").value;
//     connection.invoke("SendMessage", user, message).catch(function (err) {
//         return console.error(err.toString());
//     });
//     event.preventDefault();
// });

"use strict";
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .build();

connection.start().catch(err => console.error(err.toString()));

// Send message when button is clicked
document.getElementById("sendButton").addEventListener("click", function () {
    let user = document.getElementById("userInput").value;
    let message = document.getElementById("messageInput").value;
    
    if (user && message) {
        connection.invoke("SendMessage", user, message).catch(err => console.error(err.toString()));
        document.getElementById("messageInput").value = "";
    }
});

// Receive messages
connection.on("ReceiveMessage", function (user, message) {
    let msg = `<li><strong>${user}:</strong> ${message}</li>`;
    document.getElementById("messagesList").innerHTML += msg;
});

// Auto-Save Message Input Every 5 Seconds
setInterval(function () {
    let message = document.getElementById("messageInput").value;
    if (message) {
        localStorage.setItem("autoSavedMessage", message);
        console.log("Message auto-saved!");
    }
}, 5000);

// Restore Auto-Saved Message When Page Reloads
window.onload = function () {
    let savedMessage = localStorage.getItem("autoSavedMessage");
    if (savedMessage) {
        document.getElementById("messageInput").value = savedMessage;
    }
};
