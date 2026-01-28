-- ============================================
-- Script de inserción - Zona BOTIQUIN QUEMADOS
-- ============================================

USE AmbustockDB;

-- 2) Zona BOTIQUIN QUEMADOS
INSERT INTO zonas (nombre_zona, Id_ambulancia)
VALUES ('BOTIQUIN QUEMADOS', 1);

-- 3) Materiales del botiquín de quemados
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Burnshield hidrogel pequeño', 3, 10, NULL),
('Burnshield hidrogel 200X450', 0, 10, NULL),
('Burnshield hidrogel cuerpo entero', 1, 10, NULL),
('Burnshield 50ml', 1, 10, NULL),
('Linitul 5.5x8', 1, 10, NULL),
('Furacin', 1, 10, NULL),
('Tireja corta ropa', 1, 10, NULL),
('Guantes esteriles S', 2, 10, NULL),
('Guantes esteriles M', 2, 10, NULL),
('Guantes esteriles L', 2, 10, NULL),
('Venda crepe 7cm', 1, 10, NULL),
('Venda crepe 10cm', 1, 10, NULL);
