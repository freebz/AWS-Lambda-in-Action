# 리스트 13.6  name을 반환하는 app.py 파일 수정하기

from chalice import Chalice

app = Chalice(app_name='greetingsOnDemand')

@app.route('/')
def index():
    return {'hello': 'world'}

@app.route('/greet/{name}')
def hello_name(name):
    return {'hello': name}
