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
        found_item = serializer.save()

        # Remove same item from LostItem table
        try:
            lost_item = LostItem.objects.get(name=found_item.name)
            lost_item.delete()
        except LostItem.DoesNotExist:
            pass

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

from rest_framework import status

@api_view(['PUT'])
def mark_returned(request, id):
    item = FoundItem.objects.get(id=id)

    item.status = "Returned"
    item.save()

    # Prevent duplicates
    returned_item, created = ReturnedItem.objects.get_or_create(
        item_name=item.name,
        finder_name=item.finder,
        date_returned=item.date,
        defaults={
            "description": item.description,
            "location": item.location,
            "remarks": "Item returned successfully",
            "status": "Returned"
        }
    )

    if created:
        message = "Item marked as returned and saved."
    else:
        message = "Item was already marked as returned."

    return Response({"message": message}, status=status.HTTP_200_OK)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import LostItem
from .serializers import LostItemSerializer

# GET all lost items
@api_view(['GET'])
def get_lost_items(request):
    items = LostItem.objects.filter(status="Lost").order_by('-id')
    serializer = LostItemSerializer(items, many=True)
    return Response(serializer.data, status=200)

# ADD lost item
@api_view(['POST'])
def add_lost_item(request):
    serializer = LostItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)  # Created
    return Response({"error": serializer.errors}, status=400)  # Bad request


# UPDATE lost item
@api_view(['PUT'])
def update_lost_item(request, id):
    try:
        item = LostItem.objects.get(id=id)
    except LostItem.DoesNotExist:
        return Response({"error": "Lost item not found"}, status=404)
    
    serializer = LostItemSerializer(item, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)  # OK
    return Response({"error": serializer.errors}, status=400)

# DELETE lost item
@api_view(['DELETE'])
def delete_lost_item(request, id):
    try:
        item = LostItem.objects.get(id=id)
        item.delete()
        return Response({"message": "Item deleted"}, status=204)  # No content
    except LostItem.DoesNotExist:
        return Response({"error": "Lost item not found"}, status=404)

# MARK lost item as returned / move to Found
@api_view(['PUT'])
def mark_lost_returned(request, id):
    try:
        item = LostItem.objects.get(id=id)
    except LostItem.DoesNotExist:
        return Response({"error": "Lost item not found"}, status=404)

    FoundItem.objects.create(
        name=item.name,
        description=item.description,
        location=item.location,
        date=item.date,
        finder=item.contact,
        status="Found"
    )

    # remove from lost table
    item.delete()

    return Response({"message": "Item moved to Found items"})


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
    
# ============================
# DASHBOARD API
# ============================

@api_view(['GET'])
def dashboard_data(request):
    lost_items = LostItem.objects.all()
    found_items = FoundItem.objects.all()
    returned_items = ReturnedItem.objects.all()

    lost_serializer = LostItemSerializer(lost_items, many=True)
    found_serializer = FoundItemSerializer(found_items, many=True)
    returned_serializer = ReturnedItemSerializer(returned_items, many=True)

    return Response({
        "total_lost": lost_items.count(),
        "total_found": found_items.count(),
        "total_returned": returned_items.count(),
        "lost_items": lost_serializer.data,
        "found_items": found_serializer.data,
        "returned_items": returned_serializer.data
    })
