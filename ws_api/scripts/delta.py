import uuid


def process_edit(document, deltas):
    doc_json = document.document

    for delta in deltas:
        assigned_id = str(uuid.uuid4())
        doc_json["deltas"].append(delta)

        delta["server_id"] = assigned_id

    document.save()

    return deltas
