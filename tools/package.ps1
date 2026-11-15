# Packages the extension into dist/word-rank-hover-v<version>.zip (manifest at zip root),
# ready for Chrome Web Store / Microsoft Partner Center upload.
#   powershell -File package.ps1
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$version = (Get-Content (Join-Path $root "manifest.json") -Raw | ConvertFrom-Json).version

$dist = Join-Path $root "dist"
$stage = Join-Path $dist "word-rank-hover"
if (Test-Path $stage) { Remove-Item -Recurse -Force $stage }
New-Item -ItemType Directory -Force $stage | Out-Null

$items = @("manifest.json", "background.js", "content.js", "content.css",
           "popup.html", "popup.js", "icons", "data")
foreach ($i in $items) { Copy-Item (Join-Path $root $i) -Destination $stage -Recurse }

$zip = Join-Path $dist "word-rank-hover-v$version.zip"
if (Test-Path $zip) { Remove-Item $zip }
Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $zip
Remove-Item -Recurse -Force $stage
Write-Host "Packaged: $zip ($([math]::Round((Get-Item $zip).Length/1KB)) KB)"
