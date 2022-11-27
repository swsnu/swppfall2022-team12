from tag.const import TAGLIST
from tag.models import Tag

def create_tags():
    tags_created = []
    for content in TAGLIST:
        _, created = Tag.objects.get_or_create(
            content=content
        )
        if created:
            tags_created.append(content)