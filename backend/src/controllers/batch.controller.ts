import type { Response } from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// =========================
// GET ALL BATCHES
// =========================

export async function getBatches(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const batches =
      await prisma.batch.findMany({
        include: {
          venue: true,

          _count: {
            select: {
              students: true,
            },
          },
        },

        orderBy: {
          name: "asc",
        },
      });

    return res.status(200).json(
      batches
    );
  } catch (error) {
    console.error(
      "GET BATCHES ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load batches.",
    });
  }
}

// =========================
// GET ALL VENUES
// Admin
// =========================

export async function getVenues(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Admin access required",
      });
    }

    const venues =
      await prisma.venue.findMany({
        include: {
          _count: {
            select: {
              batches: true,
            },
          },
        },

        orderBy: {
          name: "asc",
        },
      });

    return res.status(200).json(
      venues
    );
  } catch (error) {
    console.error(
      "GET VENUES ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load venues.",
    });
  }
}

// =========================
// CREATE VENUE
// Admin
// =========================

export async function createVenue(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Admin access required",
      });
    }

    const {
      name,
      address,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        message:
          "Venue name is required",
      });
    }

    const venue =
      await prisma.venue.create({
        data: {
          name: name.trim(),

          address:
            typeof address ===
              "string" &&
            address.trim()
              ? address.trim()
              : null,
        },
      });

    return res.status(201).json(
      venue
    );
  } catch (error) {
    console.error(
      "CREATE VENUE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create venue.",
    });
  }
}

// =========================
// UPDATE BATCH VENUE
// Admin
// =========================

export async function updateBatchVenue(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Admin access required",
      });
    }

    const batchId =
      req.params.batchId;

    const {
      venueId,
    } = req.body;

    if (
      typeof batchId !== "string" ||
      !batchId
    ) {
      return res.status(400).json({
        message:
          "Invalid batch ID",
      });
    }

    if (
      typeof venueId !== "string" ||
      !venueId
    ) {
      return res.status(400).json({
        message:
          "Venue is required",
      });
    }

    const batch =
      await prisma.batch.findUnique({
        where: {
          id: batchId,
        },
      });

    if (!batch) {
      return res.status(404).json({
        message:
          "Batch not found",
      });
    }

    const venue =
      await prisma.venue.findUnique({
        where: {
          id: venueId,
        },
      });

    if (!venue) {
      return res.status(404).json({
        message:
          "Venue not found",
      });
    }

    const updatedBatch =
      await prisma.batch.update({
        where: {
          id: batchId,
        },

        data: {
          venueId,
        },

        include: {
          venue: true,

          _count: {
            select: {
              students: true,
            },
          },
        },
      });

    return res.status(200).json(
      updatedBatch
    );
  } catch (error) {
    console.error(
      "UPDATE BATCH VENUE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update batch venue.",
    });
  }
}