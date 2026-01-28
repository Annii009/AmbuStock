#!/bin/bash

echo "🗄️  Configurando base de datos AmbuStock..."
echo ""

# Orden de ejecución
scripts=(
  "01-CREATE_TABLES.sql"
  "02-insertsgenerales.sql"
  "03-Ambustock - AM50.2-Z Ampulario MED.sql"
  "04-Ambustock - AM50.2-Z Ampulario.sql"
  "05-Ambustock - AM50.2-Z Comprimidos.sql"
  "06-Ambustock - AM50.2-Z Morifcos.sql"
  "07-Ambustock - AM50.2-Z Nevera.sql"
  "08-Ambustock - BOT- PEDIATRICO AM50.2.sql"
  "09-Ambustock - BOT. IMV AM50.2.sql"
  "10-Ambustock - BOT. RESPIRA ADULTO AM50.2.sql"
  "11-Ambustock - BOT. SUTURAS AM50.2.sql"
  "12-Ambustock - BOT.QUEMADOS AM50.2.sql"
  "13-Ambustock - Cajones AM50.2.sql"
  "14-Ambustock - Estanterias AM50.2.sql"
  "15-Ambulancia2.sql"
)

for script in "${scripts[@]}"; do
  echo "📄 Ejecutando: $script"
  docker exec -i ambustock-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'P@ssw0rd2025!' -C -i "/sql-scripts/$script"
  
  if [ $? -eq 0 ]; then
    echo "✅ $script completado"
  else
    echo "❌ Error en $script"
    exit 1
  fi
  echo ""
done

echo "🎉 ¡Base de datos configurada correctamente!"
