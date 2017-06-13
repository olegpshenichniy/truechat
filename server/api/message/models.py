from django.db import models
from django.conf import settings


class AbstractMessage(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL)
    text = models.TextField()
    datetime = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        abstract = True
        