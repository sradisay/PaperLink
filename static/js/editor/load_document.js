// Script for loading the document

// call api here and update document
// <span class="delta" id="0" oindex="0" style="font-size: 12px">

document.onload( () =>{
    const response = fetch('/api/names', {
      headers: {
        'Accept': 'application/json'
      }
});
})

async function render_deltas(){
    const doc_url = "/api/get_document?doc_id="
    const response = fetch(doc_url)
}