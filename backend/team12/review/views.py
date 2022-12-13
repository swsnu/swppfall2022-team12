from django.db.models import F
from django.db import transaction
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404

from rest_framework import status, viewsets, generics
from rest_framework.response import Response
from rest_framework.decorators import action

from review.models import Review, ReviewLike
from review.serializers import ReviewSerializer, ReviewCreateSerializer

from course.models import *
from course.utils import reflect_rate

from team12.exceptions import FieldError, NotOwner, AnonymousError
from team12.permissions import IsOwnerOrCreateReadOnly

class ReviewViewSet(
        viewsets.GenericViewSet,
        generics.RetrieveDestroyAPIView
    ):
    """
    Generic ViewSet of Review Object.
    """
    queryset = Review.objects.all()
    permission_classes = [IsOwnerOrCreateReadOnly]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve", "like", "update"]:
            return ReviewSerializer
        elif self.action == "create":
            return ReviewCreateSerializer

    # POST /review
    @transaction.atomic
    def create(self, request):
        """Create Review"""
        data = request.data
        context = {
            'course': data.get('course'),
            'author': request.user
        }
        serializer = self.get_serializer(data=request.data, context=context)
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        reflect_rate(data['course'])
        return Response(ReviewSerializer(review).data, status=status.HTTP_200_OK)


    # DELETE /review/:reviewId
    @transaction.atomic
    def destroy(self, request, pk=None):
        """Destroy Review"""
        return super().destroy(request, pk)
    

    # GET /review/:reviewId
    def retrieve(self, request, pk=None):
        """Retrieve Review"""
        return super().retrieve(request, pk)

    
    # PUT /review/:reviewId
    def update(self, request, pk=None):
        """Update Review"""
        review = self.get_object()
        data = request.data
        if data.get('content'):
            review.content = data['content']
        if data.get('rate'):
            review.rate = data['rate']
        review.save()
        reflect_rate(review.course.id)
        return Response(self.get_serializer(review).data, status=status.HTTP_200_OK)
    

    # GET /review/?course=(int)
    # &filter=(string)
    def list(self, request):
        """List Reviews"""
        page = request.GET.get('page', '1')
        course_id = request.query_params.get("course")
        f_param = request.query_params.get("filter", False)
        if not course_id: raise FieldError("missing fields [course]")
        course = get_object_or_404(Course, id=course_id)
        reviews = course.reviews.all().order_by(F("created_at").desc())
        if f_param:
            if f_param == "likes": reviews = reviews.order_by(F("likes").desc())
            elif f_param == "time_asc": reviews = reviews.order_by(F("created_at").asc())
            elif f_param == "time_desc": reviews = reviews.order_by(F("created_at").desc())
            elif f_param == "rate_asc": reviews = reviews.order_by(F("rate").asc())
            elif f_param == "rate_desc": reviews = reviews.order_by(F("rate").desc())
        
        reviews = Paginator(reviews, 20).get_page(page)
        return Response(self.get_serializer(reviews, many=True).data, status=status.HTTP_200_OK)
    

    # PUT /review/like/:reviewId
    @transaction.atomic
    @action(methods=['GET'], detail=True)
    def like(self, request, pk=None):
        """Like Reviews"""
        review = self.get_object()
        if request.user.is_anonymous:
            raise AnonymousError()
        user = request.user
        if review.author == user:
            raise NotOwner("Author can't like the review.")
        
        if user.like_reviews.filter(review=review).exists():
            user.like_reviews.get(review=review).delete()
            review.likes -= 1
        else:
            ReviewLike.objects.create(user=user, review=review)
            review.likes += 1
        review.save()
        return Response(self.get_serializer(review).data, status=status.HTTP_200_OK)

