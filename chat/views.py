from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import openai
import json
# Create your views here.

def chat(request):
    template = loader.get_template("chat.html")
    return HttpResponse(template.render())



def response(request):
    # print(json.loads(request.body))
    # print(request.POST.get("context"))
    question = json.loads(request.body)
    return HttpResponse(chat_create_response(question))



def chat_create_response(question):
    openai.api_key = "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"
    if question["context"] is None:
        question["context"] = ''
    response = openai.Completion.create(
    model="text-davinci-003",
    prompt=f'{question["context"]} {question["prompt"]}',
    temperature=float(question["temperature"]),
    max_tokens=1000,
    top_p=1,
    frequency_penalty=0.0,
    presence_penalty=0.6
    )
    print(response)
    return response["choices"][0]["text"]
