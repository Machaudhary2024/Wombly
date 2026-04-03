# First Aid videos to add to MongoDB
$firstAidVideos = @{
    "CPR & Choking" = @(
        "https://www.youtube.com/watch?v=4j329wUsl3s"
    )
    "Allergies & Reactions" = @(
        "https://www.youtube.com/watch?v=yOTgmfA8jNk"
    )
    "Minor Injuries" = @(
        "https://www.youtube.com/watch?v=V6ucRwBliqc"
    )
    "Burns & Scalds" = @(
        "https://www.youtube.com/watch?v=VS4ezqDKS8Y"
    )
    "Poisoning" = @(
        "https://www.youtube.com/watch?v=K36B1wnMHIo"
    )
    "Fever & Infection" = @(
        "https://www.youtube.com/watch?v=HsRBsNp_cNw"
    )
}

$successCount = 0
$totalCount = 0
$apiUrl = "http://localhost:5000/api/videos/add"

Write-Host "`nStarting First Aid video upload..." -ForegroundColor Cyan

foreach ($topic in $firstAidVideos.Keys) {
    $urls = $firstAidVideos[$topic]
    for ($i = 0; $i -lt $urls.Count; $i++) {
        $totalCount++
        $urlRaw = $urls[$i]
        $url = $urlRaw.Split('&')[0]
        $title = "$topic - Tutorial $($i + 1)"
        
        $body = @{
            type = "first_aid"
            topic = $topic
            title = $title
            youtubeUrl = $url
            description = "First Aid: $topic video tutorial"
        } | ConvertTo-Json
        
        try {
            $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
            if ($response.success) {
                Write-Host "Added: $title" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host "Skipped (exists): $title" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "Error: $_" -ForegroundColor Red
        }
        Start-Sleep -Milliseconds 300
    }
}

Write-Host "`nDONE! Added $successCount of $totalCount first aid videos to database`n" -ForegroundColor Cyan
