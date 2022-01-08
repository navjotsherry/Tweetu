from django.http.response import Http404
from Tweetu import settings
from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.utils.http import is_safe_url
import random

from Tweetu.settings import ALLOWED_HOSTS
from .forms import TweeetForm

import tweets
from .models import Tweet

from tweets import forms

from tweets import models

# Create your views here.

def home_view(request, *args,**kwargs):
    return render(request,"pages/home.html")

def tweet_create_view(request,*args,**kwargs):
    next_url = request.POST.get('next') or None
    form = TweeetForm(request.POST or None)
    if form.is_valid:
        obj = form.save(commit=False)
        obj.save()
        form = TweeetForm()
        if next_url!=None and is_safe_url(next_url,allowed_hosts=ALLOWED_HOSTS):
            return redirect(next_url)
    return render(request,'components/forms.html', context={"form":form})

def tweet_list_view(request):
    qs = Tweet.objects.all()
    tweet_list= [{"id":x.id, "content":x.content,"likes":random.randint(0,100)} for x in qs]
    data= {
        "response": tweet_list
    }
    return JsonResponse(data)


def tweet_detail_view(request,tweet_id, *args,**kwargs):
    data = {
        "id" : tweet_id,
    }
    status = 200
    try:
        obj = Tweet.objects.get(id=tweet_id)
        data['content'] = obj.content
    except:
        data['message']= 'Not Found'
        status = 404
    
    return JsonResponse(data,status = status)
