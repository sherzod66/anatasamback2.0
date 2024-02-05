-- CreateEnum
CREATE TYPE "EnumOrderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'CAN_BE_PICKED_UP', 'TOOK');

-- CreateEnum
CREATE TYPE "EnumInvintationLang" AS ENUM ('RU', 'UZ', 'EN');

-- CreateEnum
CREATE TYPE "EnumMeymontMethod" AS ENUM ('UZCARD', 'HUMO', 'CASH');

-- CreateEnum
CREATE TYPE "EnumPaymentStatus" AS ENUM ('PENDING', 'PAID');

-- CreateEnum
CREATE TYPE "EnumUserRole" AS ENUM ('USER', 'DIRECTOR', 'MANAGER', 'SALESMAN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "activateKey" INTEGER NOT NULL,
    "name" TEXT,
    "role" "EnumUserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "payment_id" TEXT NOT NULL,
    "paymentMethod" "EnumMeymontMethod" NOT NULL,
    "status" "EnumOrderStatus" NOT NULL DEFAULT 'PENDING',
    "paidStatus" "EnumPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paid" INTEGER NOT NULL,
    "orderPrice" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "userPhone" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "orders" INTEGER NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL,
    "wasQuantity" INTEGER NOT NULL,
    "castPrice" INTEGER NOT NULL,
    "minOrderQuantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "imageLink" TEXT[],

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Basket" (
    "userId" INTEGER NOT NULL,
    "cardId" INTEGER NOT NULL,

    CONSTRAINT "Basket_pkey" PRIMARY KEY ("cardId","userId")
);

-- CreateTable
CREATE TABLE "InvitationInfo" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER NOT NULL,
    "cardPrice" INTEGER NOT NULL,
    "cardImage" TEXT[],
    "luckyOnes" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "lang" "EnumInvintationLang" NOT NULL,
    "restaurant" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "orderId" INTEGER,

    CONSTRAINT "InvitationInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Electronic" (
    "id" SERIAL NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "viewing" INTEGER NOT NULL DEFAULT 0,
    "path" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "shelfLife" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Electronic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_activateKey_key" ON "User"("activateKey");

-- CreateIndex
CREATE UNIQUE INDEX "Order_payment_id_key" ON "Order"("payment_id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Basket" ADD CONSTRAINT "Basket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Basket" ADD CONSTRAINT "Basket_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationInfo" ADD CONSTRAINT "InvitationInfo_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Electronic" ADD CONSTRAINT "Electronic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
