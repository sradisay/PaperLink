import uuid


def process_edit(document, deltas):
    doc_json = document.document

    for delta in deltas:
        assigned_id = str(uuid.uuid4())
        delta["server_id"] = delta["temp_id"]

        doc_json["deltas"].append(delta)

    document.save()

    return deltas
