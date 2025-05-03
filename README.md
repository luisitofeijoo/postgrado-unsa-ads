# Proyecto Postgrado UNSA ADS

**Grupo 3 - Integrantes:**
- Carrasco Reynoso Alcira Angela
- Feijoo Valeriano Luis Miguel
- Huanca Serruto David Alonso
- Pacco Huamani Gabriela
- Pantaleón Ccoa Arturo H.
- Vilca Quispe Ronal Ever
- Vizcarra Ylaquita Jenifer Stephanie

Este es un sistema web desarrollado con Laravel y Node.js como parte del proyecto de Postgrado de la Universidad Nacional de San Agustín de Arequipa.

## Requisitos

- PHP >= 8.0
- Composer
- Node.js y NPM
- MySQL o equivalente
- Git

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto en tu entorno local:

```bash
# 1. Clona el repositorio
git clone https://github.com/luisitofeijoo/postgrado-unsa-ads.git
cd postgrado-unsa-ads

# 2. Instala las dependencias de PHP
composer install

# 3. Instala las dependencias de JavaScript
npm install

# 4. Copia el archivo de entorno
cp .env.example .env

# 5. Genera la clave de la aplicación
php artisan key:generate

# 6. (Opcional) Configura tu base de datos en el archivo .env y aplica migraciones si es necesario
# php artisan migrate

# 7. Inicia el servidor backend
php artisan serve

# 8. Compila los recursos frontend
npm run dev   # Para desarrollo
# o
npm run build # Para producción
