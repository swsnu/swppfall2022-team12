FROM python:3.9-alpine
ENV PYTHONUNBUFFERED=1
RUN apk update
RUN apk add build-base
COPY . /team12
WORKDIR /team12
RUN pip install --upgrade pip
RUN pip install -r ./requirements.txt
RUN python manage.py migrate

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]