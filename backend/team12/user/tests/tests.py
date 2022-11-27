from django.test import TestCase
from rest_framework import status
from user.models import User
from course.tests.utils import CourseFactory
from user.tests.utils import UserFactory


class UserTestCase(TestCase):
    """
    # Test User APIs.
        [POST] /user/signup
        [PUT] /user/login
        [GET] /user/logout
        [GET] /user/recommend
    """

    @classmethod
    def setUpTestData(cls):
        cls.user, cls.user_token = UserFactory.create()
        #cls.courses = CourseFactory.create(nums=3)


    def test_signup(self):
        """
        Signup test case.
        """
        signup_data = {
            "email": "testuser@test.com",
            "username": "testuser",
            "password": "12345678",
        }
        response = self.client.post(
            '/user/signup/', 
            data=signup_data,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()

        self.assertEqual(data["email"], signup_data['email'])
        self.assertEqual(data["username"], signup_data['username'])
        self.assertIn("access", data["token"].keys())
        self.assertIn("refresh", data["token"].keys())
        self.assertEqual(data["tags"], [])

    def test_login(self):
        """
        Login test case.
        """
        login_data = {
            "email": self.user.email,
            "password": "12345678"
        }
        response = self.client.put(
            '/user/login/', 
            data=login_data,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(data["email"], self.user.email)
        self.assertEqual(data["username"], self.user.username)
        self.assertIn("access", data["token"].keys())
        self.assertIn("refresh", data["token"].keys())
        self.assertSetEqual(set(data["tags"]), set(self.user.tags.values_list("content", flat=True)))

    def test_logout(self):
        """
        Logout test case.
        """
        response = self.client.get(
            '/user/logout/', 
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # def test_recommend(self):
    #     """
    #     Recommend test case.
    #     """
    #     cls.courses = CourseFactory.create(nums=3, author=cls.user)

    