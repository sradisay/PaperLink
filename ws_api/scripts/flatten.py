from collections import OrderedDict


def minify(delta):  # extract ONLY required fields from delta
    return {
        "server_id": delta["server_id"],
        "change_type": delta["change_type"],
        "text": delta["text"],
        "pos": delta["pos"],
        "meta": delta["meta"]
    }


class DeltaFlattener:
    """
    Flatten Deltas
    """
    complete = []
    flattened = []
    pre_flattened = OrderedDict()  # id : delta

    def __init__(self, deltas):
        self.deltas = deltas
        self.action_map = {
            "add": self.add,
            "remove": self.delete,
            "change-meta": self.meta_change
        }

    def process(self):
        self.pre_flatten_deltas()
        self.flatten_deltas()

    def flatten_deltas(self):
        """
        Take "flatter" delta dict and convert to list (checking neighbors for similarity)
        """

        for item in self.pre_flattened.values():
            try:
                prev = self.flattened[-1:][0]  # copy end of flattened
            except IndexError:
                self.flattened.append(item)  # return w/o combination if flattened is empty
                return

            if prev["meta"] == item["meta"]:  # combine item and prev
                prev = self.flattened.pop()  # delete from end of flattened (and return to prev var)
                item["text"] = prev["text"] + item["text"]

            self.flattened.append(item)

    def pre_flatten_deltas(self):
        for delta in self.deltas:
            self.action_map[delta["change_type"]](delta)

    def add(self, delta):
        if delta["pos"]["base_id"] is None:  # for first addition
            self.pre_flattened[delta["server_id"]] = minify(delta)
            return

        insertion_delta = self.pre_flattened[delta["pos"]["base_id"]]
        if insertion_delta["meta"] == delta["meta"]:  # yay! same formatting.
            old_pre_index = insertion_delta["text"][:delta["pos"]["index"]]
            insertion = delta["text"]
            old_post_index = insertion_delta["text"][delta["pos"]["index"]:]
            insertion_delta["text"] = old_pre_index + insertion + old_post_index
            return  # modification to existing delta with same formatting - completed.
        elif (len(insertion_delta["text"]) == delta["pos"]["index"]+1) or (delta["pos"]["index"] == 0):
            """
            This really sucks, but, without implementing our own datastructure there is no way to insert into a dict
            with defined order in O(1) time. In the future, this will be re-implemented in 
            C++ using a hashmap and doubly linked list
            
            hashmap[id] -> node in doubly linked list containing a struct of data
            """
            new_dict = OrderedDict()
            for item in self.pre_flattened.items():
                if item[0]["server_id"] == insertion_delta["server_id"]:
                    if len(insertion_delta["text"]) == delta["pos"]["index"]+1:  # append
                        new_dict[item[0]] = item[1]
                        new_dict[delta["server_id"]] = minify(delta)
                    else:  # otherwise prepend
                        new_dict[delta["server_id"]] = minify(delta)
                        new_dict[item[0]] = item[1]
        else:
            raise Exception("Critical Error: Insertion w/ dissimilar formatting")
            # insertions with conflicting formats are disallowed due to handling complexity

    def delete(self, delta):
        if len(delta["pos"]["base_ids"]) == 1:  # single ID - remove substring
            delt_id = delta["pos"]["base_ids"][0]

            try:
                del_from = delta["pos"]["st_index"]
                del_to = delta["pos"]["ed_index"]

                self.pre_flattened[delt_id] = self.pre_flattened[delt_id]["text"][0:del_from] \
                                              + self.pre_flattened[delt_id]["text"][del_to:]
            except KeyError:
                print("KeyErr /// Missing st_index or ed_index in delta")
                self.pre_flattened.pop(delt_id)

    def meta_change(self, delta):  # overwrite meta for specified items
        for delt_id in delta["pos"]["base_ids"]:
            self.pre_flattened[delt_id]["meta"] = delta["meta"]
