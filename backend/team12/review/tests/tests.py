from django.test import TestCase
from rest_framework import status
from review.models import Review
from course.tests.utils import CourseFactory
from user.tests.utils import UserFactory


class ReviewTestCase(TestCase):
    """
    # Test Review APIs.
        [POST] /review
        [GET] /review
        [GET] /review/:reviewId
        [DELETE] /review/:reviewId
        [PUT] /review/:reviewId
        [PUT] /review/like/:reviewId
    """

    @classmethod
    def setUpTestData(cls):
        cls.user, cls.user_token = UserFactory.create()
        cls.stranger, cls.stranger_token = UserFactory.create()
        cls.course = CourseFactory.create(nums=1, author=cls.user)[0]
        cls.course.rate = 0
        cls.course.save()
        cls.post_data = {"course": cls.course.id, "content": "test reviews", "rate": 5}
        cls.reviews = []
        for i in range(3):
            cls.reviews.append(
                Review.objects.create(
                    author=cls.user,
                    content=f"test reviews...{i}",
                    rate=5 - i,
                    course=cls.course,
                    likes=i + 3,
                )
            )

    def test_create_review(self):
        """
        Create review test case.
            1) create success.
            2) author can't create review.
            3) course not found.
            4) rate must be between 1 and 5.
            5) ['course'] fields missing.
        """
        # 1) create success.
        before_rate = self.course.rate
        response = self.client.post(
            "/api/review/",
            data=self.post_data,
            HTTP_AUTHORIZATION=self.stranger_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(data["content"], self.post_data["content"])
        self.assertEqual(data["rate"], self.post_data["rate"])
        self.course.refresh_from_db()
        self.assertNotEqual(before_rate, self.course.rate)

        # 2) author can't create review.
        response = self.client.post(
            '/api/review/',
            data=self.post_data,
            HTTP_AUTHORIZATION = self.user_token,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # 3) course not found.
        wrong_data = self.post_data.copy()
        wrong_data["course"] = 9999
        response = self.client.post(
            "/api/review/",
            data=wrong_data,
            HTTP_AUTHORIZATION=self.stranger_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # 4) rate must be between 1 and 5.
        wrong_data = self.post_data.copy()
        wrong_data["rate"] = 6
        response = self.client.post(
            "/api/review/",
            data=wrong_data,
            HTTP_AUTHORIZATION=self.stranger_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertEqual(data["detail"], "rate must be between 1 and 5.")

        # 5) ['course'] fields missing.
        response = self.client.post(
            "/api/review/",
            data={"rate": 5, "content": "test content"},
            HTTP_AUTHORIZATION=self.stranger_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()

    def test_delete_review(self):
        """
        Delete review test case.
        """
        target = self.reviews[0]
        response = self.client.delete(
            f"/api/review/{target.id}/",
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Review.objects.filter(id=target.id).exists())

    def test_retrieve_review(self):
        """
        Retrieve review test case.
        """
        target = self.reviews[0]
        response = self.client.get(
            f"/api/review/{target.id}/",
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(data["id"], target.id)
        self.assertEqual(data["likes"], target.likes)
        self.assertEqual(data["rate"], target.rate)
        self.assertEqual(data["content"], target.content)
        self.assertIn("created_at", data)

    def test_update_review(self):
        """
        Update review test case.
        """
        update_data = self.post_data.copy()
        update_data["content"] += " modified."
        update_data["rate"] = 1
        target = self.reviews[0]
        before_rate = self.course.rate
        response = self.client.put(
            f"/api/review/{target.id}/",
            data=update_data,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course.refresh_from_db()
        target.refresh_from_db()
        data = response.json()

        self.assertEqual(data["id"], target.id)
        self.assertEqual(data["likes"], target.likes)
        self.assertEqual(data["rate"], target.rate)
        self.assertNotEqual(before_rate, self.course.rate)
        self.assertEqual(data["content"], target.content)
        self.assertIn("created_at", data)

        response = self.client.put(
            f"/api/review/{target.id}/",
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_like_review(self):
        """
        Like review test case.
        """
        target = self.reviews[0]
        before_likes = target.likes
        response = self.client.get(
            f"/api/review/{target.id}/like/",
            HTTP_AUTHORIZATION=self.stranger_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        target.refresh_from_db()

        self.assertEqual(before_likes + 1, target.likes)

        response = self.client.get(
            f"/api/review/{target.id}/like/",
            HTTP_AUTHORIZATION=self.stranger_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        target.refresh_from_db()

        self.assertEqual(before_likes, target.likes)

        response = self.client.get(
            f"/api/review/{target.id}/like/",
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get(
            f"/api/review/{target.id}/like/", content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_review(self):
        """
        List review test case.
        """
        params = {"course": self.course.id}
        response = self.client.get(
            "/api/review/",
            HTTP_AUTHORIZATION=self.user_token,
            data=params,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 3)
        self.reviews.sort(key=lambda x: x.created_at, reverse=True)
        for idx, review in enumerate(data):
            self.assertEqual(review["id"], self.reviews[idx].id)

        params["filter"] = "time_asc"
        response = self.client.get(
            "/api/review/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 3)
        self.reviews.sort(key=lambda x: x.created_at)
        for idx, review in enumerate(data):
            self.assertEqual(review["id"], self.reviews[idx].id)

        params["filter"] = "time_desc"
        response = self.client.get(
            "/api/review/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 3)
        self.reviews.sort(key=lambda x: x.created_at, reverse=True)
        for idx, review in enumerate(data):
            self.assertEqual(review["id"], self.reviews[idx].id)

        params["filter"] = "rate_desc"
        response = self.client.get(
            "/api/review/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 3)
        self.reviews.sort(key=lambda x: x.rate, reverse=True)
        for idx, review in enumerate(data):
            self.assertEqual(review["id"], self.reviews[idx].id)

        params["filter"] = "rate_asc"
        response = self.client.get(
            "/api/review/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 3)
        self.reviews.sort(key=lambda x: x.rate)
        for idx, review in enumerate(data):
            self.assertEqual(review["id"], self.reviews[idx].id)

        params["filter"] = "likes"
        response = self.client.get(
            "/api/review/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 3)
        self.reviews.sort(key=lambda x: x.likes, reverse=True)
        for idx, review in enumerate(data):
            self.assertEqual(review["id"], self.reviews[idx].id)

        response = self.client.get(
            "/api/review/",
            data={},
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
