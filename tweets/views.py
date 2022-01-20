from telnetlib import STATUS
from urllib.request import Request
from django.http.response import Http404
from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.utils.http import is_safe_url
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from Tweetu.settings import ALLOWED_HOSTS
from .forms import TweeetForm

from .models import Tweet
from .serializers import TweetSerializer
from tweets import serializers


# Create your views here.

def home_view(request, *args,**kwargs):
    return render(request,"pages/home.html")

@api_view(['POST'])
def tweet_create_view(request,*args,**kwargs):
    serializer=TweetSerializer(data = request.POST)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(serializer.data,status=201)    
    return Response({},status=400)
        
@api_view(['GET'])
def tweet_list_view(request):
    qs = Tweet.objects.all()
    serializer = TweetSerializer(qs,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def tweet_detail_view(request,tweet_id, *args,**kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({},status= 404)
    obj = qs.first()
    serializer = TweetSerializer(obj)
    return Response(serializer.data)
