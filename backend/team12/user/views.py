from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from user.models import User
import json

# Create your views here.
def signup(request):
  if request.method == 'POST':
    username = request.POST["username"]
    password = request.POST["password"]

    new_user = User.objects.create_user(username, password)
    new_user.save()

    return HttpResponse(json.dumps({ 'id': new_user.id, 'username': new_user.username }), status=201)
  else:
    return HttpResponseNotAllowed(['POST'])

def signin(request):
  if request.method == 'POST':
    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request, username, password)

    if user is not None:
      login(request, user)
      return HttpResponse(json.dumps({ 'id': user.id, 'username': user.username }), status=204)
    else:
        return HttpResponse(status=401)

  else:
      return HttpResponseNotAllowed(['POST'])

def logout(request):
  if request.method == 'GET':
    if request.user.is_authenticated:
      logout(request)
      return HttpResponse(status=204)
    else:
      return HttpResponse(status=401)

  else:
    return HttpResponseNotAllowed(['GET'])
