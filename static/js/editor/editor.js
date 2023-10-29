



document.addEventListener("keydown", (event) => {
    if (true) {
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










function load_documents(){


    let doc_id = $("#doc-id").val();
    fetch(`/api/get_document?doc_id=${doc_id}`, {
        method: 'GET',
    }).then((response) => {
        return response.json();
    }).then((data) => {
        for(let i = 0; i < data.deltas.length; i++){

            consume(data.deltas[i]);
        }
    });
}




load_documents();
