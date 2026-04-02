# Deploy — humedales.cercu.com.mx

Sigue el mismo patron que `guardianes.cercu.com.mx` y `observatorio.cercu.com.mx`:
- Nuxt node-server + PM2 en puerto 3005
- Nginx reverse proxy con subdominio
- Proyecto en `/var/www/cercu-frontend/humedales/`

## 1. DNS

Agregar registro A en tu proveedor de DNS:

```
Tipo: A
Nombre: humedales
Valor: 72.62.200.124
```

## 2. Subir proyecto al servidor

```bash
# Desde tu maquina local
rsync -avz --exclude node_modules --exclude .nuxt --exclude .output --exclude .git \
  . root@72.62.200.124:/var/www/cercu-frontend/humedales/
```

## 3. En el servidor (SSH)

```bash
ssh root@72.62.200.124

# Instalar dependencias y construir
cd /var/www/cercu-frontend/humedales
npm install
npm run build

# Agregar a PM2 del ecosystem existente
# Opcion A: agregar la entrada de humedales al ecosystem.config.cjs existente
# Opcion B: iniciar directamente:
pm2 start .output/server/index.mjs --name humedales -- --port 3005
pm2 save
```

## 4. Configurar Nginx

Agregar el bloque del server a la config existente de cercu:

```bash
# Editar la config de nginx (Alpine Linux)
nano /etc/nginx/http.d/cercu.conf

# Agregar el bloque de deploy/nginx.conf al final del archivo
# (server block para humedales.cercu.com.mx → proxy_pass 127.0.0.1:3005)

# Verificar y recargar
nginx -t
rc-service nginx reload
```

## 5. SSL con certbot

```bash
certbot --nginx -d humedales.cercu.com.mx
```

## 6. Verificar

```bash
curl -I https://humedales.cercu.com.mx
pm2 status
```

## Actualizar (despues del deploy inicial)

```bash
# Desde local
rsync -avz --exclude node_modules --exclude .nuxt --exclude .output --exclude .git \
  . root@72.62.200.124:/var/www/cercu-frontend/humedales/

# En el servidor
ssh root@72.62.200.124
cd /var/www/cercu-frontend/humedales
npm install
npm run build
pm2 restart humedales
```

## Alternativa: usar deploy.sh de cercu

El `deploy.sh` de cercu-frontend ya incluye el paso de humedales.
Solo ejecuta `bash deploy.sh` en el servidor.
