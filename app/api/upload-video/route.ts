import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Import dynamique pour éviter le bundling côté client
    const { default: Client } = await import('ssh2-sftp-client')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const password = formData.get('password') as string
    
    // Configuration depuis les variables d'environnement serveur
    const folder = process.env.SFTP_FOLDER || '/var/www/html/videos'
    const webPath = process.env.SFTP_WEB_PATH || '/videos' // Chemin web relatif (sans le chemin système)
    const host = process.env.SFTP_HOST
    const username = process.env.SFTP_USERNAME
    const port = parseInt(process.env.SFTP_PORT || '22')
    const baseUrl = process.env.SFTP_BASE_URL

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    if (!host || !username || !password) {
      return NextResponse.json({ 
        error: 'Configuration SFTP manquante. Vérifiez vos variables d\'environnement (SFTP_HOST, SFTP_USERNAME) et le mot de passe.' 
      }, { status: 400 })
    }

    // Convertir le fichier en buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Connexion SFTP et upload
    const sftp = new Client()
    
    await sftp.connect({
      host,
      username,
      password,
      port
    })

    // Créer le dossier s'il n'existe pas
    try {
      await sftp.mkdir(folder, true)
    } catch (error) {
      // Le dossier existe peut-être déjà, on continue
    }

    // Vérifier si le fichier existe déjà et le supprimer
    const remotePath = `${folder}/${file.name}`
    let fileReplaced = false
    try {
      const exists = await sftp.exists(remotePath)
      if (exists) {
        await sftp.delete(remotePath)
        fileReplaced = true
      }
    } catch (error) {
      // Le fichier n'existe peut-être pas, on continue
    }

    // Upload du fichier
    await sftp.put(buffer, remotePath)

    await sftp.end()

    // Construire l'URL de la vidéo (utiliser le chemin web au lieu du chemin système)
    const videoBaseUrl = baseUrl || `http://${host}`
    const webVideoPath = `${webPath}/${file.name}`
    const videoUrl = `${videoBaseUrl}${webVideoPath}`

    const message = fileReplaced 
      ? `Vidéo remplacée avec succès : ${file.name} (l'ancienne version a été supprimée)`
      : `Vidéo uploadée avec succès : ${file.name}`

    return NextResponse.json({ 
      success: true, 
      url: videoUrl,
      path: remotePath,
      message,
      replaced: fileReplaced
    })

  } catch (error: any) {
    console.error('Erreur upload SFTP:', error)
    return NextResponse.json({ 
      error: `Erreur lors de l'upload: ${error.message}` 
    }, { status: 500 })
  }
}

