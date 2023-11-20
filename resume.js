const availableCommands = [
  "about",
  "education",
  "certificates",
  "projects",
  "experience",
  "skills",
  "contact",
  "download",
  "help",
  "clear",
];

let commandHistory = [];
let commandIndex = 0;

const commandInput = document.getElementById("command");
const executedCommandsContainer = document.getElementById("executed_commands");

document.addEventListener("click", focusTextInputOnClick);
commandInput.addEventListener("keyup", handleKeyUp);

/**
 * Focus the text input when clicking outside interactive elements
 */
function focusTextInputOnClick(event) {
  if (
    event.target.tagName !== "A" &&
    event.target.tagName !== "BUTTON" &&
    !event.target.isContentEditable
  ) {
    document.querySelector('input[type="text"]').focus();
  }
}

function handleKeyUp(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    executeCommand();
  } else if (event.keyCode === 38) {
    event.preventDefault();
    cycleCommand("up");
  } else if (event.keyCode === 40) {
    event.preventDefault();
    cycleCommand("down");
  } else if (event.keyCode === 32 && event.ctrlKey) {
    // Ctrl + Space key
    event.preventDefault();
    performTabCompletion();
  }
}

function executeCommand() {
  const inputCommand = commandInput.value;

  if (inputCommand) {
    let element = document.getElementById(inputCommand);
    if (!availableCommands.includes(inputCommand)) {
      element = document.getElementById("error");
    }

    if (inputCommand === "download") {
      window.open("./resume.pdf", "_blank");
    } else if (inputCommand === "clear") {
      clearConsole();
      commandHistory.push(inputCommand);
      return;
    }

    displayCommandOutput(inputCommand, element);
    commandHistory.push(inputCommand);
  }

  commandInput.value = "";
  commandIndex = commandHistory.length;
  scrollToBottom();
}

function displayCommandOutput(inputCommand, element) {
  const outputElement = element.cloneNode(true);
  outputElement.style.display = "block";

  const commandOutputDiv = document.createElement("div");
  const containerDiv = document.createElement("div");
  const commandTextNode = document.createTextNode(
    `visitor@Marin-resume-site:~# ${inputCommand}`
  );
  commandOutputDiv.appendChild(containerDiv);
  containerDiv.appendChild(commandTextNode);

  if (inputCommand) {
    commandOutputDiv.appendChild(outputElement);
  }

  executedCommandsContainer.appendChild(commandOutputDiv);
}

/**
 * Cycles through command history using arrow keys
 */
function cycleCommand(direction) {
  if (
    (!commandIndex && direction === "up") ||
    (commandIndex === commandHistory.length && direction === "down")
  )
    return;
  if (commandIndex + 1 === commandHistory.length && direction === "down") {
    commandIndex += 1;
    return (commandInput.value = "");
  }

  if (direction === "up" && commandIndex > 0) {
    commandIndex -= 1;
  } else if (direction === "down" && commandIndex < commandHistory.length - 1) {
    commandIndex += 1;
  }
  commandInput.value = commandHistory[commandIndex];
}

function performTabCompletion() {
  const input = commandInput.value;
  const matchingCommand = availableCommands.find((cmd) =>
    cmd.startsWith(input)
  );
  if (matchingCommand) {
    commandInput.value = matchingCommand;
  }
}

function clearConsole() {
  executedCommandsContainer.innerHTML = "";
  commandInput.value = "";
}

function scrollToBottom() {
  const scrollingElement = document.scrollingElement || document.body;
  scrollingElement.scrollTop = scrollingElement.scrollHeight;
}
