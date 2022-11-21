from django.db import models
from course.models import Course
from user.models import User


class Review(models.Model):
    """
    Review Model

        # Fields
        author (User): author of Review.
        course (Course): course where review exists.
        rate (int): rate of course. (1 ~ 5)
        content (str): contents of review.
        likes (int): likes of review.
        created_at (DateTime): Review's created at time.
    """
    id = models.AutoField(primary_key=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    rate = models.PositiveSmallIntegerField()
    content = models.CharField(max_length=200, blank=True)
    likes = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class ReviewLike(models.Model):
    """
    Review Model
    : Relation model between user and review. Created if user likes review. 

        # Fields
        user (User): user who likes review.
        review (Review): review.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="like_reviews")
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name="like_users")
