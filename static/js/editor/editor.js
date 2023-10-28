// JS for editor frontend

const editor = document.getElementById("editor");

// start with editor focused
let editor_focused = true;
document.addEventListener("keydown", logKeyPressed);

editor.addEventListener('focus', () => { editor_focused = true });
editor.addEventListener('blur', () => { editor_focused = false });


function logKeyPressed(event) {
    if (editor_focused) {
        // Get the key code or key from the event object
        const keyPressed = event.key || String.fromCharCode(event.keyCode);

        // Log the key
        console.log("Key pressed: " + keyPressed);
    }
}


// rewrite deprecated text modifiers below later
function changeColor() {
    const color = prompt("Enter your color in hex ex:#f1f233");
    document.execCommand("foreColor", false, color);
}


function getImage() {
    const file = document.querySelector("input[type=file]").files[0];

    const reader = new FileReader();

    let dataURI;

  reader.addEventListener(
    "load",
    function() {
      dataURI = reader.result;

      const img = document.createElement("img");
      img.src = dataURI;
      editorContent.appendChild(img);
    },
    false
  );

  if (file) {
    console.log("s");
    reader.readAsDataURL(file);
  }
}

function printMe() {
  if (confirm("Check your Content before print")) {
    const body = document.body;
    let s = body.innerHTML;
    body.textContent = editorContent.innerHTML;

    document.execCommandShowHelp;
    body.style.whiteSpace = "pre";
    window.print();
    location.reload();
  }
}