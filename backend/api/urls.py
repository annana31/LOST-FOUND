from django.urls import path
from .views import login_user
from.views import register_user
from .views import *

urlpatterns = [
    path('login/', login_user),
    path('register/', register_user),
    path('found-items/', get_found_items),
    path('found-items/add/', add_found_item),
    path('found-items/update/<int:id>/', update_found_item),
    path('found-items/delete/<int:id>/', delete_found_item),
    path('found-items/return/<int:id>/', mark_returned),
]