from django.db import models
from django.conf import settings

from thread.models import PrivateThread, GroupThread


class AbstractMessage(models.Model):
    """
    Base class for all messages.
    """
    sender = models.ForeignKey(settings.AUTH_USER_MODEL)
    text = models.TextField()
    datetime = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        abstract = True


class PrivateMessage(AbstractMessage):
    """
    Private messages between 2 users. Goes into `thread.models.PrivateThread`.
    """
    thread = models.ForeignKey(PrivateThread,
                               related_name='messages')

    def __str__(self):
        return '{} to {}'.format(self.__class__.__name__, self.thread)


class GroupMessage(AbstractMessage):
    """
    Group message. Goes into `thread.models.GroupThread`.
    """
    thread = models.ForeignKey(GroupThread,
                               related_name='messages')

    def __str__(self):
        return '{} to {}'.format(self.__class__.__name__, self.thread)
        