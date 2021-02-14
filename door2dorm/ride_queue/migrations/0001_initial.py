# Generated by Django 3.1.6 on 2021-02-04 05:12

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Ride',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sunet', models.CharField(max_length=30)),
                ('time_requested', models.DateTimeField(verbose_name='time requested')),
                ('num_passengers', models.IntegerField(default=1)),
            ],
        ),
    ]