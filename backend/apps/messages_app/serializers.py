import re
from rest_framework import serializers
from .models import Conversation, Message
from apps.users.serializers import PublicUserSerializer

PROFANITY = {
    'puta', 'puto', 'putos', 'putas',
    'coño', 'joder', 'hostia', 'hostias',
    'mierda', 'mierdas',
    'cabrón', 'cabron', 'cabrones',
    'gilipollas',
    'imbécil', 'imbecil',
    'idiota', 'idiotas',
    'maricón', 'maricon',
    'capullo', 'capullos',
    'pendejo', 'pendejos',
    'zorra', 'zorras',
    'follar',
    'cojones',
    'hijoputa', 'hijo de puta',
    'polla', 'pollas',
    'subnormal',
    'chinga', 'chingada',
}

_WORD_RE = re.compile(r'\b\w+\b', re.IGNORECASE | re.UNICODE)


def _contains_profanity(text):
    words = {w.lower() for w in _WORD_RE.findall(text)}
    # Normalise accents for comparison
    normalised = {_strip_accents(w) for w in words}
    for p in PROFANITY:
        if _strip_accents(p) in normalised or p.lower() in words:
            return True
    # Also check for multi-word entries (e.g. "hijo de puta")
    text_lower = _strip_accents(text.lower())
    for p in PROFANITY:
        if ' ' in p and _strip_accents(p) in text_lower:
            return True
    return False


def _strip_accents(s):
    return (s
        .replace('á', 'a').replace('é', 'e').replace('í', 'i')
        .replace('ó', 'o').replace('ú', 'u').replace('ü', 'u')
        .replace('ñ', 'n').replace('Á', 'a').replace('É', 'e')
        .replace('Í', 'i').replace('Ó', 'o').replace('Ú', 'u'))


class MessageSerializer(serializers.ModelSerializer):
    sender_detail = PublicUserSerializer(source='sender', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_detail', 'body', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'is_read', 'created_at']

    def validate_body(self, value):
        if not value.strip():
            raise serializers.ValidationError('El mensaje no puede estar vacío.')
        if _contains_profanity(value):
            raise serializers.ValidationError(
                'Tu mensaje contiene lenguaje inapropiado. Por favor, revísalo antes de enviarlo.'
            )
        return value


class ConversationSerializer(serializers.ModelSerializer):
    participants = PublicUserSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    other_participant = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'related_property', 'last_message', 'unread_count', 'other_participant', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_last_message(self, obj):
        msg = obj.last_message
        if msg:
            return {'body': msg.body[:80], 'created_at': msg.created_at, 'sender_id': msg.sender_id}
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if not request:
            return 0
        return obj.messages.filter(is_read=False).exclude(sender=request.user).count()

    def get_other_participant(self, obj):
        request = self.context.get('request')
        if not request:
            return None
        other = obj.participants.exclude(id=request.user.id).first()
        return PublicUserSerializer(other).data if other else None
