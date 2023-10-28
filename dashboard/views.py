from django.shortcuts import render, redirect

from editor.models import RootDocument


# Create your views here.
def dashboard(request):
    if request.user.is_authenticated:
        documents = RootDocument.objects.filter(user=request.user)
        return render(request, 'dashboard/dashboard.html', {"documents": documents})

    return redirect("login")
