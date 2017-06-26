from django.db import models
from django.conf import settings


class AbstractThread(models.Model):
    """
    Base class for PrivateThread and GroupThread.
    """
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL)
    last_message = models.DateTimeField(null=True, blank=True, db_index=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_changed = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['last_message']


class PrivateThread(AbstractThread):
    """
    Private messages thread between 2 users.
    """
    initiator = models.ForeignKey(settings.AUTH_USER_MODEL,
                                  related_name='inited_private_threads',
                                  help_text='User who inited conversation.')

    def __str__(self):
        return '{}: {}'.format(
            self.__class__.__name__,
            ', '.join([u.username for u in self.participants.all()])
        )


class GroupThread(AbstractThread):
    """
    Group thread.
    """
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='owned_group_threads')
    name = models.CharField(max_length=30, null=True, blank=True)

    def __str__(self):
        return '{}:"{}": {}'.format(
            self.__class__.__name__,
            self.thread_name,
            ', '.join([u.username for u in self.participants.all()])
        )

    @property
    def thread_name(self):
        if self.name:
            return self.name
        return 'noname'
