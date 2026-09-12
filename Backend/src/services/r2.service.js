const {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { r2, R2_BUCKET_NAME } = require("../config/r2");

const uploadImage = async (file, folder) => {
  const extension = file.originalname.split(".").pop();

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 10)}.${extension}`;

  const key = `${folder}/${fileName}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return {
    key,
    fileName,
  };
};

const deleteImage = async (key) => {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
  );
};

const getSignedImageUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  const signedUrl = await getSignedUrl(r2, command, {
    expiresIn: 3600,
  });

  return signedUrl;
};

module.exports = {
  uploadImage,
  deleteImage,
  getSignedImageUrl,
};