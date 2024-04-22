const { drive } = require("../../helper/db");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const uuid = uuidv4();

const uploadFile = (req, res, next) => {
  if (!req.file) {
    return res.send("Vui lòng chọn file");
  }
  drive()
    .files.create({
      requestBody: {
        name: uuid,
        mimeType: req.file.mimetype,
        parents: ["1hTsw75IZjERqmDwdnFN8rhtIKOdmr6XI"],
      },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
      },
    })
    .then((response) => {
      console.log("thêm ảnh: ", response.data.id);
      drive()
        .permissions.create({
          fileId: response.data.id,
          requestBody: {
            role: "reader",
            type: "anyone",
          },
        })
        .then(() => {
          req.fileId = response.data.id;
          next();
        });
    });
};
module.exports = { uploadFile };
