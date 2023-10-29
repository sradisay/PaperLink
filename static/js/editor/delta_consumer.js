// Script for consuming deltas on the editor
function consume(delta){
    if (delta.change_type === "add")
    {
        let id = delta.id;
        let text = delta.text;
        let pos = delta.pos;
        let base_delta = pos.base_delta;
        let meta = delta.meta;
        let styles = meta.styles;
        let prev = $("#" + base_delta);
        if (prev.length !== 0){
            prev.insertAfter(`<span style="font-family: ${meta.font}; font-size:${meta.size}px;" id="${id}">${text}</span>`);
        }
        else
        {
            $("#editor").append(`<span style="font-family: ${meta.font}; font-size:${meta.size}px;" id="${id}">${text}</span>`);
        }

    }
    else
    {
        let id = delta.id; // ignore
        let pos = delta.pos;
        let base_delta = pos.base_delta;
        let st_index = pos.st_index;
        let ed_index = pos.ed_index;
        if (st_index !== null){
            let delta = $("#" + base_delta);
            let text = delta.text();
            let new_text = text.slice(0, st_index) + text.slice(ed_index);
            delta.text(new_text);
        }
        else
        {
            let delta = $("#" + base_delta);
            delta.remove();
        }
    }

}
