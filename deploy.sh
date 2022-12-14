git pull origin main
cd backend/team12
pip3 install -r requirements.txt
sudo systemctl restart nginx
gunicorn team12.wsgi --bind 0.0.0.0:8000 --daemon