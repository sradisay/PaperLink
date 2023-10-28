def doc_exists(model, pk):
    try:
        model.objects.get(pk=pk)
        return True
    except model.DoesNotExist:
        return False
