# 🔍 Debug AI Copilot - Step by Step

## ✅ I've Added Detailed Logging

I've added console logs to track exactly what's happening when you send a message to the AI Copilot.

---

## 🎯 How to Debug

### Step 1: Open Your Browser Console
1. Open http://localhost:5173
2. Press **F12** (or Right-click → Inspect)
3. Click the **Console** tab

### Step 2: Open AI Copilot
1. Click the **AI Copilot button** (sparkles icon, bottom-right)
2. Type a message: **"Hi"**
3. Click Send

### Step 3: Watch the Logs

**In Browser Console (F12), you'll see:**
```
[AI Copilot] Sending messages: [{...}]
[AI Copilot] Live context: {tasks: 15, critical_tasks: 5, ...}
[API] sendChatMessage called with: {...}
[API] Sending payload: {messages: [...], context: {...}}
```

**In Backend Terminal (look at Kiro process output), you'll see:**
```
[ChatService] Received 1 messages:
  Message 0: role=user, content='Hi'
[ChatService] Added to Groq: role=user, content=Hi...
[ChatService] Sending 2 messages to Groq API
INFO: 127.0.0.1:xxxxx - "POST /api/chat/send HTTP/1.1" 200 OK
```

---

## 🐛 What to Look For

### ✅ If Working Correctly:
**Browser console shows:**
- Messages being sent
- Payload with proper `content` field

**Backend shows:**
- "Received X messages"
- "Added to Groq" for each message
- "200 OK" response

**UI shows:**
- AI response appears in chat

### ❌ If Still Failing:
**Browser console shows:**
- `content: undefined` or `content: null` in payload
- Error message about network or API

**Backend shows:**
- "Skipping message with no content"
- "sequence item 0: expected str instance, NoneType found"
- "500 Internal Server Error"

---

## 📋 Checklist

### Before Testing:
- [ ] Frontend is running (http://localhost:5173)
- [ ] Backend is running (http://127.0.0.1:8000)
- [ ] Browser console is open (F12)
- [ ] Backend terminal is visible in Kiro

### During Testing:
- [ ] Open AI Copilot
- [ ] Send message "Hi"
- [ ] Watch browser console
- [ ] Watch backend terminal
- [ ] Copy any error messages

---

## 🔧 Possible Issues & Solutions

### Issue 1: `content: undefined` in Browser
**Cause:** Messages array has items without `text` field

**Solution:** 
- Check browser console log for the messages array
- Look for any message with `text: undefined`
- Tell me what you see in the messages array

### Issue 2: Backend Says "Skipping message"
**Cause:** Frontend is sending `null` or empty content

**Solution:**
- Look at the "[API] Sending payload" log in browser
- Copy the exact payload and send it to me
- We'll fix the mapping

### Issue 3: "sequence item 0" Error
**Cause:** Something is bypassing our validation

**Solution:**
- Backend logs will show which message has `None`
- Look for the "Message X: content=..." line
- That will tell us exactly what's wrong

---

## 📸 What to Send Me

If it's still not working, please send me:

1. **Browser console output** (copy the logs after sending "Hi")
2. **Backend terminal output** (last 20 lines from Kiro process)
3. **Screenshot** of the error message in UI

This will help me identify the exact issue!

---

## 🧪 Quick Test (Without UI)

You can also test the API directly from command line:

```powershell
# This should work:
$body = '{"messages":[{"role":"user","content":"Hi"}]}'
Invoke-WebRequest -Uri http://127.0.0.1:8000/api/chat/send -Method POST -ContentType "application/json" -Body $body -UseBasicParsing | Select-Object -ExpandProperty Content
```

**If this works but UI doesn't,** the problem is in the frontend code.
**If this also fails,** the problem is in the backend.

---

## 📊 Backend Logs Location

The backend logs are in **Terminal #4** in Kiro.

To view them:
1. Look for the Kiro process output
2. Scroll to see the Python backend logs
3. Look for lines starting with `[ChatService]`

---

## ✅ Expected Working Flow

1. **User types:** "Hi"
2. **Browser:** Creates message object `{id: 'usr-...', sender: 'user', text: 'Hi'}`
3. **Browser:** Filters out welcome message (msg-1)
4. **Browser:** Maps to API format: `{role: 'user', content: 'Hi'}`
5. **Backend:** Receives message, validates content exists
6. **Backend:** Adds to Groq messages array
7. **Backend:** Calls Groq API
8. **Backend:** Returns AI response
9. **Browser:** Displays response in chat

**Any step failing will show in the logs!**

---

## 🚀 Next Steps

1. Open browser console (F12)
2. Try sending "Hi" in AI Copilot
3. Copy all the console logs
4. Show me what you see

I'll be able to pinpoint the exact issue with those logs!

---

**Debugging enabled:** ✅  
**Logs added:** Frontend + Backend  
**Ready to track:** Message flow
