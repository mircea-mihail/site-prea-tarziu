-- http://127.0.0.1/pgadmin4/browser/ -> pg admin !!

-- sa ma uit pe finalul la curs 9

-- EXAMEN -> PRIMUL EX E DE BAZE DE DATE DECI AR FI BINE SA STIU TOT DE MAI JOS
-- S-AR PUTEA SA PICE UN CHECK CONSTRAINT
-- ar fi bine sa nu folosim interfata grafica
-- pica la examen asta cu data curenta

DROP TYPE IF EXISTS categorii;
DROP TYPE IF EXISTS materiale;

CREATE TYPE categorii AS ENUM('Imbracaminte', 'Incaltaminte', 'Accesorii', 'Printate');
CREATE TYPE materiale AS ENUM('piele', 'hartie', 'tesatura', 'metal', 'plastic');
-- enum permite definirea unor siruri de caractere drept valori -> nu foloseste stringurile astea pt identificare
-- ci se foloseste de niste numere asociate fiecarui string (0, 1, 2, 3)

CREATE TABLE IF NOT EXISTS merchendise (
   -- serial face id-ul automat (creaza o secventa)
   id serial PRIMARY KEY,
   -- varchar are pana la 50, char are obligatoriu 50
   nume VARCHAR(50) UNIQUE NOT NULL,
   -- pt cand e nevoie de mult text -> tabel pt un blog/forum
   -- in care continutul unei postari ar putea fi destul de mare
   descriere TEXT,
   -- cale catre imagine
   imagine VARCHAR(300),
   -- ceva din enum, in care alegem o valoare default din enum
   categorie categorii DEFAULT 'Imbracaminte',
   material materiale DEFAULT 'tesatura',
      -- nr tip float cu 8 cifre si 2 zecimale
   pret NUMERIC(8,2) NOT NULL,
   garantie INT NOT NULL CHECK (garantie>=0),

   -- tip data calendaristica, e luata default data curenta  
   data_adaugare TIMESTAMP DEFAULT current_timestamp,

   -- intreg cu check constraint in care gramajul e mai mare ca 0
   greutate NUMERIC(8,2) NOT NULL CHECK (greutate>=0),   

   -- [] -> vector de sirurui de caractere (exemplu in insert)
   -- nu prea e bine in general dar chiar nu avem chef de un tabel separat de ingrediente -> punem un vector
   -- nu ne intereseaza ingredientele ca elemente separate cu mai multe atribute
   culori VARCHAR [], --pot sa nu fie specificare deci nu punem NOT NULL
   produse_in_romania BOOLEAN NOT NULL DEFAULT FALSE
);

-- tipuri produse are deja filtrare in js
-- asa ca fac o filtrare si din BD pe categ_prajitura

-- sa facem inserturile direct de aici

INSERT into merchendise (nume, descriere, imagine, categorie, material, pret, garantie, greutate, culori, produse_in_romania) VALUES
('Sk8 high cranii', 'O pereche de adidasi rezistenti, fabricati de Vans, in colaborare cu trupa noastra.', 'adidasi-vans-inalti.png', 'Incaltaminte', 'tesatura', 500, 30, 1.5, '{"negru","albastru","galben"}', False),
('Insigna metal', 'O insigna de mare calitate fabricata dintr-un aliaj de metal inoxidabil. Aceasta ia forma numelui trupei Prea Tarziu.', 'pin-gri-trupa.png', 'Accesorii', 'metal', 50, 10, 0.01, '{"gri"}', False),
('Sapca logo trupa', 'O sapca calitativa, cu logo-ul trupei cusut in partea sa frontala. Cozoroc drept si banda de reglaj.', 'sapca-neagra-trupa.png', 'Imbracaminte', 'tesatura',60 , 30, 0.08, '{"negru","alb","rosu"}', True),
('Sticla aluminiu maini', 'Sticla fabricata din aluminiu. Modelul imprimat este realizat chiar de un membru al trupei.', 'sticla-de-apa-generica.png', 'Accesorii', 'metal',70 , 60, 0.2, '{"alb","rosu","negru"}', False),
('Triocu masca de gaze', 'Tricou de calitate inalta fabricat in Romania. 100% combed, organic, Indian, fair trade, climate neutral.', 'tricou-generic-galben-gri.png', 'Imbracaminte', 'tesatura', 80, 30, 0.1, '{"negru","galben","gri"}', True),
('Hanorac craniu', 'Hanorac de calitate inalta fabricat in Romania. 100% combed, organic, Indian, fair trade, climate neutral.', 'hanorac-alb-generic.png', 'Imbracaminte', 'tesatura', 200, 90, 0.4, '{"alb","rosu"}', True),
('Deschizator de sticle', 'Deschizator de sticle cu unul dintre logo-urile trupei.', 'plastic-bottle-opener.png', 'Accesorii', 'plastic', 25, 0, 0.01, '{"alb","negru"}', False),
('Carte postala semnata', 'O carte postala cu logoul trupei, semnata de fiecare membru in parte.', 'signed-photocard.png', 'Printate', 'hartie', 300, 5, 0.01, '{"negru"}', True),
('Slip-ons cranii', 'O pereche de adidasi rezistenti, fabricati de Vans, in colaborare cu trupa noastra.', 'tenesi-vans-slip-ons.png', 'Incaltaminte', 'tesatura', 400, 365, 1, '{"negru","galben","albastru"}', False),
('Tricou Relentless', 'Tricou de calitate inalta fabricat in Romania. 100% combed, organic, Indian, fair trade, climate neutral.', 'tricou-relentless.png', 'Imbracaminte', 'tesatura', 90, 30, 0.1, '{"negru","gri","albastru"}', True),
('Geaca de piele', 'Geaca de calitate inalta fabricata in Italia. Realizata cu atentie si dedicatie de maestrii Italiei.', 'leather-jacket-band.png', 'Imbracaminte', 'piele', 600, 365, 0.6, '{"negru","alb"}', False),
('Poster Firepower Kills', 'Posterele sunt un mod foarte expresiv de a-ti arata pasiunea pentru muzica, fie la tine in camera sau oriunde altundeva.', 'poster-firepower.png', 'Printate', 'hartie', 20, 0, 0.01, '{"negru","alb","rosu","albastru"}', True),
('Sticker logo trupa', 'Nu e prea tarziu sa iti lipesti un sticker fenomenal pe laptop, sticla de apa sau pe orice alt obiect din casa ta.', 'sticker-trupa-rosu.png', 'Printate', 'hartie', 10, 0, 0.01, '{"rosu","negru","alb"}', False),
('Tricou The Moth', 'Tricou de calitate inalta fabricat in Romania. 100% combed, organic, Indian, fair trade, climate neutral.', 'tricou-album-molie.png', 'Imbracaminte', 'tesatura', 80, 30, 0.1, '{"negru","alb"}', True),
('Tricou Trump', 'Tricou de calitate inalta fabricat in Romania. 100% combed, organic, Indian, fair trade, climate neutral.', 'tricou-trupa-trump.png', 'Imbracaminte', 'tesatura', 80, 30, 0.1, '{"alb","rosu","negru"}', True),
('Patch logo trupa', 'Creat sa umple cu stil acel loc liber de pe vesta ta de blugi.', 'patch-trupa-havok.png', 'Accesorii', 'tesatura', 30, 15, 0.02, '{"alb","negru"}', True),
('Poster Power Unsurpassed', 'Posterele sunt un mod foarte expresiv de a-ti arata pasiunea pentru muzica, fie la tine in camera sau oriunde altundeva.', 'poster-power-unsurpassed.png', 'Printate', 'hartie', 20, 0, 0.01, '{"negru","rosu"}', True),
('Sticker trupa verde', 'Nu e prea tarziu sa iti lipesti un sticker fenomenal pe laptop, sticla de apa sau pe orice alt obiect din casa ta.', 'sticker-verde-trupa.png', 'Printate', 'hartie', 10, 0, 0.01, '{"alb","verde"}', False),
('Tricou Weapons', 'Tricou de calitate inalta fabricat in Romania. 100% combed, organic, Indian, fair trade, climate neutral.', 'tricou-album-weapons.png', 'Imbracaminte', 'tesatura', 80, 30, 0.1, '{"negru","albastru"}', True);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO irina;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA  public TO irina;
