$body = @{
    type = "first_aid"
    topic = "CPR & Choking"
    title = "CPR Tutorial"
    youtubeUrl = "https://www.youtube.com/watch?v=4j329wUsl3s"
    description = "First Aid: CPR video tutorial"
} | ConvertTo-Json

Write-Host "Request Body:" -ForegroundColor Cyan
Write-Host $body -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/videos/add" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 5)
} catch {
    Write-Host "Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
