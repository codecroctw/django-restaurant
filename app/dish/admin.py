from django.contrib import admin
from .models import Dish, DishCategory

# Register your models here.

admin.site.register(Dish)
admin.site.register(DishCategory)