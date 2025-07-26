from django.db import migrations

def fill_null_logins(apps, schema_editor):
    User = apps.get_model('users', 'User')
    for user in User.objects.filter(login__isnull=True):
        user.login = f"user_{user.id.hex[:8]}"
        user.save()

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_alter_user_login'),  
    ]

    operations = [
        migrations.RunPython(fill_null_logins),
    ]