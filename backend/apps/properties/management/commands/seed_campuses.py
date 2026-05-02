import json
import unicodedata
import urllib.parse
import urllib.request
from django.core.management.base import BaseCommand
from apps.properties.models import University, Campus


def _strip_accents(text):
    return unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('ascii').lower()


OVERPASS_QUERY = """
[out:json][timeout:90];
area["ISO3166-1"="ES"]->.spain;
(
  way["amenity"="university"]["name"](area.spain);
  relation["amenity"="university"]["name"](area.spain);
);
out center tags;
"""


class Command(BaseCommand):
    help = 'Poblar Campus universitarios desde OpenStreetMap Overpass API'

    def handle(self, *args, **options):
        self.stdout.write('Descargando campus desde OpenStreetMap…')
        try:
            data = self._fetch_overpass()
        except Exception as exc:
            self.stderr.write(f'Error descargando datos: {exc}')
            return

        universities = {_strip_accents(u.name): u for u in University.objects.all()}

        created = updated = skipped = 0

        for element in data.get('elements', []):
            tags = element.get('tags', {})
            name = (tags.get('name') or '').strip()
            if not name:
                continue

            center = element.get('center') or {}
            lat = center.get('lat')
            lon = center.get('lon')

            # Try to match university by name or operator tag
            operator = (tags.get('operator') or '').strip()
            university = self._find_university(name, operator, universities)
            if university is None:
                skipped += 1
                continue

            addr_city = (
                tags.get('addr:city')
                or tags.get('addr:municipality')
                or university.city
                or ''
            ).strip()

            _, was_created = Campus.objects.update_or_create(
                university=university,
                name=name,
                defaults={'city': addr_city, 'lat': lat, 'lng': lon},
            )
            if was_created:
                created += 1
            else:
                updated += 1

        # Fallback: universities with no campuses get a single default campus
        fallback = 0
        for u in University.objects.all():
            if not u.campuses.exists():
                Campus.objects.get_or_create(
                    university=u,
                    name=u.name,
                    defaults={'city': u.city, 'lat': u.lat, 'lng': u.lng},
                )
                fallback += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Hecho. Creados: {created}, actualizados: {updated}, '
                f'sin match: {skipped}, fallback: {fallback}'
            )
        )

    def _fetch_overpass(self):
        url = 'https://overpass-api.de/api/interpreter'
        payload = f'data={urllib.parse.quote(OVERPASS_QUERY)}'
        req = urllib.request.Request(
            url,
            data=payload.encode(),
            headers={
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Stugether/1.0 (student housing platform; contact@stugether.com)',
            },
        )
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode())

    def _find_university(self, name, operator, universities):
        # Direct match on campus name
        key = _strip_accents(name)
        for uni_key, uni in universities.items():
            if uni_key in key or key in uni_key:
                return uni

        # Match via operator tag (e.g. "Universidad de Cádiz")
        if operator:
            op_key = _strip_accents(operator)
            for uni_key, uni in universities.items():
                if uni_key in op_key or op_key in uni_key:
                    return uni

        return None
