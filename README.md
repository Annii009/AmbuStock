# 🚑 AmbuStock

**AmbuStock** es una solución integral diseñada para la gestión y control de inventario de suministros médicos en unidades de emergencia. El sistema permite monitorizar existencias en tiempo real, gestionar reposiciones y asegurar que cada ambulancia cuente con el material crítico necesario para salvar vidas.

El proyecto está totalmente **dockerizado**, utilizando una arquitectura de microservicios para garantizar un despliegue consistente en cualquier entorno.

---

## 🛠️ Stack Tecnológico

* **Backend:** .NET 8 / ASP.NET Core API
* **Frontend:** Aplicación Web (Dockerizada)
* **Base de Datos:** SQL Server 2022 (con scripts de auto-inicialización)
* **Proxy/Gateway:** Nginx (Reverse Proxy)
* **Orquestación:** Docker Compose

---

## 🚀 Instalación y Despliegue

Sigue estos pasos para poner en marcha el entorno local en pocos minutos.

### Requisitos previos
* Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/).
* Git instalado en tu sistema.

### Clonar el repositorio
### Importante clonarlo con los submodules
```bash
git clone --recurse-submodules https://github.com/Annii009/AmbuStock.git
cd AmbuStock

```

### Inicializar la página web
```bash
docker compose build
docker compose up
```

### Para cuando la base de datos se queda pillada
```bash
docker compose down -v
docker compose up --build
```

### Cosas a tener en cuenta
La página web tiene dos formatos, el de móvil y el de ordenador. El formato móvil esta pensado para los trabajadores o voluntarios que hacen la revisión y la reposición de la ambulancia. Y la versión ordenador esta pensada para aquellos trabajadores que son administradores o encargados del material.