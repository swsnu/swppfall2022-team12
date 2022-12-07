from django.test import TestCase
from rest_framework import status
from course.tests.utils import CourseFactory, make_history
from user.tests.utils import UserFactory
from tag.models import Tag
from datetime import datetime, timedelta


class UserTestCase(TestCase):
    """
    # Test User APIs.
        [POST] /user/signup
        [PUT] /user/login
        [GET] /user/logout
        [GET] /user/recommend
        [PUT] /user/
    """

    @classmethod
    def setUpTestData(cls):
        cls.user, cls.user_token = UserFactory.create(ages=20, gender='M')


    def test_signup(self):
        """
        Signup test case.
        """
        signup_data = {
            "email": "testuser@test.com",
            "username": "testuser",
            "password": "12345678",
            "birth": "1997-02-03",
            "gender": "male"
        }
        response = self.client.post(
            '/api/user/signup/', 
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
            '/api/user/login/', 
            data=login_data,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(data["email"], self.user.email)
        self.assertEqual(data["username"], self.user.username)
        self.assertIn("access", data["token"].keys())
        self.assertIn("refresh", data["token"].keys())
        self.assertSetEqual(set(data["tags"]), set(self.user.tags.values_list("id", flat=True)))

        login_data = {
            "email": "wrongemail@test.com",
            "password": "12345678"
        }
        response = self.client.put(
            '/api/user/login/', 
            data=login_data,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertEqual(data['detail'], '아이디 또는 비밀번호를 확인해주세요.')

    def test_logout(self):
        """
        Logout test case.
        """
        response = self.client.get(
            '/api/user/logout/', 
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_tags_user(self):
        """
        Tags User test case.
        """
        data = {
            "tags": [1, 2, 3, 4, 5]
        }
        response = self.client.put(
            '/api/user/tags/', 
            HTTP_AUTHORIZATION=self.user_token,
            data=data,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        for tag_id in data['tags']:
            self.assertTrue(self.user.tags.filter(id=tag_id).exists())

    def test_recommend(self):
        """
        Recommend test case.
        """
        user_tags = list(self.user.tags.values_list("id", flat=True))
        courses = CourseFactory.create(nums=3, author=self.user, tags=user_tags)
        histories = []
        cnt = 3
        for course in courses:
            histories.extend(
                    [make_history(
                        self.user, 
                        course, 
                        (datetime.now()-timedelta(hours=cnt-1)).hour)\
                             for i in range(cnt)])
            cnt-=1

        response = self.client.get(
            '/api/user/recommend/', 
            HTTP_AUTHORIZATION=self.user_token,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        for tag in data:
            if tag['tag'] != "recommend":
                self.assertIn(Tag.objects.get(content=tag['tag']).id, user_tags)
                self.assertEqual(len(tag['courses']), 3)
            else:
                for i, c in enumerate(tag['courses']):
                    self.assertEqual(courses[i].id, c['id'])



    