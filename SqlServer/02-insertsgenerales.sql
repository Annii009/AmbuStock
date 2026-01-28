USE AmbustockDB;
GO

-- 1) SERVICIO
INSERT INTO servicio (fecha_hora, nombre_servicio)
VALUES
    ('2026-01-01 08:30:00', N'Retén de tarde'),
    ('2026-01-01 12:15:00', N'Fútbol Romareda'),
    ('2026-01-02 03:45:00', N'Baloncesto Príncipe Felipe'),
    ('2026-01-01 06:45:00', N'Retén de Mañana'),
    ('2026-01-01 12:30:00', N'Fútbol Romareda femenino'),
    ('2026-01-02 16:00:00', N'Cabalgata Reyes Magos');
GO

-- 2) RESPONSABLE (sin FKs)
INSERT INTO responsable (Nombre_Responsable, Fecha_Servicio)
VALUES
    (N'Juan Pérez', '2026-01-01 08:30:00'),
    (N'Ana Gómez', '2026-01-01 12:15:00'),
    (N'Luis Martínez', '2026-01-02 03:45:00');
GO

-- 3) USUARIOS (sin Id_responsable ni Id_Correo)
INSERT INTO usuarios (Nombre_Usuario, Rol, email, Password)
VALUES
    (N'admin', N'Administrador', N'admin@ambustock.local', N'Admin123!'),
    (N'jefe_guardia', N'Supervisor', N'jefe.guardias@ambustock.local', N'Super123!'),
    (N'operador1', N'Operador', N'operador1@ambustock.local', N'Oper123!');
GO

-- 4) VINCULAR SERVICIO <-> RESPONSABLE
UPDATE servicio SET Id_responsable = 1 WHERE Id_servicio = 1;
UPDATE servicio SET Id_responsable = 2 WHERE Id_servicio = 2;
UPDATE servicio SET Id_responsable = 3 WHERE Id_servicio = 3;

UPDATE responsable SET Id_servicio = 1 WHERE Id_responsable = 1;
UPDATE responsable SET Id_servicio = 2 WHERE Id_responsable = 2;
UPDATE responsable SET Id_servicio = 3 WHERE Id_responsable = 3;
GO

-- 5) SERVICIO_AMBULANCIA
INSERT INTO Servicio_Ambulancia (Id_Ambulancia, Id_Servicio)
VALUES
    (1, 1),
    (1, 2),
    (1, 3);
GO

-- 6) CORREO - USA LOS PRIMEROS 3 MATERIALES QUE EXISTAN
DECLARE @Mat1 INT, @Mat2 INT, @Mat3 INT;

SELECT TOP 1 @Mat1 = Id_material FROM materiales ORDER BY Id_material;
SELECT @Mat2 = Id_material FROM materiales WHERE Id_material > @Mat1 ORDER BY Id_material OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;
SELECT @Mat3 = Id_material FROM materiales WHERE Id_material > @Mat2 ORDER BY Id_material OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;

INSERT INTO correo (fecha_alerta, tipo_problema, Id_material, Id_usuario)
VALUES
    ('2026-01-01 09:00:00', N'Nivel bajo de stock', @Mat1, 1),
    ('2026-01-01 13:00:00', N'Faltan materiales', @Mat2, 3),
    ('2026-01-02 04:00:00', N'Caducidad próxima', @Mat3, 2);
GO

-- 7) DETALLE_CORREO
DECLARE @Mat1 INT, @Mat2 INT, @Mat3 INT;

SELECT TOP 1 @Mat1 = Id_material FROM materiales ORDER BY Id_material;
SELECT @Mat2 = Id_material FROM materiales WHERE Id_material > @Mat1 ORDER BY Id_material OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;
SELECT @Mat3 = Id_material FROM materiales WHERE Id_material > @Mat2 ORDER BY Id_material OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;

INSERT INTO Detalle_Correo (Id_material, Id_correo)
VALUES
    (@Mat1, 1),
    (@Mat2, 2),
    (@Mat3, 3);
GO

-- 8) REPOSICION
INSERT INTO Reposicion (Id_Correo, Nombre_material, Cantidad, Comentarios, foto_evidencia)
VALUES
    (1, N'Material de reposición 1', 10, N'Repuesto stock mínimo', NULL),
    (2, N'Material de reposición 2', 50, N'Reposición estándar', NULL),
    (3, N'Material de reposición 3', 5, N'Revisión caducidad', NULL);
GO

-- 9) VINCULAR RESPONSABLE -> USUARIO / REPOSICION
UPDATE responsable SET Id_usuario = 2, Id_Reposicion = 1 WHERE Id_responsable = 1;
UPDATE responsable SET Id_usuario = 1, Id_Reposicion = 2 WHERE Id_responsable = 2;
UPDATE responsable SET Id_usuario = 3, Id_Reposicion = 3 WHERE Id_responsable = 3;
GO

-- 10) VINCULAR USUARIOS -> RESPONSABLE
UPDATE usuarios SET Id_responsable = 1 WHERE Id_usuario = 1;
UPDATE usuarios SET Id_responsable = 2 WHERE Id_usuario = 2;
UPDATE usuarios SET Id_responsable = 3 WHERE Id_usuario = 3;
GO

-- 11) VINCULAR USUARIOS -> CORREO
UPDATE usuarios SET Id_Correo = 1 WHERE Id_usuario = 1;
UPDATE usuarios SET Id_Correo = 2 WHERE Id_usuario = 2;
UPDATE usuarios SET Id_Correo = 3 WHERE Id_usuario = 3;
GO

-- 12) VINCULAR CORREO -> REPOSICION
UPDATE correo SET Id_reposicion = 1 WHERE Id_Correo = 1;
UPDATE correo SET Id_reposicion = 2 WHERE Id_Correo = 2;
UPDATE correo SET Id_reposicion = 3 WHERE Id_Correo = 3;
GO
