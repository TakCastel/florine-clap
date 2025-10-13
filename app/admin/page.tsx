export default function AdminPage() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Content Manager</title>
      </head>
      <body>
        {/* Include the script that builds the page and powers Decap CMS */}
        <script src="https://unpkg.com/decap-cms-app@3.6.0/dist/decap-cms.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              DecapCMS.init();
            `
          }}
        />
      </body>
    </html>
  )
}
