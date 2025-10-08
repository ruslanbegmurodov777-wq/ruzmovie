Set-Location -Path "c:\Users\user\Desktop\Ruzmovie\frontend"
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
$env:PORT=3003
npm start