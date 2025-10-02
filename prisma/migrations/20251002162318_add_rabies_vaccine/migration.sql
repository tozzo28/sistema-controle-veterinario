-- CreateTable
CREATE TABLE "rabies_vaccine_records" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeAnimal" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nomeTutor" TEXT NOT NULL,
    "dataVacinacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "localVacinacao" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "quadra" TEXT NOT NULL,
    "loteVacina" TEXT NOT NULL
);
