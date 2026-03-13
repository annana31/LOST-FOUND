"""
URL configuration for backend project.
"""

from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse


def home(request):
    return HttpResponse("Lost & Found Backend API is running")


urlpatterns = [
    path('admin/', admin.site.urls),

    # API ROUTES
    path('api/', include('api.urls')),

    # HOME PAGE
    path('', home),
]
