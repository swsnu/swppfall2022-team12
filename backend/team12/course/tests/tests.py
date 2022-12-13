from django.test import TestCase
from rest_framework import status

from course.models import *
from course.const import *
from course.tests.utils import CourseFactory
from course.tests.const import TEST_IMAGE

from user.tests.utils import UserFactory


class CourseTestCase(TestCase):
    """
    # Test Course APIs.
        [POST] /course
        [GET] /course
        [GET] /course/:courseId
        [PUT] /course/:courseId/play
        [PUT] /course/:courseId
        [DELETE] /course/:courseId
    """

    @classmethod
    def setUpTestData(cls):
        cls.user, cls.user_token = UserFactory.create()
        cls.stranger, cls.stranger_token = UserFactory.create()
        cls.post_data = {
            "title": "test title.",
            "description": "test description.",
            "e_time": 210,
            "distance": 3.2,
            "tags": [1, 3, 4, 5],
            "path": [
                {"lat": 37.408363969648015, "lng": 127.11902659769227},
                {"lat": 37.408363969648015, "lng": 127.11902659769227},
            ],
            "markers": [
                {
                    "content": "[0] 출발지",
                    "image": TEST_IMAGE,
                    "position": {"lat": 37.40268656668587, "lng": 127.10325874620656},
                },
                {
                    "content": "[0] name01",
                    "image": TEST_IMAGE,
                    "position": {"lat": 37.40268656668587, "lng": 127.10325874620656},
                },
                {
                    "content": "[0] 도착지",
                    "image": TEST_IMAGE,
                    "position": {"lat": 37.40268656668587, "lng": 127.10325874620656},
                },
            ],
        }

        cls.courses = CourseFactory.create(nums=3, author=cls.user)
        cls.walk_courses = CourseFactory.create(nums=3, category=WALK, author=cls.user)

    def test_create_course(self):
        """
        Create course test case.
        """
        response = self.client.post(
            "/api/course/",
            data=self.post_data,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertIn("id", data)
        self.assertEqual(data["author"], self.user.username)
        self.assertEqual(data["p_counts"], 3)
        self.assertEqual(data["title"], self.post_data["title"])
        self.assertEqual(data["description"], self.post_data["description"])
        self.assertIn("created_at", data)
        self.assertEqual(data["u_counts"], 0)
        self.assertEqual(data["e_time"], self.post_data["e_time"])
        self.assertEqual(data["distance"], self.post_data["distance"])
        self.assertEqual(data["rate"], 0)
        self.assertSetEqual(
            set(data["tags"]),
            set(
                Tag.objects.filter(id__in=self.post_data["tags"]).values_list(
                    "content", flat=True
                )
            ),
        )
        for idx, path in enumerate(self.post_data["path"]):
            self.assertEqual(data["path"][idx]["lat"], path["lat"])
            self.assertEqual(data["path"][idx]["lng"], path["lng"])
        for idx, marker in enumerate(self.post_data["markers"]):
            self.assertEqual(data["markers"][idx]["content"], marker["content"])
            self.assertEqual(data["markers"][idx]["image"], marker["image"])
            self.assertEqual(
                data["markers"][idx]["position"]["lat"], marker["position"]["lat"]
            )
            self.assertEqual(
                data["markers"][idx]["position"]["lng"], marker["position"]["lng"]
            )

    def test_create_course_errors(self):
        """
        Create course error cases.
            1) description should be more than 10 characters.
            2) markers should be more than 2.
            3) ['title', 'description', 'e_time', 'distance', 'markers', 'path'] fields missing.
        """
        wrong_data = self.post_data.copy()
        wrong_data["description"] = "short"
        response = self.client.post(
            "/api/course/",
            HTTP_AUTHORIZATION=self.user_token,
            data=wrong_data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertEqual(
            data["detail"], "description should be more than 10 characters."
        )

        wrong_data = self.post_data.copy()
        wrong_data["markers"] = wrong_data["markers"][:1]
        response = self.client.post(
            "/api/course/",
            data=wrong_data,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertEqual(data["detail"], "markers should be more than 2.")

        response = self.client.post(
            "/api/course/",
            data={},
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertEqual(
            data["detail"],
            "['title', 'description', 'e_time', 'distance', 'markers', 'path'] fields missing.",
        )

    def test_retrieve_course(self):
        """
        Retrieve course test case.
        """
        target = self.courses[0]
        response = self.client.get(
            f"/api/course/{target.id}/",
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(data["id"], target.id)
        self.assertEqual(data["author"], self.user.username)
        self.assertEqual(data["p_counts"], 3)
        self.assertEqual(data["title"], target.title)
        self.assertEqual(data["description"], target.description)
        self.assertEqual(
            data["created_at"], target.created_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        )
        self.assertEqual(data["u_counts"], target.u_counts)
        self.assertEqual(data["e_time"], target.e_time)
        self.assertEqual(data["rate"], target.rate)
        self.assertEqual(data["distance"], target.distance)
        self.assertSetEqual(
            set(data["tags"]), set(target.tags.values_list("content", flat=True))
        )
        for idx, path in list(
            enumerate(target.points.filter(category=PATH).order_by("idx"))
        ):
            self.assertEqual(data["path"][idx]["lat"], float(path.latitude))
            self.assertEqual(data["path"][idx]["lng"], float(path.longitude))
        for idx, marker in list(
            enumerate(target.points.filter(category=MARKER).order_by("idx"))
        ):
            self.assertEqual(data["markers"][idx]["content"], marker.name)
            self.assertEqual(data["markers"][idx]["image"], marker.image)
            self.assertEqual(
                data["markers"][idx]["position"]["lat"], float(marker.latitude)
            )
            self.assertEqual(
                data["markers"][idx]["position"]["lng"], float(marker.longitude)
            )

    def test_delete_course(self):
        """
        Delete course test case.
        """
        target = self.courses[0]
        response = self.client.delete(
            f"/api/course/{target.id}/",
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(False, Course.objects.filter(id=target.id).exists())

    def test_play_course(self):
        """
        Play course test case.
        """
        target = self.courses[0]
        before_counts = target.u_counts
        response = self.client.get(
            f"/api/course/{target.id}/play/",
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        target.refresh_from_db()
        self.assertEqual(before_counts + 1, target.u_counts)

    def test_list_course(self):
        """
        List courses test case.
        """
        response = self.client.get(
            "/api/course/",
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 3)

        self.courses.sort(key=lambda x: x.created_at, reverse=True)

        for idx, course in enumerate(data):
            self.assertEqual(course["id"], self.courses[idx].id)

        params = {"category": WALK}
        response = self.client.get(
            "/api/course/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 3)

        self.walk_courses.sort(key=lambda x: x.created_at, reverse=True)

        for idx, course in enumerate(data):
            self.assertEqual(course["id"], self.walk_courses[idx].id)

        params = {"search_keyword": "title...1"}
        response = self.client.get(
            "/api/course/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 1)
        self.assertIn("title...1", data[0]["title"])

        params = {"search_keyword": "description...1"}
        response = self.client.get(
            "/api/course/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 1)
        self.assertIn("description...1", data[0]["description"])

        params = {"filter": "use"}
        response = self.client.get(
            "/api/course/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.courses.sort(key=lambda x: x.u_counts, reverse=True)

        for idx, course in enumerate(data):
            self.assertEqual(course["id"], self.courses[idx].id)

        params = {"filter": "time_asc"}
        response = self.client.get(
            "/api/course/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.courses.sort(key=lambda x: x.e_time)

        for idx, course in enumerate(data):
            self.assertEqual(course["id"], self.courses[idx].id)

        params = {"filter": "time_desc"}
        response = self.client.get(
            "/api/course/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.courses.sort(key=lambda x: x.e_time, reverse=True)

        for idx, course in enumerate(data):
            self.assertEqual(course["id"], self.courses[idx].id)

        params = {"filter": "distance_asc"}
        response = self.client.get(
            "/api/course/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.courses.sort(key=lambda x: x.distance)

        for idx, course in enumerate(data):
            self.assertEqual(course["id"], self.courses[idx].id)

        params = {"filter": "distance_desc"}
        response = self.client.get(
            "/api/course/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.courses.sort(key=lambda x: x.distance, reverse=True)

        for idx, course in enumerate(data):
            self.assertEqual(course["id"], self.courses[idx].id)

        target = self.courses[0]
        target_tags = list(target.tags.values_list("id", flat=True))
        params = {"tags": target_tags}
        response = self.client.get(
            "/api/course/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        for course in data:
            self.assertTrue(
                set(
                    Course.objects.get(id=course["id"]).tags.values_list(
                        "id", flat=True
                    )
                )
                & set(target_tags)
            )

        params = {"history": "true"}

        response = self.client.get(
            "/api/course/",
            data=params,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 3)

        self.courses.sort(key=lambda x: x.created_at, reverse=True)

        for idx, course in enumerate(data):
            self.assertEqual(course["id"], self.courses[idx].id)

    def test_update_course(self):
        """
        Update courses test case.
        """
        target = self.courses[0]
        update_data = {
            "title": "modified title",
            "description": "modified_description",
            "distance": 200,
            "e_time": 600,
            "path": [
                {"lat": 37.408363969648015, "lng": 127.11902659769227},
                {"lat": 37.408363969648015, "lng": 127.11902659769227},
            ],
            "markers": [
                {
                    "content": "[0] 출발지 modified",
                    "position": {"lat": 37.40268656668587, "lng": 127.10325874620656},
                },
                {
                    "content": "[0] 경유지 1",
                    "image": TEST_IMAGE,
                    "position": {"lat": 37.40268656668587, "lng": 127.10325874620656},
                },
                {
                    "content": "[0] 경유지 2",
                    "image": TEST_IMAGE,
                    "position": {"lat": 37.40268656668587, "lng": 127.10325874620656},
                },
                {
                    "content": "[0] 도착지 modified",
                    "image": TEST_IMAGE,
                    "position": {"lat": 37.40268656668587, "lng": 127.10325874620656},
                },
            ],
            "tags": [1, 2, 3],
        }
        response = self.client.put(
            f"/api/course/{target.id}/",
            data=update_data,
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(data["id"], target.id)
        self.assertEqual(data["author"], self.user.username)
        self.assertEqual(data["p_counts"], 4)
        self.assertEqual(data["title"], update_data["title"])
        self.assertEqual(data["description"], update_data["description"])
        self.assertEqual(data["u_counts"], target.u_counts)
        self.assertEqual(data["e_time"], update_data["e_time"])
        self.assertEqual(data["rate"], target.rate)
        self.assertEqual(data["distance"], update_data["distance"])
        self.assertSetEqual(
            set(data["tags"]),
            set(
                Tag.objects.filter(id__in=update_data["tags"]).values_list(
                    "content", flat=True
                )
            ),
        )
        for idx, path in enumerate(update_data["path"]):
            self.assertEqual(data["path"][idx]["lat"], path["lat"])
            self.assertEqual(data["path"][idx]["lng"], path["lng"])
        for idx, marker in enumerate(update_data["markers"]):
            self.assertEqual(data["markers"][idx]["content"], marker["content"])
            self.assertEqual(
                data["markers"][idx]["position"]["lat"], marker["position"]["lat"]
            )
            self.assertEqual(
                data["markers"][idx]["position"]["lng"], marker["position"]["lng"]
            )

        response = self.client.put(
            f"/api/course/{target.id}/",
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
