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

// CORS preflight(OPTIONS) 요청 처리
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

// GET 요청으로 사용 가능한 모델 목록 조회 (진단용)
// 브라우저에서 GAS URL을 그냥 열면 이 함수가 실행됨
function doGet(e) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    return ContentService.createTextOutput(JSON.stringify({ error: "GEMINI_API_KEY 미설정" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  try {
    var resp = UrlFetchApp.fetch(
      "https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey,
      { muteHttpExceptions: true }
    );
    var data = JSON.parse(resp.getContentText());
    var names = (data.models || [])
      .filter(function(m) { return m.supportedGenerationMethods && m.supportedGenerationMethods.indexOf('generateContent') !== -1; })
      .map(function(m) { return m.name; });
    return ContentService.createTextOutput(JSON.stringify({ available: names }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    return ContentService.createTextOutput(JSON.stringify({ error: e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

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

    // 사용 가능한 모델을 순서대로 시도 (과부하 시 다음 모델로 자동 전환)
    // ListModels API로 이 키에서 generateContent 지원 확인된 모델만 포함
    var models = [
      'gemini-2.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-2.0-flash-lite',
      'gemini-2.0-flash',
      'gemini-flash-latest',
      'gemini-3.1-flash-lite',
      'gemini-3-flash-preview',
      'gemini-2.5-flash'
    ];

    var responseCode, responseText, result;

    for (var m = 0; m < models.length; m++) {
      var url = "https://generativelanguage.googleapis.com/v1beta/models/" + models[m] + ":generateContent?key=" + apiKey;
      var payload = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });

      // 각 모델당 최대 2회 시도 (타임아웃 방지)
      var ok = false;
      for (var attempt = 0; attempt < 2; attempt++) {
        var response = UrlFetchApp.fetch(url, {
          method: "post",
          contentType: "application/json",
          payload: payload,
          muteHttpExceptions: true
        });

        responseCode = response.getResponseCode();
        responseText = response.getContentText();

        if (responseCode === 503 || responseCode === 429) {
          Utilities.sleep(1500);
          continue; // 같은 모델 재시도
        }
        if (responseCode === 404) {
          break; // 모델 없음 → 다음 모델로 (ok=false 유지)
        }

        ok = true; // 200 또는 4xx(400/401 등) → 진짜 응답 받음
        break;
      }

      if (ok) break; // 유효한 응답을 받은 경우에만 외부 루프 종료
    }

    try {
      result = JSON.parse(responseText);
    } catch (parseErr) {
      return ContentService.createTextOutput(JSON.stringify({
        error: "Gemini 응답 파싱 실패",
        httpStatus: responseCode,
        rawResponse: responseText.substring(0, 500)
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (result.candidates && result.candidates[0] && result.candidates[0].content) {
      var reply = result.candidates[0].content.parts[0].text;
      return ContentService.createTextOutput(JSON.stringify({ reply: reply }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var isBusy = (responseCode === 503 || responseCode === 429);
    return ContentService.createTextOutput(JSON.stringify({
      error: result,
      httpStatus: responseCode,
      busy: isBusy
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
