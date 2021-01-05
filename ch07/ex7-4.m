// 리스트 7.4  iOS(Object C)에서 람다 함수 호출하기

[[AWSCloudLogic sharedInstance]
invokeFunction:functionName
withParameters:parameters
withCompletionBlock:^(id result, NSError *error) {
// 호출 결과 사용
}];
