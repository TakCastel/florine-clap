import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Import dynamique pour éviter le bundling côté client
    const { default: Client } = await import('ssh2-sftp-client')
    
    const password = request.nextUrl.searchParams.get('password')
    
    // Configuration depuis les variables d'environnement serveur
    const folder = process.env.SFTP_FOLDER || '/var/www/html/videos'
    const webPath = process.env.SFTP_WEB_PATH || '/videos' // Chemin web relatif (sans le chemin système)
    const host = process.env.SFTP_HOST
    const username = process.env.SFTP_USERNAME
    const port = parseInt(process.env.SFTP_PORT || '22')
    const baseUrl = process.env.SFTP_BASE_URL

    if (!host || !username || !password) {
      return NextResponse.json({ 
        error: 'Configuration SFTP manquante. Vérifiez vos variables d\'environnement (SFTP_HOST, SFTP_USERNAME) et le mot de passe.' 
      }, { status: 400 })
    }

    // Connexion SFTP
    const sftp = new Client()
    
    await sftp.connect({
      host,
      username,
      password,
      port
    })

    // Lister les fichiers dans le dossier
    const files = await sftp.list(folder)
    
    await sftp.end()

    // Filtrer pour ne garder que les fichiers vidéo
    const videoFiles = files
      .filter(file => {
        const ext = file.name.toLowerCase().split('.').pop()
        return ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'].includes(ext || '')
      })
      .map(file => {
        const videoBaseUrl = baseUrl || `http://${host}`
        const webVideoPath = `${webPath}/${file.name}`
        const videoUrl = `${videoBaseUrl}${webVideoPath}`
        return {
          name: file.name,
          size: file.size,
          modified: file.modifyTime,
          url: videoUrl,
          path: `${folder}/${file.name}`
        }
      })
      .sort((a, b) => {
        // Trier par date de modification (plus récent en premier)
        return new Date(b.modified).getTime() - new Date(a.modified).getTime()
      })

    return NextResponse.json({ 
      success: true,
      videos: videoFiles
    })

  } catch (error: any) {
    console.error('Erreur listage SFTP:', error)
    return NextResponse.json({ 
      error: `Erreur lors du listage: ${error.message}` 
    }, { status: 500 })
  }
}

