# 리스트 14.3  updateFnctioncode(파이썬)

awslambda = boto3.client('lambda')

response = awslambda.update_function_code(
    FunctionName='anotherGreetingsOnDemand',
    S3Bucket='danilop-functions',
    S3Key='code/greetingsOnDemand-v2.zip',
    Publish=True
);
