from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    @property
    def password_repeat(self):
        return None


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='user/profile/avatar')
