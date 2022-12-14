const socket = io("http://localhost:8000", { transports: ["websocket"] });

// Get DOM elements in respective JS variables
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

// Audio that will play on receiving messages
var newJoin = new Audio("../others/sound/sound1.mp3");
var newMessage = new Audio("../others/sound/sound2.mp3");

// Function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.innerHTML = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == "left") {
        newMessage.play();
    }
    if (position == "join" || position == "leave") {
        newJoin.play();
    }
    updateScroll();
};

// Ask new user for his/her name and let the server know
const userName = prompt("Enter your name to join");
socket.emit("new-user-joined", userName);

// If a new user joins, receive his/her name from the server
socket.on("user-joined", (name) => {
    append(`${name} has joined the chat`, "join");
});

// If server sends a message, receive it
socket.on("receive", (data) => {
    let message = "<strong>" + data.name + "</strong><br>" + data.message;
    append(message, "left");
});

// If a user leaves the chat, append the info to the container
socket.on("left", (name) => {
    append(`${name} has left the chat`, "leave");
});

// If the form gets submitted, send server the message
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
});

// Moving scroll to the bottom every time something new is added
function updateScroll() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
