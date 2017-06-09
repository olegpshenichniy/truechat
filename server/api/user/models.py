from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _


class User(AbstractUser):
    email = models.EmailField(_('email address'), blank=False, null=False, unique=True)

    @property
    def password_repeat(self):
        return None


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='user/profile/avatar')

    @property
    def avatar_url(self):
        return '{}{}{}'.format(settings.BASE_URL, settings.MEDIA_URL, self.avatar)

