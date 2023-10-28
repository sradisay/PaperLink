from editor.models import SubDocument, RootDocument


def sub_search(root: RootDocument):
    """
    Recursive algorithm to get all children
    """
    doc_tree = {
        "parent": {
            "pk": root.pk,
            "name": root.name,
            "children": []
        }
    }
    children = root.sub_branches.all()
    for i, child in enumerate(children):
        child_dict = {
            "pk": child.pk,
            "name": child.name,
            "children": []
        }
        doc_tree["parent"]["children"].append(sub_search_sub(child, child_dict))

    return doc_tree


def sub_search_sub(sub: SubDocument, child_dict):
    children = sub.sub_branches.all()
    for i, child in enumerate(children):
        second_child_dict = {
            "pk": child.pk,
            "name": child.name,
            "children": []
        }
        child_dict["children"].append(sub_search_sub(child, second_child_dict))

    return child_dict
