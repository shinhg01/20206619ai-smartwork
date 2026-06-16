// =======================================================
// (주)비에이텍 자동 메일 발송용 Google Apps Script
// =======================================================
// 1. https://script.google.com 에 접속하여 새 프로젝트를 생성합니다.
// 2. 아래 코드를 전체 복사하여 코드 편집기에 붙여넣습니다.
// 3. 우측 상단의 [배포] -> [새 배포] 를 클릭합니다.
// 4. 유형 선택: "웹 앱" (톱니바퀴 아이콘)
// 5. 다음 항목을 설정합니다:
//    - 실행 권한: "나" (사용자 본인의 구글 계정으로 메일 발송)
//    - 액세스 권한가진 사용자: "모든 사용자" (또는 Anyone)
// 6. [배포] 클릭 후 접근 권한을 허용해 주면 '웹 앱 URL'이 발급됩니다.
// 7. 발급받은 URL을 복사하여 script.js 파일의 GAS_WEB_APP_URL 변수에 붙여넣으세요.
// =======================================================

function doPost(e) {
  // CORS 처리 (외부 웹사이트에서 안전하게 호출 가능하도록 설정)
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    // 프론트엔드(script.js)에서 보낸 데이터 파싱
    var data = JSON.parse(e.postData.contents);
    var to_email = data.to_email;
    var subject = data.subject || "[(주)비에이텍] 문의에 대한 답변입니다.";
    var html_body = data.html_body;

    // 필수 정보 검증
    if (!to_email || !html_body) {
      return ContentService.createTextOutput(JSON.stringify({
        "status": "error",
        "message": "수신자 이메일(to_email) 또는 메일 본문(html_body)이 누락되었습니다."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // MailApp을 사용하여 HTML 이메일 자동 발송 (구글 계정 연동)
    MailApp.sendEmail({
      to: to_email,
      subject: subject,
      htmlBody: html_body,
      name: "(주)비에이텍 고객지원팀" // 수신자에게 보여질 발신자 이름
    });

    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": "메일이 성공적으로 발송되었습니다."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": "메일 발송 중 오류가 발생했습니다: " + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// OPTIONS 요청에 대한 응답 (브라우저의 CORS Preflight 통과용)
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  return ContentService.createTextOutput("").setHeaders(headers);
}
