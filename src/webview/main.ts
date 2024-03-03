import { ChatSession, ChatMessage } from "./chat-session";

window.addEventListener("load", main);

function main() {
  const chatSession = new ChatSession();
  const promptTextarea = getPromptTextArea(chatSession);
  const messagesContainer = getMessagesContainer(chatSession);

  document.addEventListener("keydown", (ev) => {
    if (ev.altKey && ev.key === "Enter") {
      const message = chatSession.sendMessage();

      messagesContainer.appendChild(createMsgDiv(message));
      promptTextarea.value = chatSession.getState().draft;
    }
  });

  window.addEventListener("message", (ev) => {
    const { command, data } = ev.data;

    switch (command) {
      case "receiveMessage":
        chatSession.receiveMessage(data);
        const messages = chatSession.getState().messages.map(createMsgDiv);
        messagesContainer.replaceChildren(...messages);
        return;
      case "copyText":
        const draft = chatSession.copyText(data);
        promptTextarea.value = draft;
    }
  });
}

function getPromptTextArea(chatSession: ChatSession) {
  const promptTextarea = document.getElementById(
    "prompt-textarea"
  ) as HTMLTextAreaElement;

  promptTextarea.value = chatSession.getState().draft;

  promptTextarea.addEventListener("input", function () {
    this.style.height = "10px";
    this.style.height = this.scrollHeight + "px";
    chatSession.setState({
      draft: this.value,
    });
  });

  return promptTextarea;
}

function getMessagesContainer(chatSession: ChatSession) {
  const messagesContainer = document.getElementById(
    "messages-container"
  ) as HTMLDivElement;

  const messages = chatSession.getState().messages.map(createMsgDiv);

  messagesContainer.append(...messages);

  return messagesContainer;
}

function createMsgDiv(msg: ChatMessage) {
  const msgDiv = document.createElement("div");
  msgDiv.innerHTML = msg.content;
  return msgDiv;
}
