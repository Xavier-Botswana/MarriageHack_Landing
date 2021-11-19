uploadImageToStorage = (file, bucket) => {
  console.log('trying')
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file')
    }
    let newFileName = `${file.originalname}_${Date.now()}`

    let fileUpload = bucket.file(newFileName)

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    })

    blobStream.on('error', (error) => {
      reject(error)
    })

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = format(
        `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`,
      )
      console.log(url)
      resolve(url)
    })

    blobStream.end(file.buffer)
  })
}

module.exports.uploadImageToStorage = uploadImageToStorage
