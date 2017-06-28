from django.contrib import admin

from .models import PrivateMessage, GroupMessage


admin.site.register(PrivateMessage)
admin.site.register(GroupMessage)
