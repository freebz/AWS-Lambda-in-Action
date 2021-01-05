// 리스트 7.5  iOS(Swift)에서 람다 함수 호출하기

AWSCloudLogic.defaultCloudLogic().invokeFunction(functionName,
    withParameters: parameters, completionBlock: {(result: AnyObject?, error:
     NSError?) -> Void in
        if let result = result {
// 호출 결과 사용
        }
	if let error = error {
// 호출 오류 관리
        }
})
