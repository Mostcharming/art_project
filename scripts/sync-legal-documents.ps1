param([string]$TvRoot = 'C:\Users\OluwaMayowa\Downloads\carslTV')
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $projectRoot 'legal/documents.json'
$destinations = @(
    (Join-Path $projectRoot 'admin/src/data/legalDocuments.json'),
    (Join-Path $projectRoot 'publishers/constants/legalDocuments.json'),
    (Join-Path $TvRoot 'src/data/legalDocuments.json')
)
foreach ($destination in $destinations) {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
    Copy-Item -LiteralPath $source -Destination $destination
}
Write-Output 'Updated the website, publisher and TV copies of the legal documents.'
