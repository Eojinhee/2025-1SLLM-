
function sendMessage() {
    const inputText = document.getElementById("userInput").value.trim();
    const loading = document.getElementById("loading");
    const errorBox = document.getElementById("error");
    const chatBox = document.getElementById("chatBox");
    const responseTime = document.getElementById("responseTime");


    if (!inputText) return;

    // 유저 메시지 출력
    chatBox.innerHTML += `<div class="user-message">${inputText}</div>`;
    document.getElementById("userInput").value = '';
    errorBox.style.display = "none";
    loading.style.display = "block";
    document.getElementById("sendBtn").disabled = true;  /
    chatBox.scrollTop = chatBox.scrollHeight;  // 채팅 박스 스크롤 맨 아래로

    const startTime = performance.now();  // 요청 시작 시간

    // 서버 요청
    $.ajax({
        url: 'http://localhost:8000/v1/chat/completions',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            model: 'phi',
            messages: [{ role: 'user', content: inputText }]
        }),
        success: function(response) {
            const result = response.choices?.[0]?.message?.content || '응답이 없습니다.';
            const endTime = performance.now();  // 응답 완료 시간
            const timeTaken = ((endTime - startTime) / 1000).toFixed(1);  // 응답 시간 계산

            // 봇의 메시지 추가
            chatBox.innerHTML += `<div class="bot-message">${result}</div>`;
            responseTime.textContent = `⏱ 응답 시간: ${timeTaken}s`;  // 응답 시간 표시
            chatBox.scrollTop = chatBox.scrollHeight;  // 채팅 박스 스크롤 맨 아래로
        },
        error: function() {
            errorBox.textContent = "❗ 서버에 연결할 수 없습니다.";  // 에러 메시지
            errorBox.style.display = "block";  // 에러 메시지 표시
        },
        complete: function() {
            loading.style.display = "none";  // 로딩 스피너 숨기기
            document.getElementById("sendBtn").disabled = false;  // 버튼 활성화
        }
    });
}

