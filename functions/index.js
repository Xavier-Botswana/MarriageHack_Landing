/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict'

const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const axios = require('axios')
const exphbs = require('express-handlebars')
const app = express()
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const path = require('path')

const { filesUpload } = require('./middleware/middleware')

const serviceAccount = require('./serviceAccountKey.json')

const { Storage } = require('@google-cloud/storage')
const Busboy = require('busboy')
const { uploadImageToStorage } = require('./reusable-code/upload')
const API_LINK_BASE_URL = 'http://storage.googleapis.com'
const BUCKET_ID = 'application-docs'

const storage = new Storage({
  keyFilename: path.join(__dirname, './reusable-code/gc-key.json'),
  projectId: 'reib-website',
})

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

app.use(allowCrossDomain)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const hbs = exphbs.create({
  defaultLayout: 'main',

  helpers: {
    inc: function (value, options) {
      return parseInt(value) + 1
    },
  },
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
//app.use(firebaseUser.validateFirebaseIdToken)
app.use(express.static(__dirname + '/public'))

//fetch properties

app.get('/', (req, res) => {
  return res.render('index')
})

app.get('/about', (req, res) => {
  return res.render('about')
})

app.get('/property-listings', (req, res) => {
  fetch(
    'https://us-central1-reib-platform.cloudfunctions.net/app/api/properties',
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data)

      data = data.filter((item) => {
        return item.status === 'Published'
      })

      return res.render('property-listings', {
        properties: data,
      })
    })
    .catch((error) => {
      console.error(error)
    })
})


app.get('/news', (req, res) => {
  fetch(
    'https://us-central1-reib-platform.cloudfunctions.net/app/api/news',
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data)

      data = data.filter((item) => {
        return item.status === 'Published'
      })

      return res.render('news', {
        news: data,
      })
    })
    .catch((error) => {
      console.error(error)
    })
})

app.get('/fraud-alert', (req, res) => {
  return res.render('fraud-alert')
})
// /members-list
app.get('', (req, res) => {

  fetch(
    'https://us-central1-reib-platform.cloudfunctions.net/app/api/allmember',
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data)

      return res.render('members-list', { members: data,})
    })
    .catch((error) => {
      console.error(error)
    })

})
// Get Specific Valuation
app.get('/api/property-valuations/:id', (req, res) => {
  ; (async () => {
    try {
      y
      let id = req.params.id
      let query = db.collection('property-valuations').doc(id)
      let response = {}
      await query.get().then((querySnapshot) => {
        let doc = querySnapshot
        const selectedItem = {
          id: doc.id,
          ...doc.data(),
        }
        response = selectedItem
      })
      return res.status(200).send(response)
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)
    }
  })()
})


app.get('/search', (req, res) => {
  let names = req.query.name;
  // console.log(name)
  fetch(
    'https://us-central1-reib-platform.cloudfunctions.net/app/api/allmember',
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      let member = data.filter((e) => {
        return e.name === names
      })
      let memberss = data.filter((e) => {
        return e.gender === names
      })

      let Members = [...member, ...memberss];
      return res.render('members-list', {
        members: Members,
      })
    })
    .catch((error) => {
      console.error(error)
    })

})


app.get('/jobs', (req, res) => {
  return res.render('jobs')
})

app.get('/search-Members', (req, res) => {
  return res.render('members-list')
})

app.get('/members-corner', (req, res) => {
  return res.render('members-corner')
})

app.get('/membership', (req, res) => {
  return res.render('membership')
})


app.get('/contacts', (req, res) => {
  return res.render('contacts')
})

app.get('/report-page', (req, res) => {
  return res.render('report-page')
})

app.get('/register', (req, res) => {
  return res.render('register-page')
})

app.get('/youth-page', (req, res) => {
  return res.render('youth-page')
})

app.get('/student-form', (req, res) => {
  return res.render('stu-form')
})

app.get('/member-form', (req, res) => {
  return res.render('mem-form')
})

app.get('/youth-council', (req, res) => {
  return res.render('youth-council')
})

app.get('/courses', (req, res) => {
  return res.render('courses')
})

app.get('/kyc', (req, res) => {
  return res.render('kyc')
})

app.get('/yearly-subscription', (req, res) => {
  return res.render('yearly-subscription')
})

app.get('/faqs', (req, res) => {
  return res.render('faqs')
})

app.get('/email-Success', (req, res) => {
  return res.render('email-Success')
})
app.get('/success', (req, res) => {
  return res.render('success')
})

app.get('/register-succes', (req, res) => {
  return res.render('register-succes')
})


app.get('/404', (req, res) => {
  return res.render('404')
})

app.post('/report', (req, res) => {
  // File upload
  const bucket = storage.bucket(BUCKET_ID)

  const busboy = new Busboy({ headers: req.headers })
  const fields = {}
  const fileUrls = []

  busboy.on('field', (fieldname, val) => {
    console.log(`Processed field ${fieldname}: ${val}.`)
    fields[fieldname] = val
  })

  busboy.on('file', (fieldname, uploadedFile, filename) => {
    console.log(`Processed file ${filename}`)

    const gcsname = `${Date.now()}-${filename}`
    fileUrls.push(`${API_LINK_BASE_URL}/${BUCKET_ID}/${gcsname}`)
    const gcsfile = bucket.file(gcsname)
    const writeStream = gcsfile.createWriteStream({
      resumable: false,
    })
    uploadedFile.pipe(writeStream)

    return new Promise((resolve, reject) => {
      uploadedFile.on('end', () => {
        writeStream.end()
      })
      writeStream.on('finish', () => {
        console.log('file finished')
        return resolve()
      })
      writeStream.on('error', reject)
    })
      .then(() => {
        console.log(gcsname)
        return gcsfile.makePublic()
      })
      .catch((e) => console.log(e))
  })

  busboy.on('finish', () => {
    console.log('busboy finished')
    //return res.status(200).send(fileUrls);
    console.log(`Access here: ${fileUrls}`)

    return fetch(
      'https://us-central1-reib-platform.cloudfunctions.net/app/api/report-forms',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: fields.title,
          name: fields.name,
          surname: fields.surname,
          genderReporter: fields.genderReporter,
          phoneNumberReporter: fields.phoneNumberReporter,
          physicalAddressReporter: fields.physicalAddressReporter,
          reportOn: fields.reportOn,
          firstname: fields.firstname,
          lastname: fields.lastname,
          phoneNumber: fields.phoneNumber,
          gender: fields.gender,
          physicaladdress: fields.physicalAddress,
          fraudDescription: fields.fraudDescription,
          documentLink: fileUrls,
        }),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        res.render('success-report')
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  })

  busboy.end(req.rawBody)


})


app.post('/register', (req, res) => {

  const   title = req.body.title
  const   lastname = req.body.lastname
  const   firstname = req.body.firstname
  const   gender = req.body.gender
  const   phoneNumber = req.body.phoneNumber
  const   physicaladdress = req.body.physicaladdress
  const   memberType = req.body.memberType
  const   course = req.body.course
  const   type = req.body.type
  const   reibNo = req.body.reibNo
  const   institution = req.body.institution
  const   organization = req.body.organization
  const   organisationPhysicaladdress = req.body.organisationPhysicaladdress
  const   emailAddress = req.body.emailAddress
  const   documentLink = req.body.type

  axios.post(
    'https://us-central1-reib-platform.cloudfunctions.net/app/api/register-member', { title,reibNo,documentLink,lastname,firstname,gender,phoneNumber,physicaladdress,memberType,course,institution,organization,type,emailAddress,organisationPhysicaladdress,}
  ).then((data) => {
    console.log("registered")
    return res.render('register-succes')
     
    })
    .catch((error) => {
      console.error('Error:', error)
      res.status(500).json({ res: "failed" })
    })
 
})





app.post('/property-details', (req, res) => {
  fetch(
    `https://us-central1-reib-platform.cloudfunctions.net/app/api/properties/${req.body.propertyId}`,
  )
    .then((response) => response.json())
    .then((data) => {
      //console.log(data)
      return res.render('single-property', {
        property: data,
      })
    })
    .catch((error) => {
      console.error(error)
    })
})



/** APPLICATIONS */
app.post('/apply-student', (req, res) => {
  // File upload
  const bucket = storage.bucket(BUCKET_ID)

  const busboy = new Busboy({ headers: req.headers })
  const fields = {}
  const fileUrls = []

  busboy.on('field', (fieldname, val) => {
    console.log(`Processed field ${fieldname}: ${val}.`)
    fields[fieldname] = val
  })

  busboy.on('file', (fieldname, uploadedFile, filename) => {
    console.log(`Processed file ${filename}`)

    const gcsname = `${Date.now()}-${filename}`
    fileUrls.push(`${API_LINK_BASE_URL}/${BUCKET_ID}/${gcsname}`)
    const gcsfile = bucket.file(gcsname)
    const writeStream = gcsfile.createWriteStream({
      resumable: false,
    })
    uploadedFile.pipe(writeStream)

    return new Promise((resolve, reject) => {
      uploadedFile.on('end', () => {
        writeStream.end()
      })
      writeStream.on('finish', () => {
        console.log('file finished')
        return resolve()
      })
      writeStream.on('error', reject)
    })
      .then(() => {
        console.log(gcsname)
        return gcsfile.makePublic()
      })
      .catch((e) => console.log(e))
  })

  busboy.on('finish', () => {
    console.log('busboy finished')
    //return res.status(200).send(fileUrls);
    console.log(`Access here: ${fileUrls}`)

    return fetch(
      'https://us-central1-reib-platform.cloudfunctions.net/app/api/student-applications',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: fields.title,
          name: fields.name,
          surname: fields.surname,
          gender: fields.gender,
          dob: fields.dob,
          preferredContact: fields.preferredContact,
          organization: fields.organization,
          phoneNumber: fields.phoneNumber,
          email: fields.email,
          postalAddress: fields.postalAddress,
          fax: fields.fax,
          completedDegree: fields.completedDegree,
          documentLink: fileUrls,
          courseDetails: fields.courseDetails,
          tertiaryInstitution: fields.tertiaryInstitution,
          courseTitle: fields.courseTitle,
          dateOfEnrolment: fields.dateOfEnrolment,
          courseDuration: fields.courseDuration,
          dateOfCommencement: fields.dateOfCommencement,
          dateOfCompletion: fields.dateOfCompletion,
          reason: fields.reason,
        }),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data)
        res.render('success')
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  })

  busboy.end(req.rawBody)
})

/** APPLICATIONS */
app.post('/website-email', (req, res) => {

  const email = req.body.email
  const surname = req.body.surname
  const subject = 'Website user email'
  const message = req.body.message

   axios.post(
    'https://us-central1-reib-platform.cloudfunctions.net/app/api/website-email',{ email, subject, message, surname }
    )
    
    .catch((error) => {
      console.error('Error:', error)
      res.status(500).json({res: "failed"})
    })
   return res.render('email-Success')
})



app.post('/apply-probationer', (req, res) => {
  // File upload
  const bucket = storage.bucket(BUCKET_ID)

  const busboy = new Busboy({ headers: req.headers })
  const fields = {}
  const fileUrls = []

  busboy.on('field', (fieldname, val) => {
    console.log(`Processed field ${fieldname}: ${val}.`)
    fields[fieldname] = val
  })

  busboy.on('file', (fieldname, uploadedFile, filename) => {
    console.log(`Processed file ${filename}`)

    const gcsname = `${Date.now()}-${filename}`
    fileUrls.push(`${API_LINK_BASE_URL}/${BUCKET_ID}/${gcsname}`)
    const gcsfile = bucket.file(gcsname)
    const writeStream = gcsfile.createWriteStream({
      resumable: false,
    })
    uploadedFile.pipe(writeStream)

    return new Promise((resolve, reject) => {
      uploadedFile.on('end', () => {
        writeStream.end()
      })
      writeStream.on('finish', () => {
        console.log('file finished')
        return resolve()
      })
      writeStream.on('error', reject)
    })
      .then(() => {
        console.log(gcsname)
        return gcsfile.makePublic()
      })
      .catch((e) => console.log(e))
  })

  busboy.on('finish', () => {
    console.log('busboy finished')
    //return res.status(200).send(fileUrls);
    console.log(`Access here: ${fileUrls}`)

    return fetch(
      'https://us-central1-reib-platform.cloudfunctions.net/app/api/probationer-applications',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: fields.title,
          name: fields.name,
          surname: fields.surname,
          gender: fields.gender,
          dob: fields.dob,
          preferredContact: fields.preferredContact,
          organization: fields.organization,
          phoneNumber: fields.phoneNumber,
          email: fields.email,
          postalAddress: fields.postalAddress,
          fax: fields.fax,
          membershipStatus: fields.membershipStatus,
          dateAdmitted: fields.dateAdmitted,
          membershipCategory: fields.membershipCategory,
          examDate: fields.examDate,
          documentLink: fileUrls,
          qualifications: fields.qualifications,
          tertiaryInstitution: fields.tertiaryInstitution,
          courseTitle: fields.courseTitle,
          yearOfCompletion: fields.yearOfCompletion,
          tertiaryInstitutionTwo: fields.tertiaryInstitutionTwo,
          courseTitleTwo: fields.courseTitleTwo,
          yearOfCompletionTwo: fields.yearOfCompletionTwo,
          employmentOrganization: fields.employmentOrganization,
          employmentPosition: fields.employmentPosition,
          employmentPeriod: fields.employmentPeriod,
          typeOfWork: fields.typeOfWork,
          employmentOrganizationTwo: fields.employmentOrganizationTwo,
          employmentPositionTwo: fields.employmentPositionTwo,
          employmentPeriodTwo: fields.employmentPeriodTwo,
          typeOfWorkTwo: fields.typeOfWorkTwo,
          principleAreasOfWork: fields.principleAreasOfWork,
          refereeName: fields.refereeName,
          refereeCompany: fields.refereeCompany,
          refereePosition: fields.refereePosition,
          refereeContact: fields.refereeContact,
          refereePostalAddress: fields.refereePostalAddress,
          refereeNameTwo: fields.refereeNameTwo,
          refereeCompanyTwo: fields.refereeCompanyTwo,
          refereePositionTwo: fields.refereePositionTwo,
          refereeContactTwo: fields.refereeContactTwo,
          refereePostalAddressTwo: fields.refereePostalAddressTwo,
        }),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data)
        res.render('success')
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  })

  busboy.end(req.rawBody)
})









exports.app = functions.https.onRequest(app)
