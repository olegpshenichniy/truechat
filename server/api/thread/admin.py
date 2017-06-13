from django.contrib import admin

from .models import GroupThread, PrivateThread

admin.site.register(GroupThread)
admin.site.register(PrivateThread)