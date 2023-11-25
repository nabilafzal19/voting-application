const ctx = document.getElementById("voteChart").getContext("2d");

const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Ice Creams"],
    datasets: [],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
const socket = io();
socket.on("update", (candidates) => {
  candidates = Object.entries(candidates);

  for (const [key, candidate] of candidates) {
    if (
      typeof chart.data.datasets[key] == "undefined" &&
      chart.data.datasets.length < candidates.length
    ) {
      chart.data.datasets.push({
        backgroundColor: candidate.color,
        data: [candidate.vote],
        label: [candidate.label],
        borderWidth: 1,
      });
    } else if (typeof chart.data.datasets[key] != "undefined") {
      chart.data.datasets[key].data = [candidate.vote];
    }
    chart.update();
  }
});

function vote(index) {
  socket.emit("vote", index);
}
const chatForm = document.querySelector(".chatForm");
const chatMessages = document.querySelector(".chat-messages");
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;

  if (msg !== "") {
    // sending message to the server..
    socket.emit("chatMessage", msg);

    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
  }
});

socket.on("message", (message) => {
  console.log("message", message);
  outputMessage(message);
  //scroll up
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta" >${message.text}<span> ${message.time}</span></p>`;

  document.querySelector(".chat-messages").appendChild(div);
}
