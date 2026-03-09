from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import FoundItem, ReturnedItem
from .serializers import ReturnedItemSerializer

# LOGIN
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

# REGISTER
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

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import FoundItem
from .serializers import FoundItemSerializer


# GET all found items
@api_view(['GET'])
def get_found_items(request):
    items = FoundItem.objects.all().order_by('-id')
    serializer = FoundItemSerializer(items, many=True)
    return Response(serializer.data)


# ADD found item
@api_view(['POST'])
def add_found_item(request):
    serializer = FoundItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


# UPDATE found item
@api_view(['PUT'])
def update_found_item(request, id):
    item = FoundItem.objects.get(id=id)
    serializer = FoundItemSerializer(item, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


# DELETE found item
@api_view(['DELETE'])
def delete_found_item(request, id):
    item = FoundItem.objects.get(id=id)
    item.delete()
    return Response({"message": "Item deleted"})


# MARK AS RETURNED
@api_view(['PUT'])
def mark_returned(request, id):
    item = FoundItem.objects.get(id=id)
    item.status = "Returned"
    item.save()
    return Response({"message": "Item marked as returned"})

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import LostItem
from .serializers import LostItemSerializer

# GET all lost items
@api_view(['GET'])
def get_lost_items(request):
    items = LostItem.objects.all().order_by('-id')
    serializer = LostItemSerializer(items, many=True)
    return Response(serializer.data)

# ADD found item
@api_view(['POST'])
def add_lost_item(request):
    serializer = LostItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# UPDATE lost item
@api_view(['PUT'])
def update_lost_item(request, id):
    item = LostItem.objects.get(id=id)
    serializer = LostItemSerializer(item, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

# DELETE lost item
@api_view(['DELETE'])
def delete_lost_item(request, id):
    item = LostItem.objects.get(id=id)
    item.delete()
    return Response({"message": "Item deleted"})

# MARK AS RETURNED
@api_view(['PUT'])
def mark_lost_returned(request, id):
    item = LostItem.objects.get(id=id)
    item.status = "Returned"
    item.save()
    return Response({"message": "Item marked as returned"})

@api_view(['PUT'])
def mark_returned(request, id):
    item = FoundItem.objects.get(id=id)

    # Update found item status
    item.status = "Returned"
    item.save()

    # Save to ReturnedItem table
    ReturnedItem.objects.create(
        item_name=item.name,
        finder_name=item.finder,
        date_returned=item.date,
        remarks="Item returned successfully"
    )

    return Response({"message": "Item marked as returned and stored in ReturnedItem table"})

@api_view(['GET'])
def get_returned_items(request):
    items = ReturnedItem.objects.all().order_by('-id')
    serializer = ReturnedItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_returned_item(request, id):
    try:
        item = ReturnedItem.objects.get(id=id)
        item.delete()
        return Response({"message": "Returned item deleted"})
    except ReturnedItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)