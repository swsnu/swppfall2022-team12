from django.test import TestCase
from rest_framework import status
from course.models import *
from course.const import *
from course.tests.utils import CourseFactory


class CourseTestCase(TestCase):
    """
    # Test Course APIs.
        [POST] /course
        [GET] /course
        [GET] /course/:courseId
        [DELETE] /course/:courseId
    """

    @classmethod
    def setUpTestData(cls):
        cls.post_data = {
            "title":"test title.",
            "description":"test description.",
            "e_time":"01:30",
            "distance":2,
            "path":[
                {
                    "lat": 37.408363969648015,
                    "lng": 127.11902659769227
                },
                {
                    "lat": 37.408363969648015,
                    "lng": 127.11902659769227
                }
            ],
            "markers":[
                {
                    "content":"[0] 출발지",
                    "image":"https://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
                    "position":{
                        "lat": 37.40268656668587,
                        "lng": 127.10325874620656
                    }
                },
                {
                    "content":"[0] name01",
                    "image":"https://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
                    "position":{
                        "lat": 37.40268656668587,
                        "lng": 127.10325874620656
                    }
                },
                {
                    "content":"[0] 도착지",
                    "image":"https://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
                    "position":{
                        "lat": 37.40268656668587,
                        "lng": 127.10325874620656
                    }
                }
            ]
        }

        cls.courses = CourseFactory.create(nums=3)
        cls.walk_courses = CourseFactory.create(nums=3, category=WALK)


    def test_create_course(self):
        """
        Create course test case.
        """
        response = self.client.post(
            '/course/', 
            data=self.post_data, 
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertIn("id", data)
        self.assertEqual(data["p_counts"], 3)
        self.assertEqual(data["title"], self.post_data["title"])
        self.assertEqual(data["description"], self.post_data["description"])
        self.assertIn("created_at", data)
        self.assertEqual(data["u_counts"], 0)
        self.assertEqual(data["e_time"], self.post_data["e_time"])
        self.assertEqual(data["distance"], self.post_data["distance"])
        for idx, path in enumerate(self.post_data['path']):
            self.assertEqual(data['path'][idx]['lat'], str(path['lat']))
            self.assertEqual(data['path'][idx]['lng'], str(path['lng']))
        for idx, marker in enumerate(self.post_data['markers']):
            self.assertEqual(data['markers'][idx]['content'], marker['content'])
            self.assertEqual(data['markers'][idx]['image'], marker['image'])
            self.assertEqual(data['markers'][idx]['position']['lat'], str(marker['position']['lat']))
            self.assertEqual(data['markers'][idx]['position']['lng'], str(marker['position']['lng']))


    def test_create_course_errors(self):
        """
        Create course error cases.
            1) description should be more than 10 characters.
            2) Time has wrong format.
            3) markers should be more than 2.
            4) markers keys must have 'content', 'image', 'position['lat' or 'lng']'.
            5) ['title', 'description', 'e_time', 'distance', 'markers', 'path'] fields missing.
        """
        wrong_data = self.post_data.copy()
        wrong_data['description'] = "short"
        response = self.client.post(
            '/course/', 
            data=wrong_data, 
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertEqual(data['detail'], "description should be more than 10 characters.")

        wrong_data = self.post_data.copy()
        wrong_data['e_time'] = "01-30"
        response = self.client.post(
            '/course/', 
            data=wrong_data, 
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertEqual(data['e_time'], ['Time has wrong format. Use one of these formats instead: hh:mm[:ss[.uuuuuu]].'])

        wrong_data = self.post_data.copy()
        wrong_data['markers'][2].pop('position')
        response = self.client.post(
            '/course/', 
            data=wrong_data, 
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertEqual(data['detail'], "markers keys must have 'content', 'image', 'position['lat' or 'lng']'.")

        wrong_data['markers'] = wrong_data['markers'][:1]
        response = self.client.post(
            '/course/', 
            data=wrong_data, 
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertEqual(data['detail'], "markers should be more than 2.")

        response = self.client.post(
            '/course/', 
            data={}, 
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertEqual(data['detail'], "['title', 'description', 'e_time', 'distance', 'markers', 'path'] fields missing.")


    def test_retrieve_course(self):
        """
        Retrieve course test case.
        """
        target = self.courses[0]
        response = self.client.get(
            f'/course/{target.id}/', 
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(data["id"], target.id)
        self.assertEqual(data["p_counts"], 3)
        self.assertEqual(data["title"], target.title)
        self.assertEqual(data["description"], target.description)
        self.assertEqual(data["created_at"], target.created_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ"))
        self.assertEqual(data["u_counts"], target.u_counts)
        self.assertEqual(data["e_time"], target.e_time)
        self.assertEqual(str(data["distance"]), target.distance)
        for idx, path in list(enumerate(target.points.filter(category=PATH).order_by('idx'))):
            self.assertEqual(data['path'][idx]['lat'], path.latitude)
            self.assertEqual(data['path'][idx]['lng'], path.longitude)
        for idx, marker in list(enumerate(target.points.filter(category=MARKER).order_by('idx'))):
            self.assertEqual(data['markers'][idx]['content'], marker.name)
            self.assertEqual(data['markers'][idx]['image'], marker.image)
            self.assertEqual(data['markers'][idx]['position']['lat'], marker.latitude)
            self.assertEqual(data['markers'][idx]['position']['lng'], marker.longitude)


    def test_delete_course(self):
        """
        Delete course test case.
        """
        target = self.courses[0]
        response = self.client.delete(
            f'/course/{target.id}/', 
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(False, Course.objects.filter(id=target.id).exists())


    def test_play_course(self):
        """
        Play course test case.
        """
        target = self.courses[0]
        before_counts = target.u_counts
        response = self.client.put(
            f'/course/{target.id}/play/', 
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        target.refresh_from_db()
        self.assertEqual(before_counts+1, target.u_counts)

    
    def test_list_course(self):
        """
        List courses test case.
        """
        response = self.client.get(
            '/course/', 
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 3)

        self.courses.sort(key=lambda x: x.created_at, reverse=True)

        for idx, course in enumerate(data):
            self.assertEqual(course['id'], self.courses[idx].id)

        params = {
            'category': WALK
        }
        response = self.client.get(
            '/course/', 
            data=params,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 3)

        self.walk_courses.sort(key=lambda x: x.created_at, reverse=True)

        for idx, course in enumerate(data):
            self.assertEqual(course['id'], self.walk_courses[idx].id)

        params = {
            'search_keyword': "title...1"
        }
        response = self.client.get(
            '/course/', 
            data=params,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 1)
        self.assertIn("title...1", data[0]['title'])

        params = {
            'search_keyword': "description...1"
        }
        response = self.client.get(
            '/course/', 
            data=params,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 1)
        self.assertIn("description...1", data[0]['description'])

        params = {
            'filter': 'use'
        }
        response = self.client.get(
            '/course/', 
            data=params,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.courses.sort(key=lambda x: x.u_counts, reverse=True)

        for idx, course in enumerate(data):
            self.assertEqual(course['id'], self.courses[idx].id)

        params = {
            'filter': 'time_asc'
        }
        response = self.client.get(
            '/course/', 
            data=params,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.courses.sort(key=lambda x: x.e_time)

        for idx, course in enumerate(data):
            self.assertEqual(course['id'], self.courses[idx].id)

        params = {
            'filter': 'time_desc'
        }
        response = self.client.get(
            '/course/', 
            data=params,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.courses.sort(key=lambda x: x.e_time, reverse=True)

        for idx, course in enumerate(data):
            self.assertEqual(course['id'], self.courses[idx].id)

        params = {
            'filter': 'distance_asc'
        }
        response = self.client.get(
            '/course/', 
            data=params,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.courses.sort(key=lambda x: x.distance)

        for idx, course in enumerate(data):
            self.assertEqual(course['id'], self.courses[idx].id)

        params = {
            'filter': 'distance_desc'
        }
        response = self.client.get(
            '/course/', 
            data=params,
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.courses.sort(key=lambda x: x.distance, reverse=True)

        for idx, course in enumerate(data):
            self.assertEqual(course['id'], self.courses[idx].id)