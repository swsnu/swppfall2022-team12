from tag.models import Tag
from tag.utils import create_tags
from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

class TagViewSet(viewsets.GenericViewSet):
    """
    Generic ViewSet of Tag Object.
    """
    queryset = Tag.objects.all()
    permission_classes = []

    # POST /tag
    @transaction.atomic
    def create(self, request):
        """Create Tag"""
        tags_created = create_tags()
        contents = request.data.get("contents")
        if contents:
            for content in contents:
                _, created = Tag.objects.get_or_create(
                    content=content
                )
                if created:
                    tags_created.append(content)
        new_tags = " | ".join(tags_created)
        return Response(f"{new_tags} created.", status=status.HTTP_201_CREATED)

    # GET /tag/
    def list(self, request):
        """List Tags"""
        return Response(Tag.objects.all().values(), status=status.HTTP_200_OK)
    
    # PUT /tag/remove/
    @transaction.atomic
    @action(methods=['PUT'], detail=False)
    def remove(self, request):
        """Remove Tags"""
        contents = request.data.get("contents")
        removed_tags = []
        if contents:
            for content in contents:
                try:
                    tag = Tag.objects.get(content=content)
                    removed_tags.append(content)
                    tag.delete()
                except Tag.DoesNotExist:
                    pass
        resp = ' | '.join(removed_tags)
        return Response(f"{resp} removed.", status=status.HTTP_200_OK)
    
