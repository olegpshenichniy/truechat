from django.db import models
from django.conf import settings


class AccountActivationHash(models.Model):
    """
    Store activation hash, link to the user and status.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    hash = models.CharField(max_length=36)
    is_activated = models.BooleanField(default=False)

    def __str__(self):
        return '{} - {}'.format(self.user.email, 'activated' if self.is_activated else 'not activated')
