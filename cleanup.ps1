# Backup the current Angular app (just in case)
Write-Host "Backing up Angular app..."
Copy-Item -Path "C:\GFT\Project\skills-angular\skills-angular-app" -Destination "C:\GFT\Project\skills-angular\angular-app-backup" -Recurse

# Make sure we're not deleting the Angular app itself
if (-Not (Test-Path "C:\GFT\Project\skills-angular\angular-app-backup")) {
    Write-Host "Failed to create backup. Aborting."
    exit 1
}

# Remove React-specific files and folders
Write-Host "Removing React files and folders..."
$reactFolders = @(
    "build",
    "public",
    "src",
    "components",
    "styles"
)

foreach ($folder in $reactFolders) {
    $path = "C:\GFT\Project\skills-angular\$folder"
    if (Test-Path $path) {
        Remove-Item -Path $path -Recurse -Force
        Write-Host "Removed: $folder"
    }
}

# Remove React config files
$reactFiles = @(
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "README.old.md"
)

foreach ($file in $reactFiles) {
    $path = "C:\GFT\Project\skills-angular\$file"
    if (Test-Path $path) {
        Remove-Item -Path $path -Force
        Write-Host "Removed: $file"
    }
}

# Move Angular app to root
Write-Host "Moving Angular app to root..."
$angularItems = Get-ChildItem -Path "C:\GFT\Project\skills-angular\skills-angular-app" -Force

foreach ($item in $angularItems) {
    $destination = "C:\GFT\Project\skills-angular\" + $item.Name
    Copy-Item -Path $item.FullName -Destination $destination -Recurse -Force
    Write-Host "Moved: $($item.Name)"
}

# After successful move, remove the skills-angular-app folder
if (Test-Path "C:\GFT\Project\skills-angular\node_modules") {
    Remove-Item -Path "C:\GFT\Project\skills-angular\skills-angular-app" -Recurse -Force
    Write-Host "Removed: skills-angular-app"
    
    # Also remove the backup
    Remove-Item -Path "C:\GFT\Project\skills-angular\angular-app-backup" -Recurse -Force
    Write-Host "Removed: angular-app-backup"
} else {
    Write-Host "Moving Angular app failed. Backup remains at angular-app-backup."
}

Write-Host "Cleanup complete. React code has been removed, Angular app is now in the root directory."
