// 리스트 7.6  안드로이드에서 람다 함수 호출하기

final InvokeRequest invokeRequest =
    new Invokerequest()
        .withFunctionName(functionName)
        .withInvocationType(InvocationType.RequestResponse)
        .withPayload(payload);
final InvokeResult invokeResult =
    AWSMobileClient
        .defaultMobileClient()
        .getCloudFunctionClient()
        .invoke(invokeRequest);
// 호출 결과 사용
