// Scripts for generating deltas from the editor

let delta = {
    "client_id": generateUID(),
    "deltas": []
    // "deltas" should only contain a single insertion OR an insertion along with deletion(s) surrounding the affected
    // delta. deltas passed in this list should be minimal and not cause conflicts with one another if they are
    // processed by the server sequentially.
};
let await_timer = 2;
let max_await_timer = 15;
let awaiting_save = false;


function generateUID(){
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function pushDelta(delta_){
    await_timer = 2;

    consume(delta_);
    // analyze pending deltas to see if we can edit them before making a new delta
    delta.deltas.push(delta_);
}
let doc_id = $("#doc-id").val();
const ws = new WebSocket(`ws://127.0.0.1:8000/ws/edit/${doc_id}/`);

ws.addEventListener('message', (e) => {
    console.log("saved")
    for (let i = 0; i < e.data.length; i++){
        $("#"+e.data[i].client_id).attr("id", e.data[i].temp_id);
    }
});
setInterval( () => {
    if (awaiting_save) {
        await_timer = await_timer - 1;
        max_await_timer = max_await_timer - 1;
    }
    if (await_timer === 0){
        await_timer = 2;
        awaiting_save = false;

        console.log(delta);
        ws.send(JSON.stringify(delta));
    }
}, 1000);

function batchDelete(pos){
    if (pos.start_delta_id !== pos.end_delta_id) {
        let iter_delta = document.getElementById(pos.start_delta_id).nextElementSibling;
        let delete_ids = [];
        while (iter_delta.id !== pos.end_delta_id) {
            delete_ids.push(iter_delta.id);
            iter_delta = iter_delta.nextElementSibling;
        }
        pushDelta({
            "temp_id": generateUID(),
            "change_type": "remove",
            "pos": {
                "base_ids": delete_ids
            }
        });
        pushDelta({
            "temp_id": generateUID(),
            "change_type": 'remove',
            "pos": {
                "base_ids": [pos.start_delta_id],
                "st_index": pos.start_index,
                "ed_index": document.getElementById(pos.start_delta_id).innerText.length + 1
            }
        });
        pushDelta({
            "temp_id": generateUID(),
            "change_type": "remove",
            "pos": {
                "base_ids": [pos.end_delta_id],
                "st_index": 0,
                "ed_index": pos.end_index + 1
            }
        });
    } else {
        pushDelta({
            "temp_id": generateUID(),
            "change_type": 'remove',
            "pos": {
                "base_ids": [pos.start_delta_id],
                "st_index": pos.start_index,
                "ed_index": pos.end_index
            }
        });
    }
}


function update(key, pos, is_selection) {
    // edge case of blank document
    if (pos.base_delta === "editor" || pos.base_delta === "" || pos.base_delta === undefined || pos.base_delta === null) {
        let new_delta = document.getElementById("editor").firstElementChild;
        if (new_delta === null || new_delta === undefined) {
            let new_delta = $(`<span style="font-family: 'Times New Roman',sans-serif; font-size:18px;" id="root"></span>`);
            $("#editor").append(new_delta);
            pos.base_delta = new_delta.attr('id');
        }
        else
        {
            pos.base_delta = new_delta.id;
        }

    }




    let special_key = false;

    if (key === " ") {
        key = "&nbsp;";
        special_key = true;
    }
    else if (key === "Enter"){
        key = "&#13;&#10;";
        special_key = true;
    }


    if (!awaiting_save) awaiting_save = true;
    // handle deletions
    if (key === "Delete" || key === "Backspace") {
        if (is_selection) {
            batchDelete(pos)
        } else if (key === "Delete") {
            console.log("del")
            const delta_length = document.getElementById(pos.base_delta).innerText.length;
            if (pos.index !== delta_length) {
                pushDelta({
                    "temp_id": generateUID(),
                    "change_type": 'remove',
                    "pos":
                        {
                            "base_ids": [pos.base_delta],
                            "st_index": pos.index,
                            "ed_index": pos.index + 1
                        }
                })
            } else {
                if (document.getElementById(pos.base_delta).nextElementSibling === null) return;
                const nextDeltaId = document.getElementById(pos.base_delta).nextElementSibling.id;
                pushDelta({
                    "temp_id": generateUID(),
                    "change_type": "remove",
                    "pos": {
                        "base_ids": [nextDeltaId],
                        "st_index": 0,
                        "ed_index": 1
                    }
                })
            }
        } else if (key === "Backspace") {
            console.log("bspace");
            if (pos.index === 0) {
                if (document.getElementById(pos.base_delta).previousElementSibling === null ) return;
                const prevDelta = document.getElementById(pos.base_delta).previousElementSibling;

                pushDelta({
                    "temp_id": generateUID(),
                    "change_type": "remove",
                    "pos": {
                        "base_ids": [prevDelta.id],
                        "st_index": prevDelta.innerText.length - 1,
                        "ed_index": prevDelta.innerText.length
                    }
                })
            } else {
                pushDelta({
                    "temp_id": generateUID(),
                    "change_type": "remove",
                    "pos": {
                        "base_ids": [pos.base_delta],
                        "st_index": pos.index -1,
                        "ed_index": pos.index
                    }
                })
            }
        }
    } else if (key.length === 1 || special_key) {
        // handle additions
        let base_id, index;
        if (is_selection) {
            batchDelete(pos);
            base_id = pos.start_delta_id;
            index = pos.start_index;
        } else {
            base_id = pos.base_delta;
            index = pos.index;
        }
        // check if we can add a new delta without splitting any
        console.log(base_id)
        const baseDelta = document.getElementById(base_id);
        if(baseDelta == null){
            return  // DO NOT PROCESS CHANGES FOR NULL IDS -- mitigation for bug
        }
        if (index === baseDelta.innerText.length || index === 0){
            pushDelta({
                "temp_id": generateUID(),
                "change_type": "add",
                "text": key,
                "pos": {
                    "base_id": index === 0 ? 'editor' : baseDelta.id,
                    "index": 0
                },
                "meta": {
                    "size": 18,
                    "font": "Times New Roman",
                    "styles": []
                }
            })
        } else {


            const base_delta = document.getElementById(base_id);
            let left_base_delta_id = base_delta.previousElementSibling;

            left_base_delta_id = left_base_delta_id === null ? null : left_base_delta_id.id;

            const left_text = base_delta.innerText.substring(0, index);
            const right_text = base_delta.innerText.substring(index, base_delta.innerText.length);
            const meta = null // TODO: implement meta generator (reverse meta consumer)

            // delete original
            pushDelta({
                "temp_id": generateUID(),
                "change_type": "remove",
                "pos": {
                    "base_ids": [base_id]
                }
            });

            // left
            const left_delta_id = generateUID();
            pushDelta({
                "temp_id": left_delta_id,
                "change_type": "add",
                "split": true,
                "text": left_text,
                "pos": {
                    "base_id": left_base_delta_id
                },
                "meta": {
                    "size": 12,
                    "font": "Times New Roman",
                    "styles": []
                }
            });

            // new (center)
            const new_id = generateUID();
            pushDelta({
                "temp_id": new_id,
                "change_type": "add",
                "text": key,
                "pos": {
                    "base_id": left_delta_id
                },
                "meta": {
                    "size": 12,
                    "font": "Times New Roman",
                    "styles": []
                }
            });

            // right
            pushDelta({
                "temp_id": generateUID(),
                "change_type": "add",
                "split": true,
                "text": right_text,
                "pos": {
                    "base_id": new_id
                },
                "meta": {
                    "size": 12,
                    "font": "Times New Roman",
                    "styles": []
                },

            });
        }
    }
}
