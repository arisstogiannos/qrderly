Param (
    [Parameter(Mandatory = $true)]
    [string]$Message
)

pnpm check:fix
git add .
git commit -m "$Message"