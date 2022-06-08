const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://restserver-node-skydoes.herokuapp.com/api/auth/";

let user = null;
let socket = null;

// HTML References
const txtUid = document.querySelector("#txtUid");
const txtMessage = document.querySelector("#txtMessage");
const ulUsers = document.querySelector("#ulUsers");
const ulMessages = document.querySelector("#ulMessages");
const btnSignOut = document.querySelector("#btnSignOut");

// Validating JWT from localstorage
const validateJWT = async () => {
  const token = localStorage.getItem("token") || "";

  if (token.length <= 10) {
    window.location = "index.html";
    throw new Error("There isn't a valid token in localstorage");
  }

  const resp = await fetch(url, {
    headers: { "x-token": token },
  });

  const { user: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem("token", tokenDB);
  user: userDB;

  document.title = userDB.name;

  await connectSocket();
};

const connectSocket = async () => {
  socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socket.on("receivedMessage", showMessages);

  socket.on("usersOnline", showUsers);

  socket.on("receivedMsg-Private", (message) => {
    console.log('Private:', message);
  });
};

const showUsers = (users = []) => {
  let usersHTML = "";
  users.forEach(({ uid, name }) => {
    usersHTML += `
      <li>
        <p>
          <h5 class="text-success">${name}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>
    `;
  });
  ulUsers.innerHTML = usersHTML;
};

const showMessages = (messages = []) => {
  let messagesHTML = "";
  messages.forEach(({ name, message, time }) => {
    messagesHTML += `
      <li>
        <p>
          <span class="text-muted">${time}</span>
          <span class="text-primary">${name}</span>
          <span>${message}</span>
        </p>
      </li>
    `;
  });
  ulMessages.innerHTML = messagesHTML;
};

txtMessage.addEventListener("keyup", ({ keyCode }) => {
  const message = txtMessage.value.trim();
  const uid = txtUid.value.trim();

  if (keyCode !== 13) return;
  if (message.length === 0) return;

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  socket.emit("sendMessage", { message, uid,  time});

  txtMessage.value = "";
});

const main = async () => {
  await validateJWT();
};

main();
