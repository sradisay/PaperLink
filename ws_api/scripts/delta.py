import json
import uuid


def process_edit(document, deltas):  # epic hackathon zero-sanitation code
    doc_json = json.loads(document.document)
    for delta in deltas:
        if delta["type"] == "delete":
            del doc_json["deltas"][delta["id"]]
        elif delta["type"] == "add":
            assigned_id = str(uuid.uuid4())
            doc_json["deltas"][assigned_id] = delta
            delta["id"] = assigned_id  # for return to client
