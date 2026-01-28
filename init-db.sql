-- ============================================
-- Script de creación de base de datos AmbustockDB
-- ============================================

CREATE DATABASE AmbustockDB;
GO

USE AmbustockDB;
GO

-- Tabla: ambulancia
CREATE TABLE ambulancia (
    Id_ambulancia INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Matricula NVARCHAR(20) NOT NULL UNIQUE
);

-- Tabla: zonas
CREATE TABLE zonas (
    ID_zona INT PRIMARY KEY IDENTITY(1,1),
    nombre_zona NVARCHAR(100) NOT NULL,
    Id_ambulancia INT NOT NULL,
    CONSTRAINT FK_zonas_ambulancia FOREIGN KEY (Id_ambulancia) REFERENCES ambulancia(Id_ambulancia)
);

-- Tabla: cajones
CREATE TABLE cajones (
    Id_cajon INT PRIMARY KEY IDENTITY(1,1),
    Nombre_cajon NVARCHAR(100) NOT NULL,
    Id_zona INT NOT NULL,
    CONSTRAINT FK_cajones_zona FOREIGN KEY (Id_zona) REFERENCES zonas(ID_zona)
);

-- Tabla: materiales
CREATE TABLE materiales (
    Id_material INT PRIMARY KEY IDENTITY(1,1),
    nombre_Producto NVARCHAR(200) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    Id_zona INT NOT NULL,
    Id_cajon INT NULL,
    CONSTRAINT FK_materiales_zona FOREIGN KEY (Id_zona) REFERENCES zonas(ID_zona),
    CONSTRAINT FK_materiales_cajon FOREIGN KEY (Id_cajon) REFERENCES cajones(Id_cajon)
);

-- Tabla: servicio
CREATE TABLE servicio (
    Id_servicio INT PRIMARY KEY IDENTITY(1,1),
    fecha_hora DATETIME NOT NULL,
    nombre_servicio NVARCHAR(200)
);

-- Tabla: responsable
CREATE TABLE responsable (
    Id_responsable INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Responsable NVARCHAR(100) NOT NULL,
    Fecha_Servicio DATETIME
);

-- Tabla: usuarios
CREATE TABLE usuarios (
    Id_usuario INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Usuario NVARCHAR(100) NOT NULL,
    Rol NVARCHAR(50),
    email NVARCHAR(255),
    Password NVARCHAR(255) NOT NULL,
    Id_responsable INT NULL,
    CONSTRAINT FK_usuarios_responsable FOREIGN KEY (Id_responsable) REFERENCES responsable(Id_responsable)
);

-- Tabla: Servicio_Ambulancia
CREATE TABLE Servicio_Ambulancia (
    Id_servicioAmbulancia INT PRIMARY KEY IDENTITY(1,1),
    Id_Ambulancia INT NOT NULL,
    Id_Servicio INT NOT NULL,
    CONSTRAINT FK_ServicioAmb_Ambulancia FOREIGN KEY (Id_Ambulancia) REFERENCES ambulancia(Id_ambulancia),
    CONSTRAINT FK_ServicioAmb_Servicio FOREIGN KEY (Id_Servicio) REFERENCES servicio(Id_servicio)
);

-- Tabla: correo
CREATE TABLE correo (
    Id_Correo INT PRIMARY KEY IDENTITY(1,1),
    fecha_alerta DATETIME,
    tipo_problema NVARCHAR(200),
    Id_material INT,
    Id_usuario INT,
    CONSTRAINT FK_correo_material FOREIGN KEY (Id_material) REFERENCES materiales(Id_material),
    CONSTRAINT FK_correo_usuario FOREIGN KEY (Id_usuario) REFERENCES usuarios(Id_usuario)
);

-- Tabla: Reposicion
CREATE TABLE Reposicion (
    id_reposicion INT PRIMARY KEY IDENTITY(1,1),
    Id_Correo INT NOT NULL,
    Nombre_material NVARCHAR(200),
    Cantidad INT,
    Comentarios NVARCHAR(MAX),
    foto_evidencia VARBINARY(MAX),
    CONSTRAINT FK_Reposicion_correo FOREIGN KEY (Id_Correo) REFERENCES correo(Id_Correo)
);

-- Tabla: Detalle_Correo
CREATE TABLE Detalle_Correo (
    Id_detalleCorreo INT PRIMARY KEY IDENTITY(1,1),
    Id_material INT NOT NULL,
    Id_correo INT NOT NULL,
    CONSTRAINT FK_DetalleCorreo_material FOREIGN KEY (Id_material) REFERENCES materiales(Id_material),
    CONSTRAINT FK_DetalleCorreo_correo FOREIGN KEY (Id_correo) REFERENCES correo(Id_Correo)
);

CREATE TABLE Revisiones (
    Id_revision INT PRIMARY KEY IDENTITY(1,1),
    Id_ambulancia INT NOT NULL,
    Id_servicio INT NOT NULL,
    Nombre_Responsable NVARCHAR(200) NOT NULL,
    Fecha_Revision DATETIME NOT NULL,
    Total_Materiales INT NOT NULL,
    Materiales_Revisados INT NOT NULL,
    Estado NVARCHAR(50) NOT NULL,
    CONSTRAINT FK_Revisiones_ambulancia FOREIGN KEY (Id_ambulancia) REFERENCES ambulancia(Id_ambulancia),
    CONSTRAINT FK_Revisiones_servicio FOREIGN KEY (Id_servicio) REFERENCES servicio(Id_servicio)
);

-- Agregar columnas y FKs adicionales

ALTER TABLE servicio
ADD Id_responsable INT,
CONSTRAINT FK_servicio_responsable FOREIGN KEY (Id_responsable) REFERENCES responsable(Id_responsable);

ALTER TABLE responsable
ADD Id_servicio INT,
    Id_usuario INT,
    Id_Reposicion INT,
CONSTRAINT FK_responsable_servicio FOREIGN KEY (Id_servicio) REFERENCES servicio(Id_servicio),
CONSTRAINT FK_responsable_usuario FOREIGN KEY (Id_usuario) REFERENCES usuarios(Id_usuario),
CONSTRAINT FK_responsable_reposicion FOREIGN KEY (Id_Reposicion) REFERENCES Reposicion(id_reposicion);

ALTER TABLE usuarios
ADD Id_Correo INT,
CONSTRAINT FK_usuarios_correo FOREIGN KEY (Id_Correo) REFERENCES correo(Id_Correo);

ALTER TABLE correo
ADD Id_reposicion INT,
CONSTRAINT FK_correo_reposicion FOREIGN KEY (Id_reposicion) REFERENCES Reposicion(id_reposicion);
