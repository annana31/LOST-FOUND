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
    path('lost-items/', get_lost_items),
    path('lost-items/add/', add_lost_item),
    path('lost-items/update/<int:id>/', update_lost_item),
    path('lost-items/delete/<int:id>/', delete_lost_item),
    path('lost-items/return/<int:id>/', mark_lost_returned),
    path('returned-items/', get_returned_items),
    path('found-items/return/<int:id>/', mark_returned),
    path('returned-items/delete/<int:id>/', delete_returned_item),
]