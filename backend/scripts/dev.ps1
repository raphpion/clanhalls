$workDir = [System.IO.DirectoryInfo]::new($PSScriptRoot).Parent.Parent.FullName

# Commands
$compose = "docker compose -f docker-compose.dev.yml up -d"
$migrate = "npm run migrate -w backend"
$startBackend = "npm run dev -w backend"
$startFrontend = "npm run dev -w frontend"

# Start processes
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd $workDir; $compose; $migrate; $startBackend;"
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd $workDir; $startFrontend;"