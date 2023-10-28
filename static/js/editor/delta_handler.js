// Scripts to handle delta operations

let delta = {
    "client_id": generateUID(),
    "deltas": []
    // "deltas" should only contain a single insertion OR an insertion along with deletion(s) surrounding the affected
    // delta. deltas passed in this list should be minimal and not cause conflicts with one another if they are
    // processed by the server sequentially.
};
let await_timer = 3;
let awaiting_save = false;


function generateUID(){
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

setInterval( () => { if (awaiting_save) await_timer = await_timer - 1; }, 1000);


function update(key, pos) {
    console.log(key);
    console.log(pos);
    if (!awaiting_save) awaiting_save = true;

    // handle deletions
    if (key === "Backspace" || key === "Delete") {
        if (pos.selection) {

        }
    }

}
