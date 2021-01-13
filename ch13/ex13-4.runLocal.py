# -*- encoding: utf-8 -*-
# 리스트 13.4  runLocal(파이썬)

import importlib

mod = importlib.import_module('greetingsOnDemand')

functionHandler = 'lambda_handler'
lambdaFunction = getattr(mod, functionHandler)

event = { 'name' : 'Danilo' }
context = {}

try:
    data = lambdaFunction(event, context)
    print data
except Exception as error:
    print error
