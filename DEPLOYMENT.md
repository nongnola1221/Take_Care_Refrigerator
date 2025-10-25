# 백엔드 & 프론트엔드 배포 안내서

이 문서는 '냉장고 요리사' 애플리케이션의 백엔드와 프론트엔드를 무료로, 항상 실행되도록 배포하는 방법을 안내합니다.

## Part 1: 백엔드 배포 (Render.com 사용)

Render는 GitHub 저장소와 연동하여 Node.js 서버와 PostgreSQL 데이터베이스를 무료로 호스팅할 수 있는 매우 편리한 서비스입니다.

**1단계: Render 회원가입**
1.  [Render.com](https://render.com/)에 접속하여 GitHub 계정으로 회원가입 또는 로그인합니다.

**2단계: PostgreSQL 데이터베이스 생성**
1.  Render 대시보드에서 **[New +]** 버튼을 누르고 **[PostgreSQL]**을 선택합니다.
2.  **Name**을 입력합니다 (예: `refrigerator-db`).
3.  **Region**을 선택합니다 (예: `Oregon (US West)`).
4.  **Free** 플랜을 선택했는지 확인하고, **[Create Database]** 버튼을 누릅니다.
5.  데이터베이스가 생성되면, **Connect** 정보에서 **`External Database URL`**을 복사해둡니다. 이 주소가 잠시 후 필요합니다.

**3단계: Node.js 백엔드 서버 배포**
1.  대시보드에서 다시 **[New +]** 버튼을 누르고 **[Web Service]**를 선택합니다.
2.  **Connect a repository**에서 이 프로젝트의 GitHub 저장소 (`Take_Care_Refrigerator`)를 찾아 **[Connect]** 버튼을 누릅니다.
3.  아래와 같이 웹 서비스를 설정합니다.
    *   **Name**: `refrigerator-backend` (또는 원하는 이름)
    *   **Region**: 데이터베이스와 동일한 지역 선택
    *   **Branch**: `master` (또는 `main`)
    *   **Root Directory**: `backend`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
    *   **Instance Type**: `Free`
4.  **[Advanced]** 섹션을 열어 **[Add Environment Variable]**을 클릭합니다.
    *   **Key**: `DATABASE_URL`, **Value**: 위 2단계에서 복사해 둔 `External Database URL`을 붙여넣습니다.
    *   **Key**: `JWT_SECRET`, **Value**: 원하는 임의의 비밀 문자열을 입력합니다 (예: `this_is_a_super_secret_key`).
5.  **[Create Web Service]** 버튼을 누릅니다. Render가 자동으로 코드를 가져와 빌드하고 서버를 실행합니다. 첫 배포에는 몇 분 정도 소요될 수 있습니다.
6.  배포가 완료되면, 서비스 페이지 상단에 `https://refrigerator-backend.onrender.com` 과 같은 형태의 주소가 나타납니다. 이 주소를 복사해둡니다.

## Part 2: 프론트엔드에 백엔드 주소 연결

이제 프론트엔드가 로컬 서버가 아닌, 항상 켜져 있는 Render의 백엔드 서버와 통신하도록 설정해야 합니다.

1.  `frontend` 폴더에 `.env.production` 파일을 생성합니다.
2.  파일을 열고 아래 내용을 추가합니다. 위에서 복사해 둔 Render 백엔드 주소를 붙여넣으세요.
    ```
    VITE_API_URL=https://refrigerator-backend.onrender.com
    ```
3.  프론트엔드 코드를 수정하여 운영 환경에서는 이 주소를 사용하도록 변경합니다.
4.  수정이 완료되면, 변경사항을 GitHub에 커밋하고 `npm run deploy`를 다시 실행하여 프론트엔드를 최종 배포합니다.

이 과정을 모두 마치면, 당신의 웹사이트는 별도의 실행 과정 없이 항상 켜져 있는 백엔드와 통신하게 됩니다.
