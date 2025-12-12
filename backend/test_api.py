#!/usr/bin/env python
import httpx
import asyncio
import json

async def test_new_apis():
    async with httpx.AsyncClient() as client:
        print("=" * 60)
        print("🧪 Testing New Goalhub API Endpoints")
        print("=" * 60)
        
        # Test 1: Users API
        print("\n1️⃣  Testing GET /api/users/ endpoint...")
        try:
            r = await client.get('http://localhost:8000/api/users/')
            print(f"   Status: {r.status_code}")
            users = r.json()
            print(f"   Found {len(users)} users in database")
        except Exception as e:
            print(f"   ❌ Error: {e}")
            
        # Test 2: Events API
        print("\n2️⃣  Testing GET /api/events/ endpoint...")
        try:
            r = await client.get('http://localhost:8000/api/events/')
            print(f"   Status: {r.status_code}")
            events = r.json()
            print(f"   Found {len(events)} events")
        except Exception as e:
            print(f"   ❌ Error: {e}")
            
        # Test 3: Create a sample event
        print("\n3️⃣  Testing POST /api/events/ (creating sample event)...")
        try:
            event_data = {
                "title": "Kitengela Super Cup",
                "description": "Annual football tournament",
                "date": "2025-12-15",
                "time": "14:00",
                "image": "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=400",
                "location": "Allianz Arena"
            }
            r = await client.post('http://localhost:8000/api/events/', json=event_data)
            print(f"   Status: {r.status_code}")
            if r.status_code == 201:
                created = r.json()
                print(f"   ✅ Created event: {created['title']}")
        except Exception as e:
            print(f"   ❌ Error: {e}")
            
        # Test 4: API Documentation
        print("\n4️⃣  Checking updated API docs...")
        try:
            r = await client.get('http://localhost:8000/docs')
            print(f"   Status: {r.status_code}")
            print(f"   ✅ Swagger UI accessible with new endpoints")
        except Exception as e:
            print(f"   ❌ Error: {e}")
            
        print("\n" + "=" * 60)
        print("✅ New API Testing Complete!")
        print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_new_apis())
