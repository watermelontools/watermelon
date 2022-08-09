# Azure

We use Azure as our backend. You should get access as soon as you start.

## Recommended extensions

This repo has MSSQL extension as recommended to be able to query the DB from VSCode.
To use it, create or open a SQL file and call the Command Palette, search for "MSSQL: Connect" and use this connection string, filling in the password:
`Server=tcp:watermelon.database.windows.net,1433;Initial Catalog=watermelon;Persist Security Info=False;User ID=watermelon;Password=;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`

With this, you can write any SQL and with the Command Palette call "MSSQL: Execute Current Statement" to view the results.
