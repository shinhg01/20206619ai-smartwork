# Claude Code 프롬프트 — 임직원 서류 자동 완성 기능 구현

---

## 목표

회사 웹사이트(임직원 포털)에 **서류 자동 완성 다운로드 기능**을 추가한다.
직원이 웹 폼에 이름·부서·사유 등을 입력하면, 미리 만들어진 DOCX 양식 파일의
플레이스홀더(`{{이름}}`, `{{부서}}` 등)가 실제 값으로 치환된 파일을 다운로드할 수 있어야 한다.

---

## 첨부 파일 (프로젝트 루트에 함께 넣을 것)

| 파일명 | 설명 |
|---|---|
| `휴가신청서_양식.docx` | 휴가 신청서 템플릿 |
| `재직증명서_양식.docx` | 재직증명서 템플릿 |
| `지출정산신청서_양식.docx` | 지출비용 정산 신청서 템플릿 |

각 양식 파일 안에는 아래 플레이스홀더가 들어 있다:

### 휴가신청서 플레이스홀더
- `{{이름}}`, `{{부서}}`, `{{직위}}`, `{{작성일}}`
- `{{휴가종류}}`, `{{시작일}}`, `{{종료일}}`, `{{일수}}`, `{{사유}}`

### 재직증명서 플레이스홀더
- `{{이름}}`, `{{생년월일}}`, `{{부서}}`, `{{직위}}`
- `{{입사일}}`, `{{회사명}}`, `{{용도}}`, `{{작성일}}`

### 지출정산신청서 플레이스홀더
- `{{이름}}`, `{{부서}}`, `{{직위}}`, `{{신청일}}`
- `{{사용목적}}`, `{{총금액}}`, `{{비고}}`

---

## 구현 요구사항

### 1. 백엔드 API

**사용 라이브러리:** `docx-templates` (Node.js 기준) 또는 `python-docx` (Python 기준)

> 프레임워크가 정해져 있으면 그에 맞게 선택한다.
> Node.js라면 `docx-templates` 또는 `pizzip` + `docxtemplater`,
> Python이라면 `python-docx`를 사용한다.

**엔드포인트 3개 생성:**

```
POST /api/documents/leave-request
POST /api/documents/employment-certificate
POST /api/documents/expense-report
```

각 엔드포인트는:
1. 요청 body에서 필드 값을 받는다
2. 해당 양식 DOCX 파일을 읽어 플레이스홀더를 치환한다
3. 완성된 DOCX 파일을 응답으로 내려준다 (`Content-Disposition: attachment`)

**예시 요청/응답 (휴가신청서):**
```json
// 요청 body
{
  "이름": "홍길동",
  "부서": "개발팀",
  "직위": "대리",
  "휴가종류": "연차",
  "시작일": "2025-07-01",
  "종료일": "2025-07-03",
  "일수": "3",
  "사유": "개인 사정"
}
// 응답: 완성된 DOCX 파일 스트림
```

### 2. 프론트엔드 UI

기존 임직원 포털 스타일에 맞춰 다음 3개 서류의 폼 페이지를 만든다:

#### 공통 사항
- 서류 종류를 선택하면 해당 폼 필드가 표시된다
- 필수 입력 필드에 대한 유효성 검사를 추가한다
- "다운로드" 버튼 클릭 시 API 호출 후 파일이 자동으로 저장된다
- 로딩 상태(버튼 비활성화, 스피너)를 표시한다
- 에러 발생 시 안내 메시지를 표시한다

#### 휴가신청서 폼 필드
| 필드 | 타입 | 필수 | 비고 |
|---|---|---|---|
| 성명 | text | ✅ | |
| 부서 | text | ✅ | |
| 직위 | text | ✅ | |
| 휴가 종류 | select | ✅ | 연차/반차(오전)/반차(오후)/병가/경조사 휴가 |
| 시작일 | date | ✅ | |
| 종료일 | date | ✅ | 시작일 이후여야 함 |
| 일수 | number | ✅ | 0.5 단위 |
| 사유 | textarea | ✅ | |

#### 재직증명서 폼 필드
| 필드 | 타입 | 필수 | 비고 |
|---|---|---|---|
| 성명 | text | ✅ | |
| 생년월일 | date | ✅ | |
| 부서 | text | ✅ | |
| 직위 | text | ✅ | |
| 입사일 | date | ✅ | |
| 회사명 | text | ✅ | |
| 용도 | select | ✅ | 금융기관/임대차/비자/관공서/기타 |

#### 지출정산신청서 폼 필드
| 필드 | 타입 | 필수 | 비고 |
|---|---|---|---|
| 성명 | text | ✅ | |
| 부서 | text | ✅ | |
| 직위 | text | ✅ | |
| 신청일 | date | ✅ | 기본값: 오늘 날짜 |
| 사용 목적 | text | ✅ | |
| 총 금액 | number | ✅ | 원 단위, 천 단위 구분자 표시 |
| 비고 | textarea | ❌ | 선택 입력 |

### 3. 파일 저장 위치

양식 파일은 서버의 다음 경로에 저장한다:

```
/templates/
  ├── 휴가신청서_양식.docx
  ├── 재직증명서_양식.docx
  └── 지출정산신청서_양식.docx
```

---

## 추가 구현 사항 (선택)

- [ ] 작성일 필드는 서버에서 오늘 날짜를 자동으로 채워 넣는다 (`YYYY년 MM월 DD일` 형식)
- [ ] 완성된 파일명에 이름과 날짜를 포함한다 (예: `홍길동_휴가신청서_20250701.docx`)
- [ ] 관리자는 템플릿 파일을 포털에서 직접 교체할 수 있는 업로드 기능을 추가한다
- [ ] 서류 신청 이력을 DB에 기록하고 관리자가 조회할 수 있도록 한다

---

## 기술 스택 참고

현재 프로젝트의 기술 스택을 확인한 후, 아래 중 적합한 라이브러리를 선택한다:

| 환경 | 추천 라이브러리 |
|---|---|
| Node.js / Express | `docxtemplater` + `pizzip` |
| Node.js / Next.js | `docxtemplater` + `pizzip` |
| Python / Django | `python-docx` |
| Python / FastAPI | `python-docx` |

**docxtemplater 예시 (Node.js):**
```javascript
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");

function fillTemplate(templatePath, data) {
  const content = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  doc.render(data);
  return doc.getZip().generate({ type: "nodebuffer" });
}
```

**python-docx 예시 (Python):**
```python
from docx import Document
import re

def fill_template(template_path: str, data: dict) -> bytes:
    doc = Document(template_path)
    for para in doc.paragraphs:
        for key, value in data.items():
            if f"{{{{{key}}}}}" in para.text:
                for run in para.runs:
                    run.text = run.text.replace(f"{{{{{key}}}}}", str(value))
    # 표 안의 셀도 처리
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for para in cell.paragraphs:
                    for key, value in data.items():
                        if f"{{{{{key}}}}}" in para.text:
                            for run in para.runs:
                                run.text = run.text.replace(f"{{{{{key}}}}}", str(value))
    from io import BytesIO
    buf = BytesIO()
    doc.save(buf)
    return buf.getvalue()
```

---

## 시작 전 확인 사항

1. 현재 프로젝트의 프레임워크와 언어를 확인한다
2. 기존 포털의 라우팅 구조와 인증 미들웨어를 파악한다
3. 기존 UI 컴포넌트 라이브러리(있다면)를 사용해 폼을 구성한다
4. `templates/` 폴더를 생성하고 첨부된 DOCX 파일 3개를 넣는다
5. 위 요구사항을 단계별로 구현한다
