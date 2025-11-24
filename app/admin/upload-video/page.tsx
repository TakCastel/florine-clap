'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './page.module.css'

interface VideoFile {
  name: string
  size: number
  modified: number
  url: string
  path: string
}

export default function UploadVideoPage() {
  const [mounted, setMounted] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [result, setResult] = useState<{ success: boolean; message: string; url?: string } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [videos, setVideos] = useState<VideoFile[]>([])
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [showExplorer, setShowExplorer] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile)
      setResult(null)
    } else {
      setResult({ success: false, message: 'Veuillez sélectionner un fichier vidéo' })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setResult({ success: false, message: 'Veuillez sélectionner un fichier vidéo' })
      return
    }

    if (!password) {
      setResult({ success: false, message: 'Veuillez entrer le mot de passe SFTP' })
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', password)

      // Utiliser XMLHttpRequest pour suivre la progression
      const xhr = new XMLHttpRequest()

      // Suivre la progression de l'envoi (limiter à 90% car le serveur doit encore traiter)
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          // Limiter à 90% pendant l'envoi, les 10% restants seront ajoutés quand le serveur répond
          const percentComplete = Math.round((event.loaded / event.total) * 90)
          setUploadProgress(percentComplete)
        }
      })

      // Quand l'envoi est terminé mais on attend la réponse
      xhr.upload.addEventListener('load', () => {
        setUploadProgress(95)
      })

      // Gérer la réponse complète
      xhr.addEventListener('loadend', () => {
        setUploadProgress(100)
        setUploading(false)
        
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText)
            setResult({ 
              success: true, 
              message: data.message || `✅ Vidéo uploadée avec succès : ${file.name}`,
              url: data.url 
            })
            setFile(null)
            // Ne pas effacer le mot de passe pour permettre de lister les vidéos
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
            // Recharger la liste des vidéos après un upload réussi
            setTimeout(() => {
              if (password) {
                loadVideos()
              }
            }, 1500)
          } catch (error) {
            setResult({ success: false, message: 'Erreur lors du traitement de la réponse' })
            setUploadProgress(0)
          }
        } else {
          try {
            const data = JSON.parse(xhr.responseText)
            setResult({ success: false, message: data.error || 'Erreur lors de l\'upload' })
          } catch (error) {
            setResult({ success: false, message: 'Erreur lors de l\'upload' })
          }
          setUploadProgress(0)
        }
      })

      // Gérer les erreurs
      xhr.addEventListener('error', () => {
        setResult({ success: false, message: 'Erreur de connexion lors de l\'upload' })
        setUploading(false)
        setUploadProgress(0)
      })

      // Gérer l'annulation
      xhr.addEventListener('abort', () => {
        setResult({ success: false, message: 'Upload annulé' })
        setUploading(false)
        setUploadProgress(0)
      })

      // Timeout après 5 minutes
      xhr.timeout = 300000 // 5 minutes
      xhr.addEventListener('timeout', () => {
        setResult({ success: false, message: 'Upload timeout - le fichier est peut-être trop volumineux' })
        setUploading(false)
        setUploadProgress(0)
      })

      // Envoyer la requête
      xhr.open('POST', '/api/upload-video')
      xhr.send(formData)

    } catch (error: any) {
      setResult({ success: false, message: `Erreur: ${error.message}` })
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('URL copiée dans le presse-papiers !')
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const loadVideos = async () => {
    if (!password) {
      setResult({ success: false, message: 'Veuillez entrer le mot de passe SFTP pour lister les vidéos' })
      return
    }

    setLoadingVideos(true)
    try {
      const response = await fetch(`/api/list-videos?password=${encodeURIComponent(password)}`)
      const data = await response.json()

      if (response.ok) {
        setVideos(data.videos || [])
        setShowExplorer(true)
      } else {
        setResult({ success: false, message: data.error || 'Erreur lors du chargement des vidéos' })
      }
    } catch (error: any) {
      setResult({ success: false, message: `Erreur: ${error.message}` })
    } finally {
      setLoadingVideos(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!mounted) {
    return (
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Upload Vidéo</h2>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.headerTitle}>Upload de vidéo</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Upload Vidéo</h2>
        
        <div className={styles.sidebarLinkContainer}>
          <a href="/admin" className={styles.sidebarLink}>
            ← Retour au CMS
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Upload de vidéo</h1>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Zone de drag & drop */}
            <div
              ref={dropZoneRef}
              className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ''} ${file ? styles.dropZoneHasFile : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              <input
                ref={fileInputRef}
                id="video-file"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className={styles.hiddenInput}
              />
              {file ? (
                <div className={styles.fileSelected}>
                  <div className={styles.fileIcon}>📹</div>
                  <div className={styles.fileName}>{file.name}</div>
                  <div className={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    className={styles.removeButton}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className={styles.dropZoneContent}>
                  <div className={styles.dropZoneIcon}>📤</div>
                  <div className={styles.dropZoneText}>
                    Glissez-déposez votre vidéo ici
                  </div>
                  <div className={styles.dropZoneSubtext}>
                    ou cliquez pour sélectionner un fichier
                  </div>
                </div>
              )}
            </div>

            {/* Champ mot de passe */}
            <div>
              <label className={styles.label}>
                Mot de passe SFTP *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={styles.input}
              />
              <p className={styles.helpText}>
                Le mot de passe n'est pas stocké et est demandé à chaque upload
              </p>
            </div>

            {/* Barre de progression */}
            {uploading && (
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className={styles.progressText}>
                  {uploadProgress < 90 
                    ? `${uploadProgress}% - Envoi en cours...`
                    : uploadProgress < 100
                    ? `${uploadProgress}% - Traitement sur le serveur...`
                    : '100% - Finalisation...'}
                </div>
              </div>
            )}

            {/* Bouton d'upload */}
            <div>
              <button
                type="submit"
                disabled={uploading || !file || !password}
                className={styles.button}
              >
                {uploading ? `Upload en cours... ${uploadProgress}%` : 'Uploader la vidéo'}
              </button>
            </div>
          </form>

          {/* Résultat */}
          {result && (
            <div className={`${styles.result} ${result.success ? styles.resultSuccess : styles.resultError}`}>
              <div className={styles.resultContent}>
                <div className={`${styles.resultIcon} ${result.success ? styles.resultIconSuccess : styles.resultIconError}`}>
                  {result.success ? '✓' : '✕'}
                </div>
                <div className={styles.resultMessage}>
                  <p className={`${styles.resultText} ${result.success ? styles.resultTextSuccess : styles.resultTextError}`}>
                    {result.message}
                  </p>
                  {result.success && result.url && (
                    <div className={styles.urlContainer}>
                      <p className={styles.urlLabel}>
                        URL de la vidéo :
                      </p>
                      <div className={styles.urlInputContainer}>
                        <input
                          type="text"
                          value={result.url}
                          readOnly
                          className={styles.urlInput}
                        />
                        <button
                          onClick={() => copyUrl(result.url!)}
                          className={styles.copyButton}
                        >
                          Copier
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Explorateur de fichiers */}
          <div className={styles.explorerSection}>
            <div className={styles.explorerHeader}>
              <h2 className={styles.explorerTitle}>Vidéos disponibles</h2>
              <button
                type="button"
                onClick={loadVideos}
                disabled={loadingVideos || !password}
                className={styles.refreshButton}
              >
                {loadingVideos ? 'Chargement...' : '🔄 Actualiser'}
              </button>
            </div>
            <p className={styles.explorerHelp}>
              Entrez votre mot de passe SFTP ci-dessus et cliquez sur "Actualiser" pour voir les vidéos uploadées.
              Cliquez sur "Copier" pour copier l'URL à coller dans Decap CMS.
            </p>
            
            {showExplorer && (
              <div className={styles.videoList}>
                {videos.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>Aucune vidéo trouvée dans le dossier.</p>
                  </div>
                ) : (
                  videos.map((video, index) => (
                    <div key={index} className={styles.videoItem}>
                      <div className={styles.videoInfo}>
                        <div className={styles.videoName}>{video.name}</div>
                        <div className={styles.videoMeta}>
                          <span>{formatFileSize(video.size)}</span>
                          <span>•</span>
                          <span>{formatDate(video.modified)}</span>
                        </div>
                      </div>
                      <div className={styles.videoUrlContainer}>
                        <input
                          type="text"
                          value={video.url}
                          readOnly
                          className={styles.videoUrlInput}
                          onClick={(e) => e.currentTarget.select()}
                        />
                        <button
                          type="button"
                          onClick={() => copyUrl(video.url)}
                          className={styles.copyUrlButton}
                        >
                          📋 Copier
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
