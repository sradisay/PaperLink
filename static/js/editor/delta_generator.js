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

setInterval( () => {
    if (awaiting_save) {
        await_timer = await_timer - 1;
        max_await_timer = max_await_timer - 1;
    }
}, 1000);

function batchDelete(pos){
    pushDelta({
        "temp_id": generateUID(),
        "change_type": 'remove',
        "pos": {
            "base_delta": pos.start_delta_id,
            "st_index": pos.start_index,
            "ed_index": document.getElementById(pos.start_delta_id).innerText.length + 1
        }
    });
    pushDelta({
        "temp_id": generateUID(),
        "change_type": "remove",
        "pos": {
            "base_delta": pos.end_delta_id,
            "st_index": 0,
            "ed_index": pos.end_index + 1
        }
    });
    let iter_delta = document.getElementById(pos.start_delta_id).nextElementSibling;
    let delete_ids = [];
    while(iter_delta.id !== pos.end_delta_id){
        delete_ids.push(iter_delta.id);
    }
    pushDelta({
        "temp_id": generateUID(),
        "change_type": "remove",
        "pos": {
            "base_ids": delete_ids
        }
    });
}


function update(key, pos, is_selection) {
    if (!awaiting_save) awaiting_save = true;
    // handle deletions
    if (key === "Delete" || key === "Backspace") {
        if (is_selection) {
            batchDelete(pos)
        } else if (key === "Delete") {
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
            if (pos.index === 0) {
                if (document.getElementById(pos.base_delta).previousElementSibling === null ) return;
                const prevDeltaId = document.getElementById(pos.base_delta).id;
                pushDelta({
                    "temp_id": generateUID(),
                    "change_type": "remove",
                    "pos": {
                        "base_ids": [prevDeltaId],
                        "index": 0
                    }
                })
            } else {
                pushDelta({
                    "temp_id": generateUID(),
                    "change_type": "remove",
                    "pos": {
                        "base_delta": pos.base_delta,
                        "index": pos.index -1
                    }
                })
            }
        }
    } else if (key.length === 1) {
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
        const baseDelta = document.getElementById(base_id);
        if (index === baseDelta.length){
            pushDelta({
                "temp_id": generateUID(),
                "change_type": "add",
                "text": key,
                "pos": {
                    "base_id": baseDelta.id,
                    "index": 0
                }
            })
        } else {
            const base_delta = document.getElementById(base_id);
            let left_base_delta_id = base_delta.previousElementSibling;
            left_base_delta_id = left_base_delta_id === null ? null : left_base_delta_id.id;

            const left_text = base_delta.innerText.substring(0, index+1);
            const right_text = base_delta.innerText.substring(index+1, base_delta.innerText.length);
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
                "text": left_text,
                "pos": {
                    "base_id": left_base_delta_id
                }
            });

            // new (center)
            const new_id = generateUID();
            pushDelta({
                "temp": new_id,
                "change_type": "add",
                "text": key,
                "pos": {
                    "base_id": left_delta_id
                }
            });

            // right
            pushDelta({
                "temp": generateUID(),
                "change_type": "add",
                "text": right_text,
                "pos": {
                    "base_id": new_id
                }
            });
        }
    }
}

function pushDelta(delta_){
    // perform change to the local document
    console.log(delta_);
    consume(delta_);
    // analyze pending deltas to see if we can edit them before making a new delta
    delta.deltas.push(delta_);
}