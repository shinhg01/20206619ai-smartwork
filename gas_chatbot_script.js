// =======================================================
// (주)비에이텍 임직원 챗봇용 Gemini API 백엔드 (Google Apps Script)
// =======================================================
// 1. https://script.google.com 에 접속하여 새 프로젝트를 생성합니다.
// 2. 아래 코드를 전체 복사하여 코드 편집기에 붙여넣습니다.
// 3. 좌측 톱니바퀴(프로젝트 설정) -> 맨 아래 "스크립트 속성" -> "스크립트 속성 추가"
//    - 속성: GEMINI_API_KEY
//    - 값: 발급받은 Gemini API 키 (https://aistudio.google.com/app/apikey)
// 4. 우측 상단 [배포] -> [새 배포] 클릭
// 5. 유형 선택: "웹 앱"
//    - 실행 권한: "나"
//    - 액세스 권한 가진 사용자: "모든 사용자(Anyone)"
// 6. [배포] 클릭 후 발급된 '웹 앱 URL'을 복사하여
//    employee.js 상단의 GAS_CHATBOT_URL 변수에 붙여넣으세요.
// =======================================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var prompt = data.prompt;

    if (!prompt) {
      return ContentService.createTextOutput(JSON.stringify({
        error: "prompt가 누락되었습니다."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      return ContentService.createTextOutput(JSON.stringify({
        error: "스크립트 속성에 GEMINI_API_KEY가 설정되지 않았습니다."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + apiKey;
    var payload = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });

    var responseCode, responseText;
    var maxRetries = 3;

    // 모델 일시 과부하(503)에 대비해 짧은 대기 후 재시도
    for (var attempt = 0; attempt < maxRetries; attempt++) {
      var response = UrlFetchApp.fetch(url, {
        method: "post",
        contentType: "application/json",
        payload: payload,
        muteHttpExceptions: true
      });

      responseCode = response.getResponseCode();
      responseText = response.getContentText();

      if (responseCode !== 503) break;

      Utilities.sleep(1500 * (attempt + 1));
    }

    var result;
    try {
      result = JSON.parse(responseText);
    } catch (parseErr) {
      return ContentService.createTextOutput(JSON.stringify({
        error: "Gemini 응답 파싱 실패",
        httpStatus: responseCode,
        rawResponse: responseText.substring(0, 500),
        apiKeyLength: apiKey.length
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (result.candidates && result.candidates[0] && result.candidates[0].content) {
      var reply = result.candidates[0].content.parts[0].text;
      return ContentService.createTextOutput(JSON.stringify({ reply: reply }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ error: result, httpStatus: responseCode }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
