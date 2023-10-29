from django.shortcuts import render, redirect
from .forms import RegisterForm
from django.contrib.auth import logout

# Create your views here.
def homepage(request):
    return render(request, template_name="main/home.html")

# Create your views here.
def register(request):
    if request.method == 'GET':
        form = RegisterForm()
        return render(request, 'registration/register.html', context={'form': form})

    elif request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/dashboard')
        else:

            return render(request, 'registration/register.html', context={'form': form})


def info(request):
    return render(request, 'info/info.html')








