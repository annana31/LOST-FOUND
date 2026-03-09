from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        return Response({
            "success": True,
            "message": "Login successful"
        })
    else:
        return Response({
            "success": False,
            "message": "Invalid username or password"
        })


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({
            "success": False,
            "message": "Username already exists"
        })

    User.objects.create_user(
        username=username,
        password=password
    )

    return Response({
        "success": True,
        "message": "User registered successfully"
    })