from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("editor/", include("editor.urls")),
    path("dashboard/", include("dashboard.urls")),
    path("api/", include("ws_api.urls")),
    path("", include("main.urls")),
    path('', include("django.contrib.auth.urls")),
]
