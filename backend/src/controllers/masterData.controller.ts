import type { Response } from "express";

import prisma from "../lib/prisma.js";

import type {
  AuthRequest,
} from "../middleware/auth.middleware.js";

// =========================
// GET ALL MASTER DATA
// Staff only
// =========================

export async function getMasterData(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const records =
      await prisma.masterData.findMany({
        include: {
          mentor: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      });

    return res
      .status(200)
      .json(records);
  } catch (error) {
    console.error(
      "GET MASTER DATA ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load master data.",
    });
  }
}

// =========================
// CREATE MASTER DATA
// ADMIN only via route
// =========================

export async function createMasterData(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const {
      role,
      name,
      whatsapp,
      center,
      purpose,
      mapUrl,
      formUrl,
      driveUrl,
    } = req.body;

    // =========================
    // Validate Required Fields
    // =========================

    if (
      typeof role !== "string" ||
      !role.trim() ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        message:
          "Role and name are required.",
      });
    }

    const cleanRole =
      role.trim();

    const cleanName =
      name.trim();

    const cleanWhatsapp =
      typeof whatsapp === "string" &&
      whatsapp.trim()
        ? whatsapp.trim()
        : null;

    const cleanCenter =
      typeof center === "string" &&
      center.trim()
        ? center.trim()
        : null;

    const cleanPurpose =
      typeof purpose === "string" &&
      purpose.trim()
        ? purpose.trim()
        : null;

    const cleanMapUrl =
      typeof mapUrl === "string" &&
      mapUrl.trim()
        ? mapUrl.trim()
        : null;

    const cleanFormUrl =
      typeof formUrl === "string" &&
      formUrl.trim()
        ? formUrl.trim()
        : null;

    const cleanDriveUrl =
      typeof driveUrl === "string" &&
      driveUrl.trim()
        ? driveUrl.trim()
        : null;

    // =========================
    // Create Master Data
    // =========================

    const record =
      await prisma.$transaction(
        async (tx) => {
          let mentorId:
            | string
            | null = null;

          // If the record represents
          // a mentor, create the linked
          // Mentor record as well.

          if (
            cleanRole.toLowerCase() ===
            "mentor"
          ) {
            const mentor =
              await tx.mentor.create({
                data: {
                  name: cleanName,
                  phone:
                    cleanWhatsapp,
                },
              });

            mentorId =
              mentor.id;
          }

          return tx.masterData.create({
            data: {
              role: cleanRole,
              name: cleanName,

              whatsapp:
                cleanWhatsapp,

              center:
                cleanCenter,

              purpose:
                cleanPurpose,

              mapUrl:
                cleanMapUrl,

              formUrl:
                cleanFormUrl,

              driveUrl:
                cleanDriveUrl,

              mentorId,
            },

            include: {
              mentor: true,
            },
          });
        }
      );

    return res
      .status(201)
      .json(record);
  } catch (error) {
    console.error(
      "CREATE MASTER DATA ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create master data.",
    });
  }
}

// =========================
// UPDATE MASTER DATA
// ADMIN only via route
// =========================

export async function updateMasterData(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    // =========================
    // Get ID
    // =========================

    const rawId =
      req.params.id;

    const id =
      Array.isArray(rawId)
        ? rawId[0]
        : rawId;

    if (!id) {
      return res.status(400).json({
        message:
          "Master data ID is required.",
      });
    }

    // =========================
    // Find Existing Record
    // =========================

    const existing =
      await prisma.masterData.findUnique({
        where: {
          id,
        },

        include: {
          mentor: {
            include: {
              _count: {
                select: {
                  students: true,
                },
              },
            },
          },
        },
      });

    if (!existing) {
      return res.status(404).json({
        message:
          "Master data record not found.",
      });
    }

    const {
      role,
      name,
      whatsapp,
      center,
      purpose,
      mapUrl,
      formUrl,
      driveUrl,
    } = req.body;

    // =========================
    // Build Updated Values
    // =========================

    const newRole =
      typeof role === "string"
        ? role.trim()
        : existing.role;

    const newName =
      typeof name === "string"
        ? name.trim()
        : existing.name;

    if (!newRole) {
      return res.status(400).json({
        message:
          "Role cannot be empty.",
      });
    }

    if (!newName) {
      return res.status(400).json({
        message:
          "Name cannot be empty.",
      });
    }

    const newWhatsapp =
      typeof whatsapp === "string"
        ? whatsapp.trim() || null
        : existing.whatsapp;

    const newCenter =
      typeof center === "string"
        ? center.trim() || null
        : existing.center;

    const newPurpose =
      typeof purpose === "string"
        ? purpose.trim() || null
        : existing.purpose;

    const newMapUrl =
      typeof mapUrl === "string"
        ? mapUrl.trim() || null
        : existing.mapUrl;

    const newFormUrl =
      typeof formUrl === "string"
        ? formUrl.trim() || null
        : existing.formUrl;

    const newDriveUrl =
      typeof driveUrl === "string"
        ? driveUrl.trim() || null
        : existing.driveUrl;

    const wasMentor =
      existing.role
        .trim()
        .toLowerCase() ===
      "mentor";

    const isMentor =
      newRole
        .trim()
        .toLowerCase() ===
      "mentor";

    // =========================
    // Prevent Removing Mentor
    // While Assigned
    // =========================

    if (
      wasMentor &&
      !isMentor &&
      existing.mentor &&
      existing.mentor._count
        .students > 0
    ) {
      return res.status(409).json({
        message:
          "This mentor is assigned to students. Remove those assignments before changing the role.",
      });
    }

    // =========================
    // Update Transaction
    // =========================

    const record =
      await prisma.$transaction(
        async (tx) => {
          let mentorId =
            existing.mentorId;

          // -------------------------
          // Mentor -> Mentor
          // -------------------------

          if (
            wasMentor &&
            isMentor &&
            existing.mentorId
          ) {
            await tx.mentor.update({
              where: {
                id:
                  existing.mentorId,
              },

              data: {
                name: newName,
                phone:
                  newWhatsapp,
              },
            });
          }

          // -------------------------
          // Non-Mentor -> Mentor
          // -------------------------

          if (
            !wasMentor &&
            isMentor
          ) {
            const mentor =
              await tx.mentor.create({
                data: {
                  name: newName,
                  phone:
                    newWhatsapp,
                },
              });

            mentorId =
              mentor.id;
          }

          // -------------------------
          // Mentor -> Non-Mentor
          // -------------------------

          if (
            wasMentor &&
            !isMentor &&
            existing.mentorId
          ) {
            const oldMentorId =
              existing.mentorId;

            mentorId = null;

            // Disconnect first.

            await tx.masterData.update({
              where: {
                id,
              },

              data: {
                mentorId: null,
              },
            });

            // Then remove linked mentor.

            await tx.mentor.delete({
              where: {
                id:
                  oldMentorId,
              },
            });
          }

          // -------------------------
          // Update Master Data
          // -------------------------

          return tx.masterData.update({
            where: {
              id,
            },

            data: {
              role: newRole,
              name: newName,

              whatsapp:
                newWhatsapp,

              center:
                newCenter,

              purpose:
                newPurpose,

              mapUrl:
                newMapUrl,

              formUrl:
                newFormUrl,

              driveUrl:
                newDriveUrl,

              mentorId,
            },

            include: {
              mentor: true,
            },
          });
        }
      );

    return res
      .status(200)
      .json(record);
  } catch (error) {
    console.error(
      "UPDATE MASTER DATA ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update master data.",
    });
  }
}

// =========================
// DELETE MASTER DATA
// ADMIN only via route
// =========================

export async function deleteMasterData(
  req: AuthRequest,
  res: Response
) {
  try {
    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    // =========================
    // Get ID
    // =========================

    const rawId =
      req.params.id;

    const id =
      Array.isArray(rawId)
        ? rawId[0]
        : rawId;

    if (!id) {
      return res.status(400).json({
        message:
          "Master data ID is required.",
      });
    }

    // =========================
    // Find Existing Record
    // =========================

    const existing =
      await prisma.masterData.findUnique({
        where: {
          id,
        },

        include: {
          mentor: {
            include: {
              _count: {
                select: {
                  students: true,
                },
              },
            },
          },
        },
      });

    if (!existing) {
      return res.status(404).json({
        message:
          "Master data record not found.",
      });
    }

    // =========================
    // Protect Assigned Mentor
    // =========================

    if (
      existing.mentor &&
      existing.mentor._count
        .students > 0
    ) {
      return res.status(409).json({
        message:
          "This mentor is assigned to students. Remove those assignments before deleting this record.",
      });
    }

    // =========================
    // Delete Transaction
    // =========================

    await prisma.$transaction(
      async (tx) => {
        const mentorId =
          existing.mentorId;

        // Delete Master Data first
        // so its mentor relation is gone.

        await tx.masterData.delete({
          where: {
            id,
          },
        });

        // Remove linked Mentor too.

        if (mentorId) {
          await tx.mentor.delete({
            where: {
              id: mentorId,
            },
          });
        }
      }
    );

    return res.status(200).json({
      message:
        "Master data record deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE MASTER DATA ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete master data.",
    });
  }
}