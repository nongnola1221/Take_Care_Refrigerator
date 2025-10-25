# 개발 일지: 냉장고 요리사

## 프로젝트 개요

- **프로젝트명:** 자취생을 위한 냉장고 요리사
- **개발 기간:** 2025-10-25
- **목표:** 보유 식재료 기반 레시피 추천을 통한 음식물 쓰레기 최소화 및 식생활 편의 증진

---

## 개발 과정 (Today)

### Task 1: 프로젝트 초기 설정 및 백엔드 구조 설계

- **작업 내용:** Node.js/Express 프로젝트 초기화, PostgreSQL 연동 설정, User 모델 및 인증 API 기본 구조 설계.
- **Gemini CLI 사용 프롬프트:**
  > "Node.js와 Express, Sequelize ORM을 사용하여 PostgreSQL 데이터베이스와 연동되는 REST API 서버의 기본 구조를 생성해줘. 'users' 테이블(id, email, password_hash)을 포함하고, JWT 기반의 회원가입(/api/auth/register) 및 로그인(/api/auth/login) 엔드포인트를 만들어줘."
- **결과 및 수정사항:** Gemini가 생성한 기본 코드는 잘 작동했으나, 비밀번호 해싱 로직에 bcrypt 라이브러리를 직접 추가하고, 환경 변수 관리를 위해 dotenv 설정을 보강함.
- **학습 내용:** Sequelize ORM의 모델 정의와 마이그레이션 개념에 대해 학습함.

### Task 2: 프론트엔드 환경 설정 및 기본 구조 생성

- **작업 내용:** Vite를 이용한 React(TypeScript) 프로젝트 생성, Tailwind CSS 및 Framer Motion 설치 및 설정.
- **Gemini CLI 사용 프롬프트:**
  > "Vite를 사용해 'refrigerator-chef'라는 이름의 React-TypeScript 프로젝트를 생성하고, Tailwind CSS와 Framer Motion을 설치 및 설정하는 셸 명령어를 순서대로 알려줘."
- **결과 및 수정사항:** `tailwind.config.js`와 `index.css` 설정이 정확하게 완료됨.
- **학습 내용:** Vite의 빠른 개발 서버 속도와 HMR(Hot Module Replacement)의 장점을 확인함.

*(이하 생략, 위와 같은 형식으로 오늘 진행할 모든 Task를 기록)*
