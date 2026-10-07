@echo off
echo ========================================
echo RailBlockAI Backend API Tests
echo ========================================
echo.

echo [1/5] Testing Health Endpoint...
curl -s http://127.0.0.1:8000/health
echo.
echo.

echo [2/5] Testing Priority Calculation...
curl -s -X POST http://127.0.0.1:8000/api/priority/calculate ^
  -H "Content-Type: application/json" ^
  -d "{\"id\":\"TSK-TEST-001\",\"asset_criticality\":\"Critical\",\"severity\":\"High\",\"urgency\":\"Immediate\",\"operational_impact\":90.0}"
echo.
echo.

echo [3/5] Testing Optimization Engine...
curl -s -X POST http://127.0.0.1:8000/api/optimizer/run ^
  -H "Content-Type: application/json" ^
  -d "{\"corridor_id\":\"CORR-SR-TEN-MDU\",\"section_id\":\"ALL\"}"
echo.
echo.

echo [4/5] Testing Smart Bundling...
curl -s -X POST http://127.0.0.1:8000/api/bundles/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"corridor_id\":\"CORR-SR-TEN-MDU\"}"
echo.
echo.

echo [5/5] Testing Weekly Planning...
curl -s -X POST http://127.0.0.1:8000/api/plans/generate-weekly ^
  -H "Content-Type: application/json" ^
  -d "{\"corridor_id\":\"CORR-SR-TEN-MDU\"}"
echo.
echo.

echo ========================================
echo All Tests Complete!
echo ========================================
echo.
echo Next: Open http://127.0.0.1:8000/docs for API documentation
pause
