$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
New-Item -ItemType Directory -Path (Join-Path $projectRoot '.local') -Force | Out-Null
# The API uses the existing PostgreSQL service configured in apis/.env.
$nodePath = (Get-Command node.exe).Source
$services = @(
    @{ Name = 'api'; Directory = 'apis'; Arguments = @('index.js'); Port = 3000 },
    @{ Name = 'admin'; Directory = 'admin'; Arguments = @('node_modules/vite/bin/vite.js', '--host', '127.0.0.1'); Port = 5174 },
    @{ Name = 'publishers'; Directory = 'publishers'; Arguments = @('node_modules/expo/bin/cli', 'start', '--web', '--offline', '--port', '8081', '--max-workers', '2'); Port = 8081 }
)
foreach ($service in $services) {
    if (Get-NetTCPConnection -State Listen -LocalPort $service.Port -ErrorAction SilentlyContinue) {
        Write-Host "$($service.Name): port $($service.Port) is already in use; skipping."
        continue
    }
    $process = Start-Process -FilePath $nodePath -ArgumentList $service.Arguments -WorkingDirectory (Join-Path $projectRoot $service.Directory) -WindowStyle Hidden -RedirectStandardOutput (Join-Path $projectRoot ".local\$($service.Name).log") -RedirectStandardError (Join-Path $projectRoot ".local\$($service.Name).error.log") -PassThru
    $process.Id | Set-Content (Join-Path $projectRoot ".local\$($service.Name).pid")
    Write-Host "$($service.Name): started process $($process.Id) on port $($service.Port)."
}
