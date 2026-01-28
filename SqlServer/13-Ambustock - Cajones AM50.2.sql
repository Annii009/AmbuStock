-- ============================================
-- Script de inserción - Zona CAJONES con cajones y materiales
-- ============================================

USE AmbustockDB;

-- Zona CAJONES
INSERT INTO zonas (nombre_zona, Id_ambulancia)
VALUES ('CAJONES', 1);

-- Cajones dentro de la zona CAJONES (Id_zona = 11)
INSERT INTO cajones (Nombre_cajon, Id_zona) VALUES
('ARMARIO SUEROS', 11),
('CAJON 1', 11),
('CAJON 2', 11),
('CAJON 3 (ADULTO)', 11),
('CAJON 4 (PEDIATRICO)', 11),
('CAJON 5', 11),
('CAJON 6', 11),
('CAJON 7', 11),
('KIT INTUBACION ADULTO', 11),
('CAJON 10', 11),
('CAJON 11', 11),
('CAJON 12', 11);

-- Materiales del ARMARIO SUEROS (Id_cajon = 1)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Gasas 20x20', 14, 11, 1),
('Compresas 10x20', 8, 11, 1),
('Clorhexidina 10mg/125ml', 1, 11, 1),
('Clorhexidina 30 ml', 2, 11, 1),
('Alcohol', 1, 11, 1),
('Agua oxigenada', 1, 11, 1),
('Suero 30 ml', 8, 11, 1),
('Betadine', 1, 11, 1),
('Vetolin', 0, 11, 1),
('Atrovent', 0, 11, 1),
('Diazepam rectal 5mg', 1, 11, 1),
('Diazepam rectal 10 mg', 1, 11, 1),
('Venofusin', 0, 11, 1),
('Suero fisiologico 100 ml', 1, 11, 1),
('Suero fisiologico 250 ml', 2, 11, 1),
('Paracetamol 100 ml', 3, 11, 1),
('Suero fisiologico 500 ml', 2, 11, 1),
('Lactato de Ringer', 2, 11, 1),
('Glucosado 5% 500 ml', 3, 11, 1),
('Glucosado 250 ml', 1, 11, 1),
('Glucosado 100 ml', 3, 11, 1),
('Glucosalino isotonico 0,3 500 ml', 3, 11, 1),
('Gelespan 500 ml', 2, 11, 1),
('Llondol pediatrico', 1, 11, 1),
('Apositos via', 6, 11, 1),
('Venda cohesiva 6x4', 1, 11, 1),
('Llave 3 vias', 4, 11, 1),
('Tapón via', 2, 11, 1),
('Llave simple', 3, 11, 1);

-- Materiales del CAJON 1 (Id_cajon = 2)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Parches adulto DESA', 1, 11, 2),
('Parches pediatrico DESA', 1, 11, 2),
('Gel conductor', 1, 11, 2);

-- Materiales del CAJON 2 (Id_cajon = 3)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Guedel pediatrico 3.5', 2, 11, 3),
('Guedel pediatrico 5', 3, 11, 3),
('Guedel pediatrico 5.5', 1, 11, 3),
('Guedel pediatrico 6.5', 1, 11, 3),
('Guedel adulto 7', 2, 11, 3),
('Guedel adulto 8', 1, 11, 3),
('Guedel adulto 9', 1, 11, 3),
('Guedel adulto 10', 2, 11, 3),
('Guedel adulto 12', 3, 11, 3);

-- Materiales del CAJON 3 (ADULTO) (Id_cajon = 4)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Gafas nasales', 1, 11, 4),
('Mascarilla traqueo', 1, 11, 4),
('Mascarilla nebulizador', 2, 11, 4),
('Mascarilla reservorio', 1, 11, 4),
('Mascarilla flujo', 2, 11, 4);

-- Materiales del CAJON 4 (PEDIATRICO) (Id_cajon = 5)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Mascarilla flujo', 2, 11, 5),
('Gafas nasales', 2, 11, 5),
('Mascarilla reservorio', 2, 11, 5),
('Mascarilla nebulizador', 2, 11, 5);

-- Materiales del CAJON 5 (Id_cajon = 6)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Agua bidestilada 10 ml', 2, 11, 6),
('Jeringa 100 ml', 1, 11, 6),
('Talla esteril 75x90', 1, 11, 6),
('Carbón absorvente', 1, 11, 6),
('Bolsas diuresis', 2, 11, 6),
('Sonda Foley 12', 1, 11, 6),
('Sonda Foley 14', 1, 11, 6),
('Sonda Foley 16', 1, 11, 6),
('Sonda Foley 18', 0, 11, 6),
('Sonda Foley 20', 0, 11, 6),
('Guante esteril S', 2, 11, 6),
('Guante esteril M', 2, 11, 6),
('Guante esteril L', 2, 11, 6),
('Jeringa 10 ml', 1, 11, 6),
('Sonda gastrica 14', 1, 11, 6),
('Sonda gastrica 16', 1, 11, 6);

-- Materiales del CAJON 6 (Id_cajon = 7)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Bolsa calor', 3, 11, 7),
('Bolsa frio', 4, 11, 7),
('Rasuradoras', 2, 11, 7),
('Linitul 9x15', 1, 11, 7),
('Silvederma', 1, 11, 7),
('Neasayomol (picaduras)', 1, 11, 7),
('Furacin', 1, 11, 7),
('Trombocid', 1, 11, 7),
('Diproderm', 1, 11, 7),
('Fastum gel', 1, 11, 7),
('Reflex', 1, 11, 7),
('Nobecutam', 1, 11, 7);

-- Materiales del CAJON 7 (Id_cajon = 8)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Filtros', 3, 11, 8),
('Silko gel', 1, 11, 8),
('Silkospray', 1, 11, 8),
('KIT INTUBACION PEDIATRICO', 0, 11, 8),
('Pinzas Maguill', 2, 11, 8),
('Tubo traqueal 3', 1, 11, 8),
('Tubo traqueal 3.5', 1, 11, 8),
('Tubo traqueal 4', 1, 11, 8),
('Tubo traqueal 4.5', 1, 11, 8),
('Tubo traqueal 5', 1, 11, 8),
('Tubo traqueal 6', 1, 11, 8),
('Fijador 2mm', 1, 11, 8),
('Fijador 4.8 mm', 1, 11, 8),
('Jeringa 10 ml', 1, 11, 8),
('Laringo pediatrico', 1, 11, 8),
('Talla esteril 75x90', 1, 11, 8);

-- Materiales del KIT INTUBACION ADULTO (Id_cajon = 9)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Jeringa 10 ml', 1, 11, 9),
('Tubo traqueal 6', 1, 11, 9),
('Tubo traqueal 7', 1, 11, 9),
('Tubo traqueal 7.5', 1, 11, 9),
('Tubo traqueal 8', 1, 11, 9),
('Tubo traqueal 8.5', 1, 11, 9),
('Tubo traqueal 9', 1, 11, 9),
('Pinza maguill', 1, 11, 9),
('Venda crepe 5 cm', 1, 11, 9),
('Fijador 4.8 mm', 1, 11, 9);

-- Materiales del CAJON 10 (Id_cajon = 10)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Aguja intravenosa aletas (palomilla) 23G', 3, 11, 10),
('Aguja intravenosa aletas (palomilla) 21G', 3, 11, 10),
('Abocat 14', 3, 11, 10),
('Abocat 16', 3, 11, 10),
('Abocat 18', 4, 11, 10),
('Abocat 20', 4, 11, 10),
('Abocat 22', 3, 11, 10),
('Abocat 24', 3, 11, 10);

-- Materiales del CAJON 11 (Id_cajon = 11)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Dosi flow', 2, 11, 11),
('Equipo corto', 1, 11, 11),
('Equipo largo', 0, 11, 11),
('Equipo perfusor 50 ml', 1, 11, 11),
('Alargadera', 1, 11, 11),
('Jeringa 2 ml', 2, 11, 11),
('Jeringa 5 ml', 5, 11, 11),
('Jeringa 10 ml', 4, 11, 11),
('Jeringa 20 ml', 3, 11, 11),
('Jeringa insulina', 3, 11, 11),
('Agujas verdes', 8, 11, 11),
('Agujas amarillas', 2, 11, 11),
('Agujas naranjas', 6, 11, 11);

-- Materiales del CAJON 12 (Id_cajon = 12)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Suero fisiologico 250ml', 2, 11, 12),
('Quitaesmalte', 1, 11, 12);
