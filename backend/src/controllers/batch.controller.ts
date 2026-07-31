import type { Response } from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// =========================
// GET ALL BATCHES
// Staff only
// =========================

export async function getBatches(
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

    return res
      .status(200)
      .json(batches);
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
// Staff only
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

    return res
      .status(200)
      .json(venues);
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
// ADMIN only via route
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

    // =========================
    // Validate Name
    // =========================

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        message:
          "Venue name is required",
      });
    }

    // =========================
    // Clean Fields
    // =========================

    const cleanName =
      name.trim();

    const cleanAddress =
      typeof address === "string" &&
      address.trim()
        ? address.trim()
        : null;

    // =========================
    // Create Venue
    // =========================

    const venue =
      await prisma.venue.create({
        data: {
          name: cleanName,
          address: cleanAddress,
        },
      });

    return res
      .status(201)
      .json(venue);
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
// COORDINATOR + ADMIN via route
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

    // =========================
    // Get Batch ID
    // =========================

    const rawBatchId =
      req.params.batchId;

    const batchId =
      Array.isArray(rawBatchId)
        ? rawBatchId[0]
        : rawBatchId;

    if (!batchId) {
      return res.status(400).json({
        message:
          "Invalid batch ID",
      });
    }

    // =========================
    // Get Venue ID
    // =========================

    const {
      venueId,
    } = req.body;

    if (
      typeof venueId !== "string" ||
      !venueId.trim()
    ) {
      return res.status(400).json({
        message:
          "Venue is required",
      });
    }

    const cleanVenueId =
      venueId.trim();

    // =========================
    // Check Batch
    // =========================

    const batch =
      await prisma.batch.findUnique({
        where: {
          id: batchId,
        },

        select: {
          id: true,
        },
      });

    if (!batch) {
      return res.status(404).json({
        message:
          "Batch not found",
      });
    }

    // =========================
    // Check Venue
    // =========================

    const venue =
      await prisma.venue.findUnique({
        where: {
          id: cleanVenueId,
        },

        select: {
          id: true,
        },
      });

    if (!venue) {
      return res.status(404).json({
        message:
          "Venue not found",
      });
    }

    // =========================
    // Update Assignment
    // =========================

    const updatedBatch =
      await prisma.batch.update({
        where: {
          id: batchId,
        },

        data: {
          venueId: cleanVenueId,
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

    return res
      .status(200)
      .json(updatedBatch);
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