from django.urls import path
from .views import login_user
from.views import register_user

urlpatterns = [
    path('login/', login_user),
    path('register/', register_user),
]