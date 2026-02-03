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

### 1. Requisitos previos
* Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/).
* Git instalado en tu sistema.

### 2. Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/AmbuStock.git](https://github.com/tu-usuario/AmbuStock.git)
cd AmbuStock
