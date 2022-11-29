
from factory.django import DjangoModelFactory
from user.models import User
from faker import Faker
from random import randint, shuffle, choice
from django.test import Client
from tag.models import Tag
from tag.utils import create_tags

test_tags = [2, 3, 4, 5, 6]

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
    client = Client()
    idx = 0

    @classmethod
    def create(self, **kwargs):
        create_tags()
        fake = Faker("ko_KR")
        data = {
            "email": kwargs.get("email", f"test{self.idx}@test.com"),
            "password": kwargs.get("password", "12345678"),
            "username": kwargs.get("username", fake.name()),
            "ages": kwargs.get("ages", choice([10, 20, 30, 40, 50])),
            "gender": kwargs.get("gender", choice(["male", "female"]))
        }
        user = User.objects.create_user(**data)
        self.idx+=1
        shuffle(test_tags)
        user.tags.set(Tag.objects.filter(id__in=test_tags[:randint(1, 5)]))
        response = self.client.put(
            '/user/login/', 
            data={"email": user.email, "password": kwargs.get("password", "12345678")}, 
            content_type="application/json").json()
        return (user, f"Bearer {response['token']['access']}")

        