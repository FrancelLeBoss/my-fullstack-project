from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0009_remove_order_is_paid_remove_order_status_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="confirmation_email_sent",
            field=models.BooleanField(default=False),
        ),
    ]
