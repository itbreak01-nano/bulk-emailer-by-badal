Add-Type -AssemblyName System.Drawing
$iconsDir = "C:\Users\User\bulk-emailer-by-badal\icons"
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null
}

$sizes = @(16, 48, 128)
foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    # Background circle
    $rect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
    $color1 = [System.Drawing.Color]::FromArgb(2, 132, 199)
    $color2 = [System.Drawing.Color]::FromArgb(15, 23, 42)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList @($rect, $color1, $color2, [float]45.0)
    $g.FillEllipse($brush, 0, 0, ($size - 1), ($size - 1))

    # Center Letter 'B'
    $fontSize = [float]($size * 0.52)
    if ($fontSize -lt 7) { $fontSize = 7 }
    $font = New-Object System.Drawing.Font -ArgumentList @("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    $textBrush = [System.Drawing.Brushes]::White
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center

    $rectF = New-Object System.Drawing.RectangleF 0, 0, $size, $size
    $g.DrawString("B", $font, $textBrush, $rectF, $format)

    $outPath = Join-Path $iconsDir "icon$size.png"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $brush.Dispose()
    $font.Dispose()
    $g.Dispose()
    $bmp.Dispose()
}

Write-Output "Successfully generated all Badal Mailer icons!"
