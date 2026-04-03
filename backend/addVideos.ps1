# Videos to add to MongoDB
$cartoons = @{
    "tom_jerry" = @(
        "https://www.youtube.com/watch?v=m_2XzeSTEAM",
        "https://www.youtube.com/watch?v=qsbmjEQitmw",
        "https://www.youtube.com/watch?v=giO_iq5Xe_c",
        "https://www.youtube.com/watch?v=t0Q2otsqC4I&t=31s",
        "https://www.youtube.com/watch?v=rilFfbm7j8k"
    );
    "pink_panther" = @(
        "https://www.youtube.com/watch?v=DWYeStSYZwk&t=36s",
        "https://www.youtube.com/watch?v=JAD9e-cDb-Y",
        "https://www.youtube.com/watch?v=ZdQweZuxR3E",
        "https://www.youtube.com/watch?v=uvHzle4Qze8",
        "https://www.youtube.com/watch?v=LU3O3YE88bg"
    );
    "DeanTV" = @(
        "https://www.youtube.com/watch?v=Iyt61nmRvOs",
        "https://www.youtube.com/watch?v=Mjy_VMyKoQ8",
        "https://www.youtube.com/watch?v=PGDmUJhMC5k",
        "https://www.youtube.com/watch?v=D6UlvqD_Fw4",
        "https://www.youtube.com/watch?v=-5LILyG2tcM"
    );
    "MrBean" = @(
        "https://www.youtube.com/watch?v=chDzys9QnIs&t=28s",
        "https://www.youtube.com/watch?v=z4p1onTh7oU",
        "https://www.youtube.com/watch?v=vTlx-pmjTkM",
        "https://www.youtube.com/watch?v=_fsjQXoqFtM",
        "https://www.youtube.com/watch?v=a5GhERqvlds"
    );
    "Masha_bear" = @(
        "https://www.youtube.com/watch?v=mWXrM-OKBNQ",
        "https://www.youtube.com/watch?v=jCvSEuHms5M",
        "https://www.youtube.com/watch?v=taAU0ZJ4IBY",
        "https://www.youtube.com/watch?v=YDhoIHgYYwo",
        "https://www.youtube.com/watch?v=jGaaHVuUcaU"
    )
}

$lullabies = @{
    "SuperSimpleSongs" = @(
        "https://www.youtube.com/watch?v=hSdG4A-pUro",
        "https://www.youtube.com/watch?v=GbDiJcYYO28",
        "https://www.youtube.com/watch?v=vyyllg6fx1I",
        "https://www.youtube.com/watch?v=E4ISZemF2UM",
        "https://www.youtube.com/watch?v=vcKxZLQETgE"
    );
    "Zeazara_KidsTV" = @(
        "https://www.youtube.com/watch?v=M-GEDglyt-4&t=106s",
        "https://www.youtube.com/watch?v=HSy3kzu0kF0",
        "https://www.youtube.com/watch?v=_lgyvcWHKy4",
        "https://www.youtube.com/watch?v=2XayiNmDuXQ",
        "https://www.youtube.com/watch?v=9eNs8M7bZMY"
    );
    "kidzone" = @(
        "https://www.youtube.com/watch?v=J1THCT-DU3E",
        "https://www.youtube.com/watch?v=0DP1lidVv2o",
        "https://www.youtube.com/watch?v=8Z2r44lrNAs",
        "https://www.youtube.com/watch?v=shHVZvwz_Zs",
        "https://www.youtube.com/watch?v=85I0NkYZFK0"
    );
    "BabyTV" = @(
        "https://www.youtube.com/watch?v=pZuaMn_eFfA",
        "https://www.youtube.com/watch?v=qV_C2o-XsA0",
        "https://www.youtube.com/watch?v=kU3eJvTmmfU",
        "https://www.youtube.com/watch?v=pXGuLNePCO4",
        "https://www.youtube.com/watch?v=JCXk9ISMDG0"
    );
    "Tiny_MuslimClub" = @(
        "https://www.youtube.com/watch?v=grjWkYMr3M0",
        "https://www.youtube.com/watch?v=nU6S1tR5s4A",
        "https://www.youtube.com/watch?v=pSWRPGOvG_w",
        "https://www.youtube.com/watch?v=i6FmG6b2Jtc",
        "https://www.youtube.com/watch?v=B-3KFUmQaoI"
    )
}

$successCount = 0
$totalCount = 0
$apiUrl = "http://localhost:5000/api/videos/add"

Write-Host "`nStarting bulk video upload..." -ForegroundColor Cyan

foreach ($channel in $cartoons.Keys) {
    $urls = $cartoons[$channel]
    for ($i = 0; $i -lt $urls.Count; $i++) {
        $totalCount++
        $urlRaw = $urls[$i]
        $url = $urlRaw.Split('&')[0]
        $title = "$channel Episode $($i + 1)"
        
        $body = @{
            type = "cartoon"
            channel = $channel
            title = $title
            youtubeUrl = $url
            description = "$channel - $title"
        } | ConvertTo-Json
        
        try {
            $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
            if ($response.success) {
                Write-Host "Added: $channel - $title" -ForegroundColor Green
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

foreach ($channel in $lullabies.Keys) {
    $urls = $lullabies[$channel]
    for ($i = 0; $i -lt $urls.Count; $i++) {
        $totalCount++
        $urlRaw = $urls[$i]
        $url = $urlRaw.Split('&')[0]
        $title = "$channel Song $($i + 1)"
        
        $body = @{
            type = "lullaby"
            channel = $channel
            title = $title
            youtubeUrl = $url
            description = "$channel - $title"
        } | ConvertTo-Json
        
        try {
            $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
            if ($response.success) {
                Write-Host "Added: $channel - $title" -ForegroundColor Green
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

Write-Host "`nDONE! Added $successCount of $totalCount videos to database`n" -ForegroundColor Cyan
