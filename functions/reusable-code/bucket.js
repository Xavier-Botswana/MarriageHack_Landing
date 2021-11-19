async function retrieveBuckets(storage, bucketName) {
  const bucket = await storage.bucket(bucketName)

  console.log(`${bucket.name} retrieved.`)

  return bucket
}

module.exports.retrieveBuckets = retrieveBuckets
