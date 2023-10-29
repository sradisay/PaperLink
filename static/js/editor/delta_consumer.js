// Script for consuming deltas on the editor
function consume(delta)
{
    let change_type = delta.change_type;

    if (change_type === "add")
    {
        let pos = delta.pos;
        let id = delta.server_id;
        let base_id = pos.base_id;
        let text = delta.text;
        let meta = delta.meta;
        let styles = meta.styles;

        let new_delta = $(`<span style="font-family: ${meta.font}; font-size:${meta.size}px;" id="${id}">${text}</span>`);

        for (let i = 0; i < styles.length; i++)
        {
            let style = styles[i];
            if (style === "bold"){
                new_delta.css("font-weight", "bold");
            } else if(style === "italic"){
                new_delta.css("font-style", "italic");
            } else if(style === "underline"){
                new_delta.css("text-decoration", "underline");
            }
        }


        let prev = $("#" + base_id);
        if (prev.length !== 0)
        {
            prev.insertAfter(new_delta);
        } else {
            $("#editor").append(new_delta);
        }

    }
    else if (change_type === "remove")
    {
        let pos = delta.pos;
        let ids = pos.base_ids;
        if (ids.length === 1){
            let id = ids[0];
            let st_index = pos.st_index;
            let ed_index = pos.ed_index;
            if (st_index !== null){
                let delta = $("#" + id);
                let text = delta.text();
                let new_text = text.slice(0, st_index) + text.slice(ed_index);
                delta.text(new_text);
            }
        }
        else
        {
            for(let i = 0; i < ids.length; i++){
                let id = ids[i];
                let delta = $("#" + id);
                delta.remove();
            }
        }
    }
    else
    {

    }

}
