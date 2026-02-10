from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import asyncio
from concurrent.futures import ThreadPoolExecutor

app = FastAPI()

# Allow HTML to connect from anywhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔐 PASTE YOUR API KEYS HERE
PROVIDERS = {
    "nvidia": {
        "endpoint": "https://integrate.api.nvidia.com/v1/chat/completions",
        "key": "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"
    },
}

# 🔥 THREAD CONTROL (Optimized for 60–70 models)
EXECUTORS = {
    "nvidia": ThreadPoolExecutor(max_workers=50),   # Main compute power
}

def call_model(provider, model, prompt, retries=2):
    url = PROVIDERS[provider]["endpoint"]
    key = PROVIDERS[provider]["key"]

    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }

    data = {
        "model": model,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 64536
    }

    for attempt in range(retries):
        try:
            r = requests.post(url, headers=headers, json=data, timeout=45)

            if r.status_code == 200:
                return {
                    "provider": provider,
                    "model": model,
                    "success": True,
                    "output": r.json()
                }

        except Exception as e:
            error = str(e)

    return {
        "provider": provider,
        "model": model,
        "success": False,
        "error": error if 'error' in locals() else "Failed"
    }

@app.post("/ask")
async def ask(data: dict):
    prompt = data.get("prompt")
    models = data.get("models", [])

    loop = asyncio.get_event_loop()
    tasks = []

    for m in models:
        provider = m["provider"]
        model = m["modelId"]

        exec_used = EXECUTORS.get(provider, EXECUTORS["ionet"])

        task = loop.run_in_executor(
            exec_used,
            call_model,
            provider,
            model,
            prompt
        )
        tasks.append(task)

    results = await asyncio.gather(*tasks)

    return {
        "total_models": len(models),
        "results": results
    }
