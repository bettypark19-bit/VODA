from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests, os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, "..", ".env"))
load_dotenv(os.path.join(BASE_DIR, ".env"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Msg(BaseModel):
    text: str

HF_MODEL = "Qwen/Qwen2.5-72B-Instruct"
HF_URL = "https://api-inference.huggingface.co/v1/chat/completions"

def ask_ai(q: str) -> str:
    token = os.getenv("HF_TOKEN")
    if not token:
        return f"[테스트 모드] VODA AI입니다. 질문하신 '{q}'에 대한 답변을 준비 중입니다. (HF_TOKEN 설정 필요)"
        
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": HF_MODEL,
        "messages": [
            {"role": "system", "content": "당신은 VODA 서비스의 친절한 영화 전문가 AI입니다. 한국어로 답변해주세요."},
            {"role": "user", "content": q}
        ],
        "max_tokens": 500,
        "temperature": 0.7
    }
    
    try:
        res = requests.post(HF_URL, headers=headers, json=payload, timeout=30)
        res.raise_for_status()
        data = res.json()
        if "choices" in data and len(data["choices"]) > 0:
            return data["choices"][0]["message"]["content"]
        return f"오류: API 응답 형식이 예상과 다릅니다. ({data})"
    except Exception as e:
        error_msg = str(e)
        if hasattr(e, 'response') and e.response is not None:
            error_msg += f" - 응답내용: {e.response.text}"
        return f"AI 서비스 호출 중 오류가 발생했습니다: {error_msg}"

@app.post("/chat")
def chat(msg: Msg):
    reply = ask_ai(msg.text)
    return {"reply": reply}
@app.post("/review/sentiment", tags=["리뷰"])
def sentiment(req: Text):
    r = hf("nlptown/bert-base-multilingual-uncased-sentiment", {"inputs": req.text})
    if isinstance(r, list) and r:
        top = max(r[0], key=lambda x: x["score"])
        return {"label": top["label"], "score": round(top["score"], 3)}
    return r
    @app.post("/content/genre", tags=["콘텐츠"])
def genre(req: Genre):
    r = hf("facebook/bart-large-mnli", {
        "inputs": req.text,
        "parameters": {"candidate_labels": req.labels},
    })
    if isinstance(r, list):
        return [{"genre": x["label"], "score": round(x["score"], 3)} for x in r[:3]]
    if "labels" in r:
        return [
            {"genre": l, "score": round(s, 3)}
            for l, s in zip(r["labels"][:3], r["scores"][:3])
        ]
    return r
    @app.post("/review/spoiler", tags=["리뷰"])
def spoiler(req: Text):
    r = hf("facebook/bart-large-mnli", {
        "inputs": req.text,
        "parameters": {"candidate_labels": ["spoiler", "no spoiler"]},
    })
    if isinstance(r, list) and r:
        top = r[0]
        return {"is_spoiler": top["label"] == "spoiler", "confidence": round(top["score"], 3)}
    if "labels" in r:
        return {"is_spoiler": r["labels"][0] == "spoiler", "confidence": round(r["scores"][0], 3)}
    return r
    @app.post("/review/toxic", tags=["리뷰"])
def toxic(req: Text):
    r = hf("unitary/toxic-bert", {"inputs": req.text})
    if isinstance(r, list) and r:
        hits = [
            {"label": x["label"], "score": round(x["score"], 3)}
            for x in r[0] if x["score"] > 0.5
        ]
        return {"is_toxic": len(hits) > 0, "details": hits}
    return r
    @app.post("/content/summary", tags=["콘텐츠"])
def summary(req: Text):
    r = hf("facebook/bart-large-cnn", {
        "inputs": req.text,
        "parameters": {"max_length": 80, "min_length": 20},
    })
    if isinstance(r, list) and r:
        return {"summary": r[0].get("summary_text", "")}
    return r
    @app.post("/content/ner", tags=["콘텐츠"])
def ner(req: Text):
    r = hf("dslim/bert-base-NER", {"inputs": req.text})
    if isinstance(r, list):
        persons = list(set(
            x["word"] for x in r
            if x.get("entity_group") == "PER" and x.get("score", 0) > 0.8
        ))
        return {"persons": persons}
    return r
    @app.post("/subtitle/translate", tags=["자막"])
def translate(req: Trans):
    r = hf(f"Helsinki-NLP/opus-mt-{req.src}-{req.tgt}", {"inputs": req.text})
    if isinstance(r, list) and r:
        return {"translated": r[0].get("translation_text", "")}
    return r
    @app.post("/content/qa", tags=["콘텐츠"])
def qa(req: QA):
    r = hf(
        "google-bert/bert-large-uncased-whole-word-masking-finetuned-squad",
        {"inputs": {"question": req.question, "context": req.context}},
    )
    if "answer" in r:
        return {"answer": r["answer"], "score": round(r["score"], 3)}
    return r
    @app.post("/image/detect", tags=["이미지"])
async def detect(file: UploadFile = File(...)):
    data = await file.read()
    r = hf_img("facebook/detr-resnet-50", data)
    if isinstance(r, list):
        return [
            {"label": x["label"], "score": round(x["score"], 3), "box": x["box"]}
            for x in r if x.get("score", 0) > 0.7
        ]
    return r
    @app.post("/image/nsfw", tags=["이미지"])
async def nsfw(file: UploadFile = File(...)):
    data = await file.read()
    r = hf_img("Falconsai/nsfw_image_detection", data)
    if isinstance(r, list):
        for x in r:
            if x.get("label") == "nsfw":
                return {"is_nsfw": x["score"] > 0.5, "score": round(x["score"], 3)}
        return {"is_nsfw": False, "score": 0}
    return r
    @app.post("/content/similar", tags=["콘텐츠"])
def similar(req: Similar):
    model = "intfloat/multilingual-e5-large"
    q = hf(model, {"inputs": req.query})

    results = []
    for c in req.candidates:
        e = hf(model, {"inputs": c})
        dot = sum(a * b for a, b in zip(q, e))
        na = sum(a * a for a in q) ** 0.5
        nb = sum(b * b for b in e) ** 0.5
        sim = dot / (na * nb) if na and nb else 0
        results.append({"text": c, "similarity": round(sim, 4)})

    results.sort(key=lambda x: x["similarity"], reverse=True)
    return results
    @app.post("/image/face", tags=["이미지"])
async def face(file: UploadFile = File(...)):
    data = await file.read()
    r = hf_img("jonathandinu/face-parsing", data)
    if isinstance(r, list):
        return [{"label": x["label"], "score": round(x["score"], 3)} for x in r]
    return r
    @app.post("/vlm/describe", tags=["멀티모달"])
def describe(req: ImgReq):
    result = vlm(req.prompt, req.image_url)
    return {"description": result}
    @app.post("/vlm/ground", tags=["멀티모달"])
def ground(req: ImgReq):
    prompt = (
        "이 이미지에서 모든 객체를 탐지하고 바운딩 박스 좌표를 JSON 배열로 반환해. "
        '형식: [\{"label":"한국어이름","confidence":0.9,"bbox":[x1,y1,x2,y2]\}]'
    )
    result = vlm(prompt, req.image_url)
    return {"raw": result}
    @app.post("/vlm/genre", tags=["멀티모달"])
def vlm_genre(req: ImgReq):
    prompt = (
        "이 이미지가 어떤 OTT 장르에 어울리는지 분류해. "
        "선택지: [액션, 로맨스, 힐링, 공포, SF, 자연다큐]. "
        'JSON으로 \{"genre":"선택","reason":"이유"\} 반환'
    )
    result = vlm(prompt, req.image_url)
    return {"raw": result}
    @app.post("/vlm/cua", tags=["멀티모달"])
def cua(req: ImgReq):
    sys_msg = (
        "너는 모바일 앱 자동화 에이전트다. "
        "스크린샷을 보고 다음 액션을 JSON으로 반환한다: "
        '\{"action":"tap|swipe|type","target":"요소이름","coordinates":[x,y],"description":"설명"\}'
    )
    result = vlm(req.prompt, req.image_url, sys_msg=sys_msg)
    return {"raw": result}
    @app.post("/vlm/ocr", tags=["멀티모달"])
def ocr(req: ImgReq):
    prompt = "이 이미지에 텍스트가 있으면 모두 읽어서 한국어로 번역해줘"
    result = vlm(prompt, req.image_url)
    return {"text": result}