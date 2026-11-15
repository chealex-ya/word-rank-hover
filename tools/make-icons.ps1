# Generates icons/icon16|32|48|128.png (rounded square, indigo-violet gradient, white "W").
#   powershell -File make-icons.ps1
Add-Type -AssemblyName System.Drawing

$iconsDir = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "..\icons"
New-Item -ItemType Directory -Force $iconsDir | Out-Null

foreach ($size in 16, 32, 48, 128) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.Clear([System.Drawing.Color]::Transparent)

  $r = [Math]::Max(2, [int]($size * 0.18))
  $d = 2 * $r
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddArc(0, 0, $d, $d, 180, 90)
  $path.AddArc($size - $d, 0, $d, $d, 270, 90)
  $path.AddArc($size - $d, $size - $d, $d, $d, 0, 90)
  $path.AddArc(0, $size - $d, $d, $d, 90, 90)
  $path.CloseAllFigures()

  $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
  $c1 = [System.Drawing.Color]::FromArgb(79, 70, 229)   # indigo
  $c2 = [System.Drawing.Color]::FromArgb(124, 58, 237)  # violet
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45.0)
  $g.FillPath($brush, $path)

  $font = New-Object System.Drawing.Font('Segoe UI', ($size * 0.62), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = [System.Drawing.StringAlignment]::Center
  $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString('W', $font, [System.Drawing.Brushes]::White, (New-Object System.Drawing.RectangleF(0, 0, $size, $size)), $fmt)

  $bmp.Save((Join-Path $iconsDir "icon$size.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $path.Dispose(); $brush.Dispose(); $font.Dispose(); $fmt.Dispose()
}
Write-Host "Icons written to $iconsDir"
