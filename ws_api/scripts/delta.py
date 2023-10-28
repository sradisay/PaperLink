import uuid


def process_edit(document, deltas):  # epic hackathon zero-sanitation code
    doc_json = document.document

    pass_back = []

    for delta in deltas:
        if delta["change_type"] == "delete":
            #  remove from deltas list and order list
            del doc_json["deltas"][delta["id"]]
            doc_json["delta_order"].remove(delta["id"])
        elif delta["change_type"] == "add":
            #  add to delta dict and delta_order list
            assigned_id = str(uuid.uuid4())
            doc_json["deltas"][assigned_id] = delta

            if delta["pos"]["base_id"] is not None:
                doc_json["delta_order"].insert(  # insert new delta into order @ 1+ base_id
                    doc_json["delta_order"].index(delta["pos"]["base_id"]) + 1, assigned_id)
            else:
                doc_json["delta_order"].insert(
                    0, assigned_id
                )

            delta["id"] = assigned_id  # for return to client

    document.save()

    return deltas
