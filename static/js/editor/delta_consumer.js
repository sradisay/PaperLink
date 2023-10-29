// Script for consuming deltas on the editor


function setCursor(id, index){
    let textNode = document.getElementById(id).firstChild;
    let range = document.createRange();
    let sel = window.getSelection();
    range.setStart(textNode, index);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}
function consume(delta)
{
    let change_type = delta.change_type;

    if (change_type === "add")
    {
        let id = ("server_id" in delta) ? delta.server_id : delta.temp_id;

        let base_id = delta.pos.base_id;
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

        if (base_id === "editor"){
             $("#editor").append(new_delta);
             if (!delta.split) {
                setCursor(new_delta.attr('id'), new_delta.text().length);
            }
        } else {
            let prev = $("#" + base_id);
            if (prev.length !== 0) {
                prev.after(new_delta);
                if (!delta.split) {
                    setCursor(new_delta.attr('id'), new_delta.text().length);
                }
            } else {
                $("#editor").append(new_delta);
            }
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
            if ("st_index" in pos){
                let delta = $("#" + id);
                let text = delta.text();
                let new_text = text.slice(0, st_index) + text.slice(ed_index);
                delta.text(new_text);
                if (delta.text().length === 0){
                    if (document.getElementById("editor").childElementCount !== 1){
                        if (delta.prev().attr('id') !== undefined) {
                            if (delta.prev().text().length !== 0) {
                                setCursor(delta.prev().attr('id'), delta.prev().text().length);
                            }
                        } else {
                            if (delta.next().text().length !== 0) {
                                setCursor(delta.next().attr('id'), 0);
                            }
                        }
                        delta.remove();
                    }
                }
                else
                {
                    if (delta.attr('id') !== "editor") {
                        setCursor(id, st_index);
                    }
                }
            } else {
                $("#" + id).remove();
            }
        }
        else
        {
            for(let i = 0; i < ids.length; i++){
                let id = ids[i];
                let delta = $("#" + id);
                if (document.getElementById("editor").childElementCount !== 1){
                    delta.remove();
                }
            }
        }
    }

}

function consume_over(delta, editor_id)
{
    let change_type = delta.change_type;

    if (change_type === "add")
    {
        let id = ("server_id" in delta) ? delta.server_id : delta.temp_id;

        let base_id = delta.pos.base_id;
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

        if (base_id === editor_id){
             $("#"+editor_id).append(new_delta);
             if (!delta.split) {
                setCursor(new_delta.attr('id'), new_delta.text().length);
            }
        } else {
            let prev = $("#" + base_id);
            if (prev.length !== 0) {
                prev.after(new_delta);
                if (!delta.split) {
                    setCursor(new_delta.attr('id'), new_delta.text().length);
                }
            } else {
                $("#"+editor_id).append(new_delta);
            }
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
            if ("st_index" in pos){
                let delta = $("#" + id);
                let text = delta.text();
                let new_text = text.slice(0, st_index) + text.slice(ed_index);
                delta.text(new_text);
                if (delta.text().length === 0){
                    if (document.getElementById(editor_id).childElementCount !== 1){
                        if (delta.prev().attr('id') !== undefined) {
                            if (delta.prev().text().length !== 0) {
                                setCursor(delta.prev().attr('id'), delta.prev().text().length);
                            }
                        } else {
                            if (delta.next().text().length !== 0) {
                                setCursor(delta.next().attr('id'), 0);
                            }
                        }
                        delta.remove();
                    }
                }
                else
                {
                    if (delta.attr('id') !== editor_id) {
                        setCursor(id, st_index);
                    }
                }
            } else {
                $("#" + id).remove();
            }
        }
        else
        {
            for(let i = 0; i < ids.length; i++){
                let id = ids[i];
                let delta = $("#" + id);
                if (document.getElementById(editor_id).childElementCount !== 1){
                    delta.remove();
                }
            }
        }
    }

}


