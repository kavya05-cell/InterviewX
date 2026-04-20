# test_llm.py

import asyncio
from app.services.llm_service import generate_response

async def test():
    res = await generate_response("Say hello")
    print(res)

asyncio.run(test())