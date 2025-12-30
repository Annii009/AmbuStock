-- ============================================
-- Script de inserción - Zona ESTANTERIAS con cajones y materiales
-- ============================================

USE AmbustockDB;

-- Zona ESTANTERIAS
INSERT INTO zonas (nombre_zona, Id_ambulancia)
VALUES ('ESTANTERIAS', 1);

-- Cajones / estanterías en zona ESTANTERIAS (Id_zona = 12)
INSERT INTO cajones (Nombre_cajon, Id_zona) VALUES
('ESTANTERIA 1', 12),
('ESTANTERIA 2', 12),
('ESTANTERIA 3', 12),
('ESTANTERIA 4', 12),
('ESTANTERIA 5', 12),
('MONITOR', 12),
('SONDAS', 12),
('KIT DE PARTO', 12);

-- Materiales de ESTANTERIA 1 (Id_cajon = 13)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Quicktrack', 1, 12, 13),
('Intraosea adulto', 1, 12, 13),
('Intraosea pediatrica', 1, 12, 13),
('Pneumovent', 2, 12, 13),
('Pleurocath adulto', 1, 12, 13),
('Pleurocath infantil', 0, 12, 13),
('Trocar toracico', 1, 12, 13),
('Vented Hydrogel neumotorax', 1, 12, 13);

-- Materiales de ESTANTERIA 2 (Id_cajon = 14)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Venda algodón grande', 4, 12, 14),
('Vendaje triangular', 4, 12, 14),
('Manta termica', 4, 12, 14);

-- Materiales de ESTANTERIA 3 (Id_cajon = 15)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Crepe 10x10', 1, 12, 15),
('Crepe 7x4', 3, 12, 15),
('Crepe 5x4', 3, 12, 15);

-- Materiales de ESTANTERIA 4 (Id_cajon = 16)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Venda cohesiva 10x4', 4, 12, 16),
('Venda cohesiva 6x4', 3, 12, 16),
('Tensoplast 10x2,5', 4, 12, 16),
('Tensoplast 4x2,5', 3, 12, 16),
('Venda gasa 10x10', 0, 12, 16),
('Venda gasa 5x7', 0, 12, 16);

-- Materiales de ESTANTERIA 5 (Id_cajon = 17)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Omnifux 10x10', 1, 12, 17),
('Omnifix 20x10', 1, 12, 17),
('Esparadrapo tela 10x10', 2, 12, 17),
('Esparadrapo Antialergico', 1, 12, 17),
('Esparadrapo sintetico', 1, 12, 17),
('Aposito 5x7', 5, 12, 17),
('Tiritas caja', 1, 12, 17),
('Aposito 20x10 GRANDE', 4, 12, 17),
('Aposito 10x10 MEDIANO', 8, 12, 17);

-- Materiales de MONITOR (Id_cajon = 18)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Electrodos adulto', 1, 12, 18),
('Gel', 1, 12, 18),
('Capnografo (valvula)', 3, 12, 18),
('Electrodos adulto DESA', 1, 12, 18),
('Electrodos pediatrico DESA', 1, 12, 18),
('Electrodos pediatricos', 1, 12, 18);

-- Materiales de SONDAS (Id_cajon = 19)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Sonda 14', 1, 12, 19),
('Sonda 16', 1, 12, 19),
('Sonda 18', 1, 12, 19),
('Sonda 8', 1, 12, 19),
('Sonda 6', 1, 12, 19),
('Canula Yankaouer nº1', 1, 12, 19),
('Canula Yankaouer nº3', 1, 12, 19),
('Jeringa 50ml', 1, 12, 19),
('Alargadera', 1, 12, 19);

-- Materiales de KIT DE PARTO (Id_cajon = 20)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Compresas', 3, 12, 20),
('Manta térmica', 1, 12, 20),
('Tijera mosquito', 1, 12, 20),
('Tijera normal', 2, 12, 20),
('Pinzas cordon', 0, 12, 20);
