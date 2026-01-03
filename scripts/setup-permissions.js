#!/usr/bin/env node

/**
 * Script simple pour configurer les permissions Directus
 * Exécute SQL directement dans le container PostgreSQL
 */

const { execSync } = require('child_process')

const SQL = `
-- Configure les permissions publiques pour toutes les collections
DO $$
DECLARE
    policy_id UUID;
    collection_name TEXT;
    collections TEXT[] := ARRAY['films', 'mediations', 'actus', 'pages', 'videos_art', 'home_settings', 'directus_files'];
BEGIN
    -- Récupérer le policy Public (non-admin)
    SELECT id INTO policy_id FROM directus_policies WHERE admin_access = false LIMIT 1;
    
    -- Si aucun policy public, utiliser le premier policy non-admin
    IF policy_id IS NULL THEN
        SELECT id INTO policy_id FROM directus_policies WHERE name LIKE '%public%' OR name LIKE '%Public%' LIMIT 1;
    END IF;
    
    -- Si toujours NULL, prendre le premier policy
    IF policy_id IS NULL THEN
        SELECT id INTO policy_id FROM directus_policies ORDER BY admin_access LIMIT 1;
    END IF;
    
    -- Activer app_access pour le policy Public (nécessaire pour accéder à l'API)
    UPDATE directus_policies SET app_access = true WHERE id = policy_id;
    
    -- Configurer les permissions pour chaque collection
    FOREACH collection_name IN ARRAY collections
    LOOP
        IF EXISTS (
            SELECT 1 FROM directus_permissions 
            WHERE collection = collection_name AND policy = policy_id AND action = 'read'
        ) THEN
            UPDATE directus_permissions 
            SET fields = '["*"]', permissions = '{}', validation = NULL, presets = NULL
            WHERE collection = collection_name AND policy = policy_id AND action = 'read';
        ELSE
            INSERT INTO directus_permissions (collection, action, permissions, validation, presets, fields, policy)
            VALUES (collection_name, 'read', '{}', NULL, NULL, '["*"]', policy_id);
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Permissions configurées pour le policy %', policy_id;
END $$;
`

try {
  console.log('🔐 Configuration des permissions Directus...\n')
  
  // Vérifier que le container existe
  try {
    execSync('docker ps --filter name=florine-clap-postgres --format "{{.Names}}"', { encoding: 'utf-8' })
  } catch {
    console.error('❌ Container PostgreSQL non trouvé')
    console.error('   Lancez: docker-compose up -d')
    process.exit(1)
  }
  
  // Exécuter le SQL
  const result = execSync(
    `docker exec -i florine-clap-postgres psql -U directus -d directus`,
    { input: SQL, encoding: 'utf-8' }
  )
  
  console.log('✅ Permissions configurées avec succès!\n')
  console.log('💡 Rechargez la page /videos-art')
  
} catch (error) {
  console.error('❌ Erreur:', error.message)
  console.error('\n💡 Alternative: Configurez manuellement dans Directus')
  console.error('   Settings > Roles & Permissions > Public > Read: All Access')
  process.exit(1)
}

