import urllib.request
import json
from django.core.management.base import BaseCommand
from apps.properties.models import University


class Command(BaseCommand):
    help = 'Poblar la tabla University con universidades españolas via Hipo Labs API'

    def handle(self, *args, **options):
        url = 'http://universities.hipolabs.com/search?country=Spain'
        self.stdout.write('Descargando universidades de Hipo Labs...')

        try:
            with urllib.request.urlopen(url, timeout=15) as response:
                data = json.loads(response.read().decode())
        except Exception as e:
            self.stderr.write(f'Error al descargar datos: {e}')
            return

        created = updated = 0
        for entry in data:
            name = (entry.get('name') or '').strip()
            if not name:
                continue
            # Hipo Labs no devuelve ciudad directamente; usamos state-province si existe
            city = (entry.get('state-province') or '').strip()
            _, was_created = University.objects.get_or_create(
                name=name,
                defaults={'city': city},
            )
            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(self.style.SUCCESS(
            f'Listo: {created} universidades creadas, {updated} ya existían.'
        ))
