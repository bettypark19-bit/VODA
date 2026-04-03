from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from pathlib import Path
from dotenv import load_dotenv
import json

# 1. 환경 변수 로드
root_path = Path(__file__).resolve().parent.parent
env_path = root_path / ".env"

if env_path.exists():
    load_dotenv(dotenv_path=env_path)
    print(f"✅ .env 로드 성공: {env_path}")
else:
    load_dotenv()
    print("⚠️ .env 파일을 찾을 수 없습니다. 기본 설정을 사용합니다.")

app = FastAPI(title="VODA AI Backend")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    text: str

# Hugging Face 설정 (최신 라우터 주소로 업데이트)
HF_MODEL = "Qwen/Qwen2.5-72B-Instruct" 
HF_URL = f"https://router.huggingface.co/hf-inference/v1/chat/completions"

def ask_ai(q: str) -> str:
    token = os.getenv("HF_TOKEN")
    
    if not token:
        return "[알림] .env 파일에 HF_TOKEN이 설정되지 않았습니다."
    
    # 토큰에서 혹시 모를 공백이나 따옴표 제거
    clean_token = token.strip().replace('"', '').replace("'", "")
    
    headers = {
        "Authorization": f"Bearer {clean_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": HF_MODEL,
        "messages": [
            {"role": "system", "content": "당신은 VODA 서비스의 친절한 영화 추천 전문가입니다. 한국어로 답변하세요."},
            {"role": "user", "content": q}
        ],
        "max_tokens": 500,
        "temperature": 0.7
    }
    
    print(f"🚀 AI 요청 전송: {q}")
    
    try:
        res = requests.post(HF_URL, headers=headers, json=payload, timeout=30)
        
        # 503 에러 처리 (모델 로딩 중)
        if res.status_code == 503:
            return "AI 모델이 현재 준비 중입니다. 잠시 후 다시 시도해 주세요. (Hugging Face 서비스 로딩)"
            
        res.raise_for_status()
        data = res.json()
        
        if "choices" in data:
            reply = data["choices"][0]["message"]["content"]
            print(f"✅ AI 응답 성공")
            return reply
        else:
            print(f"⚠️ 응답 형식 오류: {data}")
            return f"응답 형식 오류가 발생했습니다: {json.dumps(data, ensure_ascii=False)}"
            
    except Exception as e:
        error_msg = str(e)
        if hasattr(e, 'response') and e.response is not None:
            # 상세 에러 내용 파싱
            try:
                error_detail = e.response.json()
                error_msg = error_detail.get('error', str(e))
            except:
                error_msg = e.response.text
        
        print(f"❌ AI 호출 실패: {error_msg}")
        return f"AI 호출 오류: {error_msg}"

@app.post("/chat")
async def chat(req: ChatRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="메시지가 비어있습니다.")
    
    reply = ask_ai(req.text)
    return {"reply": reply}

@app.get("/")
def read_root():
    return {
        "status": "VODA AI Backend is active", 
        "env_loaded": env_path.exists(),
        "has_token": bool(os.getenv("HF_TOKEN")),
        "token_preview": os.getenv("HF_TOKEN")[:10] + "..." if os.getenv("HF_TOKEN") else None
    }
