from django.db import models


class FoundItem(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    date = models.DateField()
    finder = models.CharField(max_length=200)
    status = models.CharField(max_length=20, default="Found")

    def __str__(self):
        return f"{self.name} (Found)"


class LostItem(models.Model):
    STATUS_CHOICES = [
        ("Lost", "Lost"),
        ("Found", "Found"),
        ("Returned", "Returned"),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    date = models.DateField()
    contact = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Lost")

    def __str__(self):
        return f"{self.name} - {self.status}"


class ReturnedItem(models.Model):
    item_name = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    finder_name = models.CharField(max_length=200)
    date_returned = models.DateField()
    remarks = models.TextField(blank=True, null=True)

    # NEW FIELD
    status = models.CharField(max_length=20, default="Returned")

    def __str__(self):
        return f"{self.item_name} (Returned)"
