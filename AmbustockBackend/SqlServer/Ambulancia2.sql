USE AmbustockDB;

-- =============================================
-- AMBULANCIA 2
-- =============================================
INSERT INTO ambulancia (Nombre, Matricula)
VALUES ('Ambulancia UVI', '5678-KLM');

-- =============================================
-- ZONAS PARA AMBULANCIA 2
-- =============================================
INSERT INTO zonas (nombre_zona, Id_ambulancia) VALUES
('MOCHILA EMERGENCIAS', 2),
('KIT VIA AEREA', 2),
('KIT CARDIOVASCULAR', 2),
('MATERIAL INMOVILIZACION', 2),
('BOTIQUIN GENERAL', 2),
('OXIGENOTERAPIA', 2),
('MONITOR Y DESFIBRILADOR', 2);

-- =============================================
-- CAJONES PARA ALGUNAS ZONAS
-- =============================================
INSERT INTO cajones (Nombre_cajon, Id_zona) VALUES
-- Para zona MOCHILA EMERGENCIAS (zona 13)
('Cajon Superior - Medicamentos', 13),
('Cajon Inferior - Material Fungible', 13),

-- Para zona BOTIQUIN GENERAL (zona 17)
('Cajon 1 - Vendajes', 17),
('Cajon 2 - Antisépticos', 17),
('Cajon 3 - Suturas', 17);

-- =============================================
-- MATERIALES PARA AMBULANCIA 2
-- =============================================

-- ZONA: MOCHILA EMERGENCIAS (Id_zona = 13)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
-- Medicamentos urgentes
('Adrenalina 1mg/ml ampolla', 5, 13, 1),
('Atropina sulfato 1mg ampolla', 4, 13, 1),
('Amiodarona 150mg ampolla', 3, 13, 1),
('Bicarbonato sodico 1M ampolla', 4, 13, 1),
('Glucosa hipertonica 50% ampolla 50ml', 3, 13, 1),
('Dopamina 200mg ampolla', 2, 13, 1),
('Nitroglicerina spray sublingual', 2, 13, 1),
('Salbutamol inhalador', 2, 13, 1),
('Diazepam 10mg ampolla', 3, 13, 1),

-- Material fungible
('Jeringas 5ml', 15, 13, 2),
('Jeringas 10ml', 12, 13, 2),
('Agujas intramusculares verdes', 20, 13, 2),
('Agujas intravenosas naranjas', 15, 13, 2),
('Gasas esteriles 10x10', 20, 13, 2),
('Guantes nitrilo talla M', 10, 13, 2),
('Esparadrapo hipoalergico', 3, 13, 2),
('Alcohol 70%', 4, 13, 2);

-- ZONA: KIT VIA AEREA (Id_zona = 14)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Tubos endotraqueales 7.0mm', 2, 14, NULL),
('Tubos endotraqueales 7.5mm', 2, 14, NULL),
('Tubos endotraqueales 8.0mm', 2, 14, NULL),
('Mascarilla laringea numero 3', 1, 14, NULL),
('Mascarilla laringea numero 4', 1, 14, NULL),
('Canula orofaringea Guedel 3', 2, 14, NULL),
('Canula orofaringea Guedel 4', 2, 14, NULL),
('Canula orofaringea Guedel 5', 2, 14, NULL),
('Laringoscopio con pilas', 1, 14, NULL),
('Pala laringoscopio adulto', 2, 14, NULL),
('Ambú adulto con reservorio', 1, 14, NULL),
('Pinzas Magill', 1, 14, NULL),
('Lubricante esteril', 3, 14, NULL),
('Sonda aspiracion 14 Ch', 5, 14, NULL),
('Mascarilla facial adulto', 2, 14, NULL);

-- ZONA: KIT CARDIOVASCULAR (Id_zona = 15)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Electrodos monitorizacion ECG', 10, 15, NULL),
('Parches desfibrilador adulto', 2, 15, NULL),
('Suero fisiologico 500ml', 6, 15, NULL),
('Suero glucosado 5% 500ml', 4, 15, NULL),
('Sistema gotero macro', 5, 15, NULL),
('Cateter IV 18G verde', 8, 15, NULL),
('Cateter IV 20G rosa', 8, 15, NULL),
('Cateter IV 22G azul', 6, 15, NULL),
('Llave tres pasos', 4, 15, NULL),
('Alargadera IV', 4, 15, NULL),
('Torniquete venoso', 2, 15, NULL),
('Compresor venoso', 1, 15, NULL),
('Betadine solucion', 2, 15, NULL),
('Aposito transparente cateter', 10, 15, NULL);

-- ZONA: MATERIAL INMOVILIZACION (Id_zona = 16)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Collarín cervical adulto ajustable', 2, 16, NULL),
('Férula inflable brazo', 1, 16, NULL),
('Férula inflable pierna', 1, 16, NULL),
('Vendas elasticas 10cm', 4, 16, NULL),
('Vendas elasticas 15cm', 3, 16, NULL),
('Tablilla espinal corta', 1, 16, NULL),
('Inmovilizador de cabeza', 1, 16, NULL),
('Cinturones araña', 3, 16, NULL),
('Manta termica', 2, 16, NULL),
('Tijeras corta ropa', 1, 16, NULL);

-- ZONA: BOTIQUIN GENERAL (Id_zona = 17)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
-- Cajon 1 - Vendajes
('Vendas gasa 5cm', 5, 17, 3),
('Vendas gasa 10cm', 5, 17, 3),
('Vendas cohesivas 10cm', 3, 17, 3),
('Esparadrapo 5cm', 3, 17, 3),
('Apositos esteriles 10x20', 10, 17, 3),
('Compresas esteriles grandes', 5, 17, 3),

-- Cajon 2 - Antisépticos
('Povidona yodada solucion', 3, 17, 4),
('Clorhexidina solucion', 2, 17, 4),
('Agua oxigenada', 2, 17, 4),
('Suero fisiologico 100ml lavado', 4, 17, 4),
('Toallitas alcohol', 1, 17, 4),

-- Cajon 3 - Suturas
('Kit sutura basico esteril', 2, 17, 5),
('Seda 2/0 con aguja', 3, 17, 5),
('Vicryl 3/0 con aguja', 2, 17, 5),
('Steri-strip sutura adhesiva', 5, 17, 5),
('Pinzas mosquito', 2, 17, 5),
('Portagujas', 1, 17, 5);

-- ZONA: OXIGENOTERAPIA (Id_zona = 18)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Bombona oxigeno portatil 2L', 1, 18, NULL),
('Caudalimetro oxigeno', 1, 18, NULL),
('Mascarilla Venturi 24%', 2, 18, NULL),
('Mascarilla Venturi 28%', 2, 18, NULL),
('Mascarilla reservorio alta concentracion', 3, 18, NULL),
('Gafas nasales adulto', 5, 18, NULL),
('Tubo conexion oxigeno', 2, 18, NULL),
('Humidificador oxigeno', 1, 18, NULL),
('Nebulizador', 2, 18, NULL);

-- ZONA: MONITOR Y DESFIBRILADOR (Id_zona = 19)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Papel ECG monitor', 2, 19, NULL),
('Pilas recargables monitor', 4, 19, NULL),
('Cable ECG 3 derivaciones', 1, 19, NULL),
('Cable ECG 12 derivaciones', 1, 19, NULL),
('Electrodos ECG desechables', 20, 19, NULL),
('Manguito presion arterial adulto', 1, 19, NULL),
('Sensor saturacion oxigeno', 1, 19, NULL),
('Gel conductor palas', 2, 19, NULL),
('Manual uso desfibrilador', 1, 19, NULL);