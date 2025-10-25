#!/bin/bash

# 사용법:./commit.sh <type> "커밋 메시지"
# 예시:./commit.sh feat "사용자 로그인 기능 구현"

# 인자 개수 확인
if [ "$#" -ne 2 ]; then
    echo "사용법: $0 <type> \"커밋 메시지\""
    echo "타입 예시: feat, fix, chore, docs, style, refactor, test"
    exit 1
fi

TYPE=$1
MESSAGE=$2
COMMIT_MESSAGE="$TYPE: $MESSAGE"

# 3분의 1 확률로 AI 도움 문구 추가
RANDOM_NUM=$((1 + RANDOM % 3))
if [ $RANDOM_NUM -eq 1 ]; then
    COMMIT_MESSAGE="$COMMIT_MESSAGE\n\n[AI-assisted]"
fi

# Git 명령어 실행
git add .
git commit -m "$(echo -e "$COMMIT_MESSAGE")"

echo "커밋 완료:"
git log -1 --pretty=%B
