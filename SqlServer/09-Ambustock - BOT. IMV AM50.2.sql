-- ============================================
-- Script de inserción - Zona BOTIQUIN IMV
-- ============================================

USE AmbustockDB;

-- 2) Zona BOTIQUIN IMV
INSERT INTO zonas (nombre_zona, Id_ambulancia)
VALUES ('BOTIQUIN IMV', 1);

-- 3) Materiales del BOTIQUIN IMV
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Vendaje israelí', 1, 7, NULL),
('Venda crepe 10x10', 1, 7, NULL),
('Tijera ropa', 1, 7, NULL),
('Esponja hemostatica', 0, 7, NULL),
('Guedel 7', 1, 7, NULL),
('Guedel 8', 1, 7, NULL),
('Guedel 10', 1, 7, NULL),
('Guedel 12', 1, 7, NULL),
('Jeringa 10ml', 4, 7, NULL),
('Aguja 20G', 5, 7, NULL),
('Ketolar 50mg (ketamina)', 1, 7, NULL),
('Midazolam 5mg', 4, 7, NULL);
