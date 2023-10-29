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
            "ed_index": document.getElementById(pos.start_delta_id).innerText.length
        }
    })
    pushDelta({
        "temp_id": generateUID(),
        "change_type": "remove",
        "pos": {
            "base_delta": pos.end_delta_id,
            "st_index": 0,
            "ed_index": pos.end_index
        }
    })
    const start_oindex = document.getElementById(pos.start_delta_id).getAttribute("oindex");
    const end_oindex = document.getElementById(pos.end_delta_id).getAttribute("oindex");
    let iter_delta;
    for (let i = start_oindex + 1; i < end_oindex; i++){
        iter_delta = document.querySelector("[oindex='"+ i + "']")
        pushDelta({
            "temp_id": generateUID(),
            "change_type": "remove",
            "pos": {
                "base_delta": iter_delta.id,
            }
        })
    }
}


function update(key, pos, is_selection) {
    if (!awaiting_save) awaiting_save = true;
    console.log(pos);
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
                    "pos": pos
                })
            } else {
                const selector = '[oindex= \'' + (parseInt(document.getElementById(pos.base_delta).getAttribute('oindex')) + 1) + '\']'
                const nextDeltaId = document.querySelector(selector).id;
                pushDelta({
                    "temp_id": generateUID(),
                    "change_type": "remove",
                    "pos": {
                        "base_delta": nextDeltaId,
                        "index": 0
                    }
                })
            }
        } else if (key === "Backspace") {
            if (pos.index === 0) {
                if (document.getElementById(pos.base_delta).getAttribute("oindex") === '0' ) return;
                const selector = '[oindex= \'' + (parseInt(document.getElementById(pos.base_delta).getAttribute('oindex')) - 1) + '\']'
                const prevDeltaId = document.querySelector(selector).id;
                pushDelta({
                    "temp_id": generateUID(),
                    "change_type": "remove",
                    "pos": {
                        "base_delta": prevDeltaId,
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
        if (is_selection) {
            batchDelete(pos);
        }
        // check if we can add a new delta without splitting any
        const baseDelta = document.getElementById(pos.start_delta_id);
        if (pos.index === baseDelta.length){
            pushDelta({
                "temp_id": generateUID(),
                "change_type": "add",
                "pos": pos
            })
        } else {

        }
    }
}

function pushDelta(delta_){
    // perform change to the local document
    console.log(delta_);
    consumeDelta(delta_);
    // analyze pending deltas to see if we can edit them before making a new delta
    delta.deltas.push(delta_);
}