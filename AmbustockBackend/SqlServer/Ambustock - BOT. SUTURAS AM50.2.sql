-- ============================================
-- Script de inserción - Zona BOTIQUIN SUTURAS
-- ============================================

USE AmbustockDB;

-- 2) Zona BOTIQUIN SUTURAS
INSERT INTO zonas (nombre_zona, Id_ambulancia)
VALUES ('BOTIQUIN SUTURAS', 1);

-- 3) Materiales del botiquín de suturas
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Campo esteril', 3, 9, NULL),
('Campo esteril fenestrado', 3, 9, NULL),
('Apositos 20x10', 4, 9, NULL),
('Apositos 10x10', 2, 9, NULL),
('Apositos 5x7', 5, 9, NULL),
('Punto sutura adhesivo', 1, 9, NULL),
('Aguja 25g', 6, 9, NULL),
('Aguja 21g', 6, 9, NULL),
('Aguja 20g', 5, 9, NULL),
('Jeringa 2ml', 1, 9, NULL),
('Kocher', 3, 9, NULL),
('Pinza mosquito', 1, 9, NULL),
('Jeringa 5ml', 1, 9, NULL),
('Jeringa insulina', 2, 9, NULL),
('Pinza mosquito curva', 2, 9, NULL),
('Tijera curva', 2, 9, NULL),
('Tijera', 2, 9, NULL),
('Pinza disección', 3, 9, NULL),
('Pinza disección con dientes', 1, 9, NULL),
('Seda 5/0', 3, 9, NULL),
('Seda 4/0', 2, 9, NULL),
('Seda 3/0', 3, 9, NULL),
('Compresa gasa 10x20', 2, 9, NULL),
('Gasas 20x20', 3, 9, NULL),
('Tijera corte', 1, 9, NULL),
('Bisturí', 1, 9, NULL),
('Guantes esteriles M', 2, 9, NULL),
('Guantes esteriles S', 2, 9, NULL),
('Guantes esteriles L', 2, 9, NULL),
('Grapadora', 2, 9, NULL);
