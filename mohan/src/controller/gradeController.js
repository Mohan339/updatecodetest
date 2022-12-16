import mongoose from "mongoose";
import gradeModel from "../model/gradeModel.js";
import studentModel from "../model/studentModel.js";
// Post controller function
export const create = async (req, res, next) => {
  try {
    const newGrade = new gradeModel({ ...req.body });
    const savedGrade = await newGrade.save();

    res.status(200).json(savedGrade);
  } catch (err) {
    res.status(400).json({ Message: err?.message });
  }
};

// Retrive and return a All grade
export const getAllGrade = async (req, res, next) => {
  try {
    const grades = await gradeModel.find(req.params.id);
    res.status(200).json(grades);
  } catch (err) {
    next(err);
  }
};

//  Retrive and return a single grade
export const getGradeSingle = async (req, res, next) => {
  try {
    const getOneGrade = await gradeModel.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    if (getOneGrade) {
      const studentDetails = await studentModel.find({
        _id: { $in: getOneGrade?.studentsList },
      });
      const students = studentDetails && studentDetails.map((i) => i?.name);
      const value = {
        ...getOneGrade?._doc,
        studentsDetails: students,
      };
      res.status(200).json(value);
    } else {
      res.status(200).json({ Message: "Not Found" });
    }
  } catch (err) {
    res.status(400).json({ Message: err?.message });
  }
};

// Update a  idetified grade by id
export async function updateGrade(req, res, next) {
  try {
    if (req.body.studentsList) {
      res
        .status(200)
        .json({ Message: "Not allowed to edit the students list" });
    } else {
      const updatedGrade = await gradeModel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json(updatedGrade);
    }
  } catch (err) {
    res.status(400).json({ Message: err?.message });
  }
}

// Soft Delete a grade with specified grade id in the request
export async function gradeDelete(req, res, next) {
  try {
    const findGrade = await gradeModel.findById(req.params.id);
    if (findGrade && findGrade?.gradeStatus === true) {
      const findSudent = await studentModel.find({ gradeID: req.params.id });

      if (findSudent.length > 0) {
        let parsedData = findSudent.map((i) => i?.name);
        res.status(200).json({
          studenList: parsedData,
          Message: "Students are allocated delete not allowed",
        });
      } else {
        const updatedGrade = await gradeModel.findByIdAndUpdate(
          req.params.id,
          { $set: { gradeStatus: false } },
          { new: true }
        );

        res.status(200).json({ Message: "Deleted SuccessFully" });
      }
    } else {
      res.status(200).json({ Message: "Grade is Not Found" });
    }
  } catch (err) {
    next(err);
  }
}
