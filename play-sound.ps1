param([string]$path)
Add-Type -AssemblyName PresentationCore
$player = New-Object System.Windows.Media.MediaPlayer
$fullPath = (Get-Item $path).FullName
$player.Open([System.Uri]$fullPath)
Start-Sleep -Milliseconds 300
$player.Play()
Start-Sleep -Seconds 2
$player.Close()
