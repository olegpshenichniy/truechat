import os
from PIL import Image, ImageOps

from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _


class User(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    chat_name = models.CharField(_('chat name'), max_length=60, blank=False, null=False)
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

    @property
    def avatar_url_thumbnail(self):
        thumbnails_dir = self.avatar_thumbnail_dir
        thumbnail_file_path = self.avatar_thumbnail_file_path

        if not os.path.exists(thumbnails_dir):
            os.makedirs(thumbnails_dir)

        if not os.path.exists(thumbnail_file_path):
            image = Image.open(self.avatar)
            thumbnail = ImageOps.fit(image, (100, 100), Image.ANTIALIAS)
            thumbnail.save(thumbnail_file_path)

        return '{}{}user/profile/avatar/thumbs/{}'.format(
            settings.BASE_URL,
            settings.MEDIA_URL,
            os.path.basename(thumbnail_file_path)
        )

    @property
    def avatar_thumbnail_dir(self):
        return os.path.join(settings.MEDIA_ROOT, os.path.dirname(str(self.avatar)), 'thumbs')

    @property
    def avatar_thumbnail_file_path(self):
        thumbnail_file_name = '100x100_thumb_{}'.format(os.path.basename(str(self.avatar)))
        return os.path.join(self.avatar_thumbnail_dir, thumbnail_file_name)
