// Scripts for editor frontend

const editor = document.getElementById("editor");

// start with editor focused
let editor_focused = true;
editor.addEventListener('focus', () => { editor_focused = true });
editor.addEventListener('blur', () => { editor_focused = false });


document.addEventListener("keydown", (event) => {
    if (editor_focused) {
        if (!(event.key.startsWith("Arrow") || event.ctrlKey || event.altKey )) {
            event.preventDefault(); // disallow changing the html element
        }
        // Get the key from the event object
        const key = event.key

        // Check for toolbar actions
        // TODO: handle more toolbar shortcut actions
        if (event.ctrlKey) {
            if (key.toLowerCase() === "b") {
                console.log("bolden B)");
            }
        }
        else if (key.length === 1 || key === "Backspace" || key === "Delete" || key === "Enter") {
            let pos, is_selection;
            const selection = window.getSelection();
            if (selection.isCollapsed){
                is_selection = false;
                const range = selection.getRangeAt(0);
                let parentElement = range.startContainer.parentNode;
                 pos = {
                    base_delta: parentElement.id,
                    index: range.startOffset
                }
            }
            else {
                is_selection = true;
                const range = selection.getRangeAt(0);
                const startNode = range.startContainer.parentNode;
                const endNode = range.endContainer.parentNode;
                const startIndex = range.startOffset;
                const endIndex = range.endOffset;
                pos = {
                    start_delta_id: startNode.id,
                    start_index: startIndex,
                    end_delta_id: endNode.id,
                    end_index: endIndex
                }
            }
            update(key, pos, is_selection);
        }
    }
});

document.addEventListener('paste', (event) => {
    const clipboardData = event.clipboardData;

});





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


