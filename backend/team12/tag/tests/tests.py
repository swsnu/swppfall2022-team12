from django.test import TestCase
from rest_framework import status
from user.tests.utils import UserFactory
from tag.models import Tag
from tag.const import TAGLIST
from tag.utils import create_tags


class TagTestCase(TestCase):
    """
    # Test Tag APIs.
        [POST] /tag
        [GET] /tag
        [PUT] /tag/remove
    """

    @classmethod
    def setUpTestData(cls):
        cls.user, cls.user_token = UserFactory.create()

    def test_create_tags(self):
        """
        Create Tags test case.
        """
        post_data = {"contents": ["new-tags..1", "new-tags..2", "new-tags..3"]}
        response = self.client.post(
            "/api/tag/",
            data=post_data,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        created_tags = TAGLIST + post_data["contents"]
        self.assertFalse(Tag.objects.exclude(content__in=created_tags).exists())

        response = self.client.post(
            "/api/tag/",
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_tags(self):
        """
        List Tags test case.
        """
        create_tags()
        response = self.client.get(
            "/api/tag/",
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_remove_tags(self):
        """
        Remove Tags test case.
        """
        create_tags()
        remove_data = {
            "contents": [
                "연인과 함께",
                "부모님과 함께",
                "로맨틱한",
                "없는 테그",
            ]
        }
        response = self.client.put(
            "/api/tag/remove/",
            data=remove_data,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(
            Tag.objects.filter(content__in=remove_data["contents"]).exists()
        )

        response = self.client.put(
            "/api/tag/remove/",
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
