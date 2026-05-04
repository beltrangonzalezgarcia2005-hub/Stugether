from django.db import migrations


def reassign_docs(apps, schema_editor):
    Document = apps.get_model('users', 'Document')
    docs = list(Document.objects.filter(doc_type='PROPERTY_TITLE', user__role='STUDENT'))
    for doc in docs:
        doc.doc_type = 'CONTRACT'
        doc.status = 'PENDING'
        doc.rejection_reason = '[Migrado automáticamente. Por favor, sube tu contrato de arrendamiento.]'
    if docs:
        Document.objects.bulk_update(docs, ['doc_type', 'status', 'rejection_reason'])


def reverse_reassign(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_customuser_notification_preferences_and_more'),
    ]

    operations = [
        migrations.RunPython(reassign_docs, reverse_reassign),
    ]
