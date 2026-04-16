$sh = New-Object -ComObject Shell.Application
$bin = $sh.NameSpace(10)
foreach ($item in $bin.Items()) {
    if ($item.Name -match "style.css|main.js") {
        Write-Host "FOUND: $($item.Name) at $($item.Path)"
    }
}
