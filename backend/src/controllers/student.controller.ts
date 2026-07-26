import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

// GET /api/students
export async function getStudents(
  _req: Request,
  res: Response
) {
  try {
    const students = await prisma.student.findMany({
      include: {
        batch: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });

    return res.status(200).json(students);
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// GET /api/students/:id
export async function getStudent(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
      include: {
        batch: true,
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("GET STUDENT ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// POST /api/students
export async function createStudent(
  req: Request,
  res: Response
) {
  try {
    const {
      rollNumber,
      firstName,
      lastName,
      email,
      phone,
      batchId,
    } = req.body;

    if (
      !rollNumber ||
      !firstName ||
      !lastName ||
      !email ||
      !batchId
    ) {
      return res.status(400).json({
        message:
          "rollNumber, firstName, lastName, email and batchId are required",
      });
    }

    const batch = await prisma.batch.findUnique({
      where: {
        id: batchId,
      },
    });

    if (!batch) {
      return res.status(400).json({
        message: "Invalid batchId",
      });
    }

    const student = await prisma.student.create({
      data: {
        rollNumber,
        firstName,
        lastName,
        email,
        phone: phone || null,
        batchId,
      },
      include: {
        batch: true,
      },
    });

    return res.status(201).json(student);
  } catch (error) {
    console.error("CREATE STUDENT ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// PUT /api/students/:id
export async function updateStudent(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const existingStudent = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!existingStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const {
      rollNumber,
      firstName,
      lastName,
      email,
      phone,
      batchId,
    } = req.body;

    if (batchId) {
      const batch = await prisma.batch.findUnique({
        where: {
          id: batchId,
        },
      });

      if (!batch) {
        return res.status(400).json({
          message: "Invalid batchId",
        });
      }
    }

    const student = await prisma.student.update({
      where: {
        id,
      },
      data: {
        ...(rollNumber !== undefined && { rollNumber }),
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(batchId !== undefined && { batchId }),
      },
      include: {
        batch: true,
      },
    });

    return res.status(200).json(student);
  } catch (error) {
    console.error("UPDATE STUDENT ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// DELETE /api/students/:id
export async function deleteStudent(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const existingStudent = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!existingStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    await prisma.student.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}