$workDir = [System.IO.DirectoryInfo]::new($PSScriptRoot).Parent.FullName

$compose = "docker compose up -d"
$migrate = "npm run migrate -w backend"
$startBackend = "npm run dev -w backend"
$startFrontend = "npm run dev -w frontend"

Start-Process -FilePath "cmd.exe" -ArgumentList "/K", "cd /d $workDir && $compose && $migrate && $startBackend"
Start-Process -FilePath "cmd.exe" -ArgumentList "/K", "cd /d $workDir && $startFrontend"
