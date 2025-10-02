-- CreateTable
CREATE TABLE "leishmaniasis_cases" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeAnimal" TEXT NOT NULL,
    "tipoAnimal" TEXT NOT NULL,
    "idade" TEXT,
    "raca" TEXT,
    "sexo" TEXT,
    "pelagem" TEXT,
    "corPelagem" TEXT,
    "nomeTutor" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "quadra" TEXT NOT NULL,
    "dataNotificacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpf" TEXT,
    "telefone" TEXT,
    "endereco" TEXT
);
