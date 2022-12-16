import studentModel from "../model/studentModel.js";
import gradeModel from "../model/gradeModel.js";

export const createStudent = async (req, res, next) => {
  const gradeId = req.params.gradeId;
  try {
    const findGrade = await gradeModel.findById(gradeId);
    if (findGrade) {
      const savedStudent = await studentModel.create({
        ...req.body,
        gradeID: gradeId,
      });

      try {
        await gradeModel.findByIdAndUpdate(gradeId, {
          $push: { studentsList: savedStudent._id },
        });
      } catch (err) {
        console.log(err);
        next(err);
      }
      res.status(200).json(savedStudent);
    } else {
      res
        .status(200)
        .json({ Message: "Grade is not found, please create one" });
    }
  } catch (err) {
    res.status(400).json({ Message: err?.message });
  }
};

//update
export const updateStudent = async (req, res, next) => {
  try {
    if (req.body.gradeId) {
      res.status(200).json({ Message: "Not Allowed to Edit the Grade" });
    } else {
      const updatedStudent = await studentModel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      if (updatedStudent) {
        res.status(200).json(updatedStudent);
      } else {
        res.status(200).json({ Message: "Not found" });
      }
    }
  } catch (err) {
    res.status(400).json({ message: err?.message });
  }
};

//all students
export const getAllStudent = async (req, res, next) => {
  try {
    const studentsList = await studentModel.find(req.params.id);
    // console.log("update")
    res.status(200).json(studentsList);
  } catch (err) {
    res.status(404).json({ message: "No Data Found" });
    next(err);
  }
};

//getone
export const getOneStudent = async (req, res, next) => {
  try {
    const getstudent = await studentModel.findById(req.params.id);

    if (getstudent) {
      const gradetails = await gradeModel.find({
        _id: { $eq: getstudent?.gradeID },
      });

      const studentDetails = {
        ...getstudent?._doc,
        gradeDetails: gradetails[0]?.gradeName,
      };
      res.status(200).json(studentDetails);
    } else {
      res.status(200).json({ Message: "Student Not Found" });
    }
  } catch (err) {
    res.status(400).json({ Message: err?.message });
  }
};

//delete
export const deleteStudent = async (req, res, next) => {
  const gradeId = req.params.gradeId;

  try {
    const deleStudent = await studentModel.findByIdAndDelete(req.params.id);

    if (deleStudent) {
      const test = await gradeModel.updateMany({
        $pull: { studentsList: { $in: req.params.id } },
      });

      res.status(200).json("Deleted SuccessFully");
    } else {
      res.status(404).json({ Message: "User Not Found" });
    }
  } catch (err) {
    res.status(404).json({ Message: err?.message });
  }
};

// export const getCoursegradeId = async (req, res, next) => {
//   console.log("getCoursegradeId triger");
//   const instID = req.params.instID;
//   try {
//     const getCoursegradeId = await studentModel.find({ instID });

//     res.status(200).json(getCoursegradeId);
//   } catch (err) {
//     next(err);
//   }
// };
