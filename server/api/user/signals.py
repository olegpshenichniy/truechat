import os

from django.db.models.signals import post_save, post_init, post_delete
from django.dispatch import receiver

from .models import Profile


@receiver(post_init, sender=Profile)
def backup_avatar(sender, instance, **kwargs):
    instance._current_avatar_file = instance.avatar
    instance._current_avatar_thumbnail_file_path = instance.avatar_thumbnail_file_path


@receiver(post_save, sender=Profile)
def delete_old_image(sender, instance, **kwargs):
    if hasattr(instance, '_current_avatar_file'):

        if instance.avatar:
            if instance._current_avatar_file != instance.avatar.path:
                # remove old image
                instance._current_avatar_file.delete(save=False)
                # remove thumbnail
                if os.path.exists(instance._current_avatar_thumbnail_file_path):
                    os.remove(instance._current_avatar_thumbnail_file_path)
        else:
            if instance._current_avatar_file:
                # remove old image
                instance._current_avatar_file.delete()
                # remove thumbnail
                if os.path.exists(instance._current_avatar_thumbnail_file_path):
                    os.remove(instance._current_avatar_thumbnail_file_path)


@receiver(post_delete, sender=Profile)
def delete_images(sender, instance, **kwargs):
    if hasattr(instance, '_current_avatar_file'):

        if instance.avatar:
            # remove thumbnail
            if os.path.exists(instance.avatar_thumbnail_file_path):
                os.remove(instance.avatar_thumbnail_file_path)

            # remove image
            instance.avatar.delete(save=False)
