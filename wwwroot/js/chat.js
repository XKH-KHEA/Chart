

//"use strict";
//const connection = new signalR.HubConnectionBuilder()
//    .withUrl("/chatHub")
//    .build();

//connection.start().catch(err => console.error(err.toString()));

//// Send message when button is clicked
//document.getElementById("sendButton").addEventListener("click", function () {
//    let user = document.getElementById("userInput").value;
//    let message = document.getElementById("messageInput").value;

//    if (user && message) {
//        connection.invoke("SendMessage", user, message).catch(err => console.error(err.toString()));
//        document.getElementById("messageInput").value = "";
//    }
//});

//// Receive messages
//connection.on("ReceiveMessage", function (user, message) {
//    let msg = `<li><strong>${user}:</strong> ${message}</li>`;
//    document.getElementById("messagesList").innerHTML += msg;
//});

//// Auto-Save Message Input Every 5 Seconds
//setInterval(function () {
//    let message = document.getElementById("messageInput").value;
//    if (message) {
//        localStorage.setItem("autoSavedMessage", message);
//        console.log("Message auto-saved!");
//    }
//}, 5000);

//// Restore Auto-Saved Message When Page Reloads
//window.onload = function () {
//    let savedMessage = localStorage.getItem("autoSavedMessage");
//    if (savedMessage) {
//        document.getElementById("messageInput").value = savedMessage;
//    }
//};

"use strict";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .build();

connection.start().catch(err => console.error(err.toString()));

// Request notification permission on page load
if (Notification.permission !== "granted") {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            console.log("Notifications enabled!");
        }
    });
}

// Send message when button is clicked
document.getElementById("sendButton").addEventListener("click", function () {
    let user = document.getElementById("userInput").value;
    let message = document.getElementById("messageInput").value;

    if (user && message) {
        connection.invoke("SendMessage", user, message).catch(err => console.error(err.toString()));
        document.getElementById("messageInput").value = "";
    }
});

// Receive messages with notification
connection.on("ReceiveMessage", function (user, message) {
    let msg = `<li><strong>${user}:</strong> ${message}</li>`;
    document.getElementById("messagesList").innerHTML += msg;

    // Show browser notification
    if (Notification.permission === "granted") {
        new Notification("New Chat Message", {
            body: `${user}: ${message}`,
            icon: "~/images/icon-chart.png" // Optional icon for the notification
        });
    }
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
