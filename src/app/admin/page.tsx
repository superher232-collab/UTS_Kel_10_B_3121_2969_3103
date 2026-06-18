// src/app/admin/page.tsx
import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ShipmentStatus, VehicleStatus, TicketStatus, ShippingType } from '@prisma/client';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

// Helper: map Prisma Shipment to frontend format for Cargo CRUD
function mapShipmentToCargo(s: any) {
  return {
    id: s.id,
    no_resi: s.receiptNo,
    tanggal_kirim: s.shipmentDate.toISOString(),
    nama_pengirim: s.senderName,
    nama_penerima: s.receiverName,
    no_telepon: s.receiverTelp || '',
    kota_asal: s.origin,
    kota_tujuan: s.destination,
    jenis_barang: s.itemName,
    berat_kg: s.weight,
    harga_tarif: s.tariff,
    jenis_kendaraan: s.shippingType.toLowerCase(),
    vehicleId: s.vehicleId,
    vehicleName: s.vehicle?.name || null,
    jenis_pengiriman: 'biasa',
    status_pengiriman: s.status.toLowerCase(),
    status_barang: 'aman',
    status_transaksi: s.paymentStatus?.toLowerCase() || 'belum_bayar',
    metode_pembayaran: s.paymentMethod || 'TUNAI',
    deskripsi: s.notes || null,
    eta: s.eta?.toISOString() || null,
    currentLocation: s.currentLocation || null,
    targetUserId: s.userId
  };
}

// Helper: map Prisma Vehicle to Option
function mapVehicleToOption(v: any) {
  return {
    id: v.id,
    name: v.name,
    type: v.type,
    plateNo: v.plateNo,
    capacity: v.capacity,
    status: v.status
  };
}

interface PageProps {
  searchParams: Promise<{
    tab?: string;
    q?: string;
    status?: string;
    mode?: string;
    page?: string;
  }>;
}

export const metadata = {
  title: 'Admin Command Hub - PrimeLog',
  description: 'Pusat Komando dan Pengendalian PrimeLog. Kelola kargo, armada kapal, penugasan kru, analitik operasional, dan tiket bantuan pelanggan dari satu konsol terpadu.'
}

export default async function AdminUnifiedDashboardPage({ searchParams }: PageProps) {
  // 1. Session & role check (Strict BR-09, BR-01)
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // 2. Parse Search Parameters
  const params = await searchParams;
  const activeTab = params.tab || 'komando';

  // ─────────────────────────────────────────────────────────────
  // A. FETCH DATA FOR TAB: KOMANDO (Always loaded as central hub)
  // ─────────────────────────────────────────────────────────────
  let totalShipments = 0;
  let pendingShipments = 0;
  let delayedCount = 0;
  let totalRevenue = 0;
  let openTicketsCount = 0;
  let delayedAlerts: any[] = [];
  let brokenVehiclesAlerts: any[] = [];
  let openTicketsAlerts: any[] = [];

  try {
    const [
      totalCount,
      pendingCount,
      revenueAgg,
      openTickets
    ] = await Promise.all([
      prisma.shipment.count(),
      prisma.shipment.count({
        where: { status: { in: [ShipmentStatus.DIPROSES, ShipmentStatus.PENDING] } }
      }),
      prisma.shipment.aggregate({
        _sum: { tariff: true }
      }),
      prisma.supportTicket.count({
        where: { status: TicketStatus.OPEN }
      })
    ]);

    totalShipments = totalCount;
    pendingShipments = pendingCount;
    totalRevenue = revenueAgg._sum.tariff || 0;
    openTicketsCount = openTickets;

    // Delayed alerts (ETA expired & status not completed)
    delayedCount = await prisma.shipment.count({
      where: {
        status: { in: [ShipmentStatus.DALAM_PENGIRIMAN, ShipmentStatus.PENDING] },
        eta: { lt: new Date() }
      }
    });

    delayedAlerts = await prisma.shipment.findMany({
      where: {
        status: { in: [ShipmentStatus.DALAM_PENGIRIMAN, ShipmentStatus.PENDING] },
        eta: { lt: new Date() }
      },
      select: { id: true, receiptNo: true, itemName: true, destination: true, eta: true },
      take: 4,
      orderBy: { eta: 'asc' }
    });

    // Broken vehicles (status PERBAIKAN)
    brokenVehiclesAlerts = await prisma.vehicle.findMany({
      where: { status: VehicleStatus.PERBAIKAN },
      select: { id: true, name: true, plateNo: true, type: true },
      take: 4
    });

    // Support tickets alerts (status OPEN)
    openTicketsAlerts = await prisma.supportTicket.findMany({
      where: { status: TicketStatus.OPEN },
      select: { id: true, ticketNo: true, title: true, severity: true },
      take: 4,
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Failed to load komando stats:', error);
  }

  // ─────────────────────────────────────────────────────────────
  // B. FETCH DATA FOR TAB: CARGO CRUD (Loaded dynamically if active)
  // ─────────────────────────────────────────────────────────────
  let cargoProps: any = null;
  
  if (activeTab === 'cargo') {
    const q = params.q || '';
    const statusFilter = params.status || 'all';
    const modeFilter = params.mode || 'all';
    const pageParam = params.page || '1';

    const pageNum = Math.max(1, parseInt(pageParam, 10) || 1);
    const limit = 10;
    const offset = (pageNum - 1) * limit;

    const whereClause: any = {};

    if (q.trim() !== '') {
      const qList = q.split(/[\s,;]+/).map(item => item.trim()).filter(item => item.length > 0);
      if (qList.length > 1) {
        whereClause.receiptNo = { in: qList };
      } else {
        whereClause.OR = [
          { receiptNo: { contains: q, mode: 'insensitive' as const } },
          { senderName: { contains: q, mode: 'insensitive' as const } },
          { receiverName: { contains: q, mode: 'insensitive' as const } },
          { itemName: { contains: q, mode: 'insensitive' as const } }
        ];
      }
    }

    if (statusFilter !== 'all' && Object.values(ShipmentStatus).includes(statusFilter.toUpperCase() as ShipmentStatus)) {
      whereClause.status = statusFilter.toUpperCase() as ShipmentStatus;
    }

    if (modeFilter !== 'all' && Object.values(ShippingType).includes(modeFilter.toUpperCase() as ShippingType)) {
      whereClause.shippingType = modeFilter.toUpperCase() as ShippingType;
    }

    try {
      const [
        total,
        laut,
        selesai,
        shipments,
        vehicles
      ] = await Promise.all([
        prisma.shipment.count({ where: whereClause }),
        prisma.shipment.count({ where: { ...whereClause, shippingType: 'LAUT' } }),
        prisma.shipment.count({ where: { ...whereClause, status: 'SELESAI' } }),
        prisma.shipment.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
          include: {
            vehicle: {
              select: { id: true, name: true, type: true, plateNo: true, capacity: true, status: true }
            }
          }
        }),
        prisma.vehicle.findMany({
          where: { status: 'TERSEDIA' },
          orderBy: { name: 'asc' }
        })
      ]);

      cargoProps = {
        initialShipments: shipments.map(mapShipmentToCargo),
        ships: vehicles.map(mapVehicleToOption),
        stats: { total, laut, selesai },
        pagination: {
          total,
          page: pageNum,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      };
    } catch (e) {
      console.error('Failed to load admin cargo data:', e);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // C. FETCH DATA FOR TAB: FLEET (Loaded dynamically if active)
  // ─────────────────────────────────────────────────────────────
  let fleetProps: any = null;
  if (activeTab === 'fleet') {
    try {
      const [vehicles, pendingShipments] = await Promise.all([
        prisma.vehicle.findMany({
          orderBy: { name: 'asc' },
          include: {
            shipments: {
              select: { id: true, receiptNo: true, weight: true }
            }
          }
        }),
        prisma.shipment.findMany({
          where: {
            status: { in: ['DIPROSES', 'PENDING'] }
          },
          orderBy: { createdAt: 'desc' }
        })
      ]);

      fleetProps = {
        vehicles: vehicles.map(v => ({
          id: v.id,
          name: v.name,
          type: v.type,
          plateNo: v.plateNo,
          capacity: v.capacity,
          status: v.status,
          shipmentsCount: v.shipments.length,
          shipmentsWeight: v.shipments.reduce((sum: number, s: any) => sum + s.weight, 0)
        })),
        pendingShipments: pendingShipments.map(s => ({
          id: s.id,
          receiptNo: s.receiptNo,
          itemName: s.itemName,
          weight: s.weight,
          destination: s.destination,
          origin: s.origin
        }))
      };
    } catch (e) {
      console.error('Failed to load admin fleet data:', e);
    }
  }

  // 3. Render Dashboard Shell
  return (
    <AdminDashboardClient
      initialTab={activeTab}
      cargoProps={cargoProps}
      fleetProps={fleetProps}
      komandoProps={{
        totalShipments,
        pendingShipments,
        delayedCount,
        totalRevenue,
        openTicketsCount,
        delayedAlerts,
        brokenVehiclesAlerts,
        openTicketsAlerts
      }}
    />
  );
}
