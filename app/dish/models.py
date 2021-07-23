from django.db import models


# Create your models here.
class DishCategory(models.Model):
    title = models.CharField('餐點類別', max_length=30)

    class Meta:
        verbose_name = '餐點類別'
        verbose_name_plural = '餐點類別'

    def __str__(self):
        return self.title


class Dish(models.Model):
    title = models.CharField('餐點名稱', max_length=30)
    description = models.CharField('餐點描述', max_length=120)
    price = models.IntegerField('價格')
    category = models.ForeignKey(DishCategory,
                                 on_delete=models.DO_NOTHING,
                                 verbose_name='餐點類別')

    class Meta:
        verbose_name = '餐點'
        verbose_name_plural = '餐點'

    def __str__(self):
        return self.title