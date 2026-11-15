# Rebuilds data/en_ranks.txt from a hermitdave/FrequencyWords source file.
#
#   powershell -File rebuild-data.ps1 -Source C:\Dev\_downloads\freqwords-en50k\en_50k.txt
#
# Source format : "word count" per line, sorted by descending count.
# Output format : "word rank" per line (1 = most frequent), ASCII letters only.
param(
  [Parameter(Mandatory = $true)]
  [string]$Source,
  [string]$Out
)

if (-not $Out) {
  $Out = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "..\data\en_ranks.txt"
}
if (-not (Test-Path $Source)) { throw "Source not found: $Source" }

$rank = 0
$lines = New-Object System.Collections.Generic.List[string]
foreach ($line in [System.IO.File]::ReadLines($Source)) {
  $i = $line.IndexOf(' ')
  if ($i -lt 1) { continue }
  $word = $line.Substring(0, $i).ToLowerInvariant()
  if ($word -cmatch "^[a-z']+$" -and $word -cmatch '[a-z]') {
    $rank++
    $lines.Add("$word $rank")
  }
}
[System.IO.File]::WriteAllLines($Out, $lines)
Write-Host "Wrote $rank words to $Out"
