from django.db import models

class FoundItem(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    date = models.DateField()
    finder = models.CharField(max_length=200)
    status = models.CharField(max_length=20, default="Found")

    def __str__(self):
        return self.name
    
class LostItem(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    date = models.DateField()
    contact = models.CharField(max_length=200)
    status = models.CharField(max_length=20, default="Lost")  

    def __str__(self):
        return self.name
    
class ReturnedItem(models.Model):
    item_name = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    finder_name = models.CharField(max_length=200)
    date_returned = models.DateField()
    remarks = models.TextField()