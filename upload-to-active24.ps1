# FTP Upload Script for Active24
# Replace these with your actual Active24 FTP credentials

$ftpServer = "ftp.yourdomainname.cz"  # Change this to your FTP server
$ftpUsername = "your-ftp-username"     # Change this to your FTP username
$ftpPassword = "your-ftp-password"     # Change this to your FTP password
$ftpRemotePath = "/www"                # Change if your root folder is different

$localPath = ".\publish"               # Local publish folder

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Active24 FTP Upload Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Local folder: $localPath" -ForegroundColor Yellow
Write-Host "FTP Server: $ftpServer" -ForegroundColor Yellow
Write-Host "Remote path: $ftpRemotePath" -ForegroundColor Yellow
Write-Host ""

# Function to upload a file
function Upload-File {
    param (
        [string]$LocalFile,
        [string]$RemoteFile
    )
    
    try {
        $uri = "ftp://$ftpServer$RemoteFile"
        $request = [System.Net.FtpWebRequest]::Create($uri)
        $request.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $request.UseBinary = $true
        $request.KeepAlive = $false
        
        $fileContent = [System.IO.File]::ReadAllBytes($LocalFile)
        $request.ContentLength = $fileContent.Length
        
        $requestStream = $request.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()
        
        $response = $request.GetResponse()
        Write-Host "✓ Uploaded: $RemoteFile" -ForegroundColor Green
        $response.Close()
        return $true
    }
    catch {
        Write-Host "✗ Failed: $RemoteFile - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to create a directory
function Create-FtpDirectory {
    param (
        [string]$RemoteDir
    )
    
    try {
        $uri = "ftp://$ftpServer$RemoteDir"
        $request = [System.Net.FtpWebRequest]::Create($uri)
        $request.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $response = $request.GetResponse()
        $response.Close()
        Write-Host "✓ Created directory: $RemoteDir" -ForegroundColor Cyan
    }
    catch {
        # Directory might already exist, ignore error
    }
}

# Main upload process
Write-Host "Starting upload..." -ForegroundColor Cyan
Write-Host ""

$files = Get-ChildItem -Path $localPath -Recurse -File
$totalFiles = $files.Count
$uploadedFiles = 0
$failedFiles = 0

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring((Get-Item $localPath).FullName.Length)
    $remotePath = "$ftpRemotePath$($relativePath.Replace('\', '/'))"
    
    # Create directory if needed
    $remoteDir = Split-Path $remotePath -Parent
    if ($remoteDir -ne $ftpRemotePath) {
        Create-FtpDirectory -RemoteDir $remoteDir
    }
    
    # Upload file
    if (Upload-File -LocalFile $file.FullName -RemoteFile $remotePath) {
        $uploadedFiles++
    }
    else {
        $failedFiles++
    }
    
    $progress = [math]::Round(($uploadedFiles + $failedFiles) / $totalFiles * 100, 2)
    Write-Progress -Activity "Uploading files" -Status "$progress% Complete" -PercentComplete $progress
}

Write-Progress -Activity "Uploading files" -Completed

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Upload Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total files: $totalFiles" -ForegroundColor White
Write-Host "Uploaded: $uploadedFiles" -ForegroundColor Green
Write-Host "Failed: $failedFiles" -ForegroundColor Red
Write-Host ""

if ($failedFiles -eq 0) {
    Write-Host "✓ All files uploaded successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠ Some files failed to upload. Check the errors above." -ForegroundColor Yellow
}
