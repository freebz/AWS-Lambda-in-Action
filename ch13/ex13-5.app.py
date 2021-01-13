# 리스트 13.5  Chalice를 통해 만든 app.py 파일

from chalice import Chalice

app = Chalice(app_name='greetingsOnDemand')

@app.route('/')
def index():
    return {'hello': 'world'}
