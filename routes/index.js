var express = require('express');
var router = express.Router();
var colonyModel = require('./schema/colony');
var hospitalModel = require('./schema/hospital');
var mandirModel = require('./schema/mandir');
var churchModel = require('./schema/church');
var issueModel = require('./schema/issue');
var boothModel = require('./schema/booth');
var samitiModel = require('./schema/samiti');
var gurudawaraModel = require('./schema/gurudawara');
var schoolModel = require('./schema/school');
var mosqueModel = require('./schema/mosque');
var userModel = require('./users');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const localStrategy = require("passport-local");
var crypto = require("crypto");
var bodyParser = require('body-parser');
const flash = require('connect-flash');


// Middleware to parse JSON bodies
router.use(express.json());
// Middleware to parse form data
router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(flash());

//connect mongoDB
const URI ='mongodb+srv://useretheharsh2211:m39pwMRf2oHG1K53@cluster0.84s95os.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

/* LOCAL PASSPORT STRATEGY */
passport.use(
  new localStrategy(
    {
      usernameField: "email",
    },
    userModel.authenticate()
  )
);

//REGISTER USER -->
router.post("/register-user", function (req, res, next) {
  var usersRouter = new userModel({
    username: req.body.username,
    email: req.body.email,
    ward: req.body.ward
  });

  userModel.register(usersRouter, req.body.password).then(function (dets) {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/");
    });
  });
});


/* LOGIN ROUTE */
router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true,
  }),
  function (req, res, next) {
    res.redirect("/");
  }
);


/* LOGOUT ROUTE */
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


/* MIDDLEWARE */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/signin");
  }
}

router.get('/register', async(req, res) => {
  res.render('register')
})
 

/* GET home page. */
router.get('/', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({email: req.session.passport.user});
  res.render('index', { user });
});

router.get('/signin', function(req, res){
  res.render('login');
})

router.get('/chooseward', function(req, res){
  res.render('chooseward');
})

router.get('/chooseward/view', function(req, res){
  res.render('choosewardread');
})

router.get('/chooseward/:wardnumber',isLoggedIn, async function(req, res){
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  res.render('wardlist', {wardNumber, user});
})

router.get('/restricted', function(req, res){
  res.render('restriction');
})



//ROUTES FOR ALL FORM PAGE ----------->

router.get('/hospital-form/:wardnumber',isLoggedIn, async function(req, res){
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  res.render('./Form/addhospitalform', {wardNumber, user});
})
router.get('/colony-form/:wardnumber',isLoggedIn, async function(req, res){
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  res.render('./Form/colonyform', {wardNumber, user});
})
router.get('/mandir-form/:wardnumber',isLoggedIn, async function(req, res){
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  res.render('./Form/mandirform', {wardNumber, user});
})
router.get('/mosque-form/:wardnumber',isLoggedIn, async function(req, res){
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  res.render('./Form/mosqueform', {wardNumber, user});
})
router.get('/gurudawara-form/:wardnumber',isLoggedIn, async function(req, res){
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  res.render('./Form/gurudawaraform', {wardNumber, user});
})
router.get('/church-form/:wardnumber',isLoggedIn, async function(req, res){
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  res.render('./Form/churchform', {wardNumber, user});
})
router.get('/school-form/:wardnumber',isLoggedIn, async function(req, res){
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  res.render('./Form/schoolform', {wardNumber, user});
})
router.get('/booth-form/:wardnumber',isLoggedIn, async function(req, res){
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  res.render('./Form/boothForm', {wardNumber, user});
})

router.get('/samiti-form/:wardnumber/:samitiType',isLoggedIn, async function(req, res){
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  const samitiType = req.params.samitiType;

  res.render('./Form/samitiForm',{wardNumber, samitiType, user});
})

//INSERTION API ------------>
router.post('/add-hospital/:wardnumber', async (req, res) => {
  const wardNumber = req.params.wardnumber;
  const { hospitalname, landmark, address, memberName, mobileNumber } = req.body;

  try {
    // Create an array to store member objects
    const members = [];

       // Check if memberName and mobileNumber arrays are defined
if (Array.isArray(memberName) && Array.isArray(mobileNumber)) {
  // Iterate over memberName and mobileNumber arrays to create member objects
  for (let i = 0; i < Math.max(memberName.length, mobileNumber.length); i++) {
      // Check if both memberName and mobileNumber have values at index i
      const name = memberName[i] || ''; // If undefined, use empty string
      const number = mobileNumber[i] || ''; // If undefined, use empty string
      
      const member = {
          name: name,
          mobileNumber: number
      };
      members.push(member);
  }
}
    
      // Create a new colony document
      const newHospital = new hospitalModel({
          hospitalName: hospitalname,
          landmark: landmark,
          address: address,
          ward: wardNumber,
          members: members
      });

      // Save the new colony document to the database
      const savedHospital = await newHospital.save();

      console.log('Colony inserted successfully:', savedHospital);
      res.redirect(`/chooseward/${wardNumber}`);
  } catch (error) {
      console.error('Error inserting colony:', error);
      res.status(500).send('Error inserting colony');
  }
});

router.post('/add-mandir/:wardnumber', async (req, res) => {
  const wardNumber = req.params.wardnumber;
  const { mandirname, landmark, address, memberName, mobileNumber } = req.body;

 
  try {
     // Create an array to store member objects
     const members = [];

        // Check if memberName and mobileNumber arrays are defined
if (Array.isArray(memberName) && Array.isArray(mobileNumber)) {
  // Iterate over memberName and mobileNumber arrays to create member objects
  for (let i = 0; i < Math.max(memberName.length, mobileNumber.length); i++) {
      // Check if both memberName and mobileNumber have values at index i
      const name = memberName[i] || ''; // If undefined, use empty string
      const number = mobileNumber[i] || ''; // If undefined, use empty string
      
      const member = {
          name: name,
          mobileNumber: number
      };
      members.push(member);
  }
}
    
      
      const newMandir = new mandirModel({
          mandirName: mandirname,
          landmark: landmark,
          address: address,
          ward: wardNumber,
          members: members
      });

      // Save the new colony document to the database
      const savedMandir = await newMandir.save();

      console.log('Colony inserted successfully:', savedMandir);
      res.redirect(`/chooseward/${wardNumber}`);
  } catch (error) {
      console.error('Error inserting colony:', error);
      res.status(500).send('Error inserting colony');
  }
});

router.post('/add-colony/:wardnumber', async (req, res) => {
  const wardNumber = req.params.wardnumber;
  const { colonyname, landmark, mohalla, memberName, mobileNumber } = req.body;
  
  try {
     // Create an array to store member objects
     const members = [];

   // Check if memberName and mobileNumber arrays are defined
if (Array.isArray(memberName) && Array.isArray(mobileNumber)) {
  // Iterate over memberName and mobileNumber arrays to create member objects
  for (let i = 0; i < Math.max(memberName.length, mobileNumber.length); i++) {
      // Check if both memberName and mobileNumber have values at index i
      const name = memberName[i] || ''; // If undefined, use empty string
      const number = mobileNumber[i] || ''; // If undefined, use empty string
      
      const member = {
          name: name,
          mobileNumber: number
      };

      members.push(member);
  }
}
      // Create a new colony document
      const newColony = new colonyModel({
          colonyName: colonyname,
          landmark: landmark,
          mohalla: mohalla,
          ward: wardNumber,
          members: members
      });

      // Save the new colony document to the database
      const savedColony = await newColony.save();

      console.log('Colony inserted successfully:', savedColony);
      res.redirect(`/chooseward/${wardNumber}`);
  } catch (error) {
      console.error('Error inserting colony:', error);
      req.flash('error', 'This colony is already exsist');
      res.redirect(`/colony-form/${wardNumber}`)
  }
});

router.post('/add-mosque/:wardnumber', async (req, res) => {
  const wardNumber = req.params.wardnumber;
  const { mosquename, landmark, address, memberName, mobileNumber } = req.body;

 
  try {
     // Create an array to store member objects
     const members = [];

       // Check if memberName and mobileNumber arrays are defined
if (Array.isArray(memberName) && Array.isArray(mobileNumber)) {
  // Iterate over memberName and mobileNumber arrays to create member objects
  for (let i = 0; i < Math.max(memberName.length, mobileNumber.length); i++) {
      // Check if both memberName and mobileNumber have values at index i
      const name = memberName[i] || ''; // If undefined, use empty string
      const number = mobileNumber[i] || ''; // If undefined, use empty string
      
      const member = {
          name: name,
          mobileNumber: number
      };
      members.push(member);
  }
}
    
      
      const newMosque = new mosqueModel({
          mosqueName: mosquename,
          landmark: landmark,
          address: address,
          ward: wardNumber,
          members: members
      });

      // Save the new colony document to the database
      const savedMosque = await newMosque.save();

      console.log('Colony inserted successfully:', savedMosque);
      res.redirect(`/chooseward/${wardNumber}`);
  } catch (error) {
      console.error('Error inserting colony:', error);
      res.status(500).send('Error inserting colony');
  }
});

router.post('/add-gurudawara/:wardnumber', async (req, res) => {
  const wardNumber = req.params.wardnumber;
  const { gurudawaraname, landmark, address, memberName, mobileNumber } = req.body;

 
  try {
     // Create an array to store member objects
     const members = [];

        // Check if memberName and mobileNumber arrays are defined
if (Array.isArray(memberName) && Array.isArray(mobileNumber)) {
  // Iterate over memberName and mobileNumber arrays to create member objects
  for (let i = 0; i < Math.max(memberName.length, mobileNumber.length); i++) {
      // Check if both memberName and mobileNumber have values at index i
      const name = memberName[i] || ''; // If undefined, use empty string
      const number = mobileNumber[i] || ''; // If undefined, use empty string
      
      const member = {
          name: name,
          mobileNumber: number
      };
      members.push(member);
  }
}
    
      const newGurudawara = new gurudawaraModel({
          gurudawaraName: gurudawaraname,
          landmark: landmark,
          address: address,
          ward: wardNumber,
          members: members
      });

      // Save the new colony document to the database
      const savedGurudawara = await newGurudawara.save();

      console.log('Colony inserted successfully:', savedGurudawara);
      res.redirect(`/chooseward/${wardNumber}`);
  } catch (error) {
      console.error('Error inserting colony:', error);
      res.status(500).send('Error inserting colony');
  }
});

router.post('/add-church/:wardnumber', async (req, res) => {
  const wardNumber = req.params.wardnumber;
  const { churchname, landmark, address, memberName, mobileNumber } = req.body;

 
  try {
     // Create an array to store member objects
     const members = [];

   // Check if memberName and mobileNumber arrays are defined
if (Array.isArray(memberName) && Array.isArray(mobileNumber)) {
  // Iterate over memberName and mobileNumber arrays to create member objects
  for (let i = 0; i < Math.max(memberName.length, mobileNumber.length); i++) {
      // Check if both memberName and mobileNumber have values at index i
      const name = memberName[i] || ''; // If undefined, use empty string
      const number = mobileNumber[i] || ''; // If undefined, use empty string
      
      const member = {
          name: name,
          mobileNumber: number
      };
      members.push(member);
  }
}
    
      const newChurch = new churchModel({
          churchName: churchname,
          landmark: landmark,
          address: address,
          ward: wardNumber,
          members: members
      });

      // Save the new colony document to the database
      const savedChurch = await newChurch.save();

      console.log('Colony inserted successfully:', savedChurch);
      res.redirect(`/chooseward/${wardNumber}`);
  } catch (error) {
      console.error('Error inserting colony:', error);
      res.status(500).send('Error inserting colony');
  }
});

router.post('/add-school/:wardnumber', async (req, res) => {
  const wardNumber = req.params.wardnumber;
  const { schoolname, landmark, address, memberName, mobileNumber } = req.body;

 
  try {
      // Create an array to store member objects
     const members = [];

       // Check if memberName and mobileNumber arrays are defined
if (Array.isArray(memberName) && Array.isArray(mobileNumber)) {
  // Iterate over memberName and mobileNumber arrays to create member objects
  for (let i = 0; i < Math.max(memberName.length, mobileNumber.length); i++) {
      // Check if both memberName and mobileNumber have values at index i
      const name = memberName[i] || ''; // If undefined, use empty string
      const number = mobileNumber[i] || ''; // If undefined, use empty string
      
      const member = {
          name: name,
          mobileNumber: number
      };
      members.push(member);
  }
}
    
      
      const newSchool = new schoolModel({
          schoolName: schoolname,
          landmark: landmark,
          address: address,
          ward: wardNumber,
          members: members
      });

      // Save the new colony document to the database
      const savedSchool = await newSchool.save();

      console.log('Colony inserted successfully:', savedSchool);
      res.redirect(`/chooseward/${wardNumber}`);
  } catch (error) {
      console.error('Error inserting colony:', error);
      res.status(500).send('Error inserting colony');
  }
});

router.post('/add-booth/:wardnumber', async (req, res) => {
  const wardNumber = req.params.wardnumber;
  const { boothname, boothnumber, address, memberName, mobileNumber } = req.body;

 
  try {
      // Create an array to store member objects
     const members = [];

       // Check if memberName and mobileNumber arrays are defined
if (Array.isArray(memberName) && Array.isArray(mobileNumber)) {
  // Iterate over memberName and mobileNumber arrays to create member objects
  for (let i = 0; i < Math.max(memberName.length, mobileNumber.length); i++) {
      // Check if both memberName and mobileNumber have values at index i
      const name = memberName[i] || ''; // If undefined, use empty string
      const number = mobileNumber[i] || ''; // If undefined, use empty string
      
      const member = {
          name: name,
          mobileNumber: number
      };
      members.push(member);
  }
}
    
      const newBooth = new boothModel({
          boothName: boothname,
          boothnumber: boothnumber,
          address: address,
          ward: wardNumber,
          members: members
      });

      // Save the new colony document to the database
      const savedBooth = await newBooth.save();

      console.log('Booth inserted successfully:', savedBooth);
      res.redirect(`/chooseward/${wardNumber}`);
  } catch (error) {
      console.error('Error inserting colony:', error);
      res.status(500).send('Error inserting colony');
  }
});

router.post('/add-samiti/:wardnumber', async (req, res) => {
  const wardNumber = req.params.wardnumber;
  const { samitiname, boothnumber, address, samiticategory, memberName, mobileNumber} = req.body;

 
  try {
 // Create an array to store member objects
 const members = [];

 // Check if memberName and mobileNumber arrays are defined
if (Array.isArray(memberName) && Array.isArray(mobileNumber)) {
// Iterate over memberName and mobileNumber arrays to create member objects
for (let i = 0; i < Math.max(memberName.length, mobileNumber.length); i++) {
    // Check if both memberName and mobileNumber have values at index i
    const name = memberName[i] || ''; // If undefined, use empty string
    const number = mobileNumber[i] || ''; // If undefined, use empty string
    
    const member = {
        name: name,
        mobileNumber: number
    };

    members.push(member);
}
}
    
      
      const newSamiti = new samitiModel({
          samitiName: samitiname,
          samitiType: samiticategory,
          boothnumber: boothnumber,
          address: address,
          ward: wardNumber,
          members: members
      });

      // Save the new colony document to the database
      const savedSamiti = await newSamiti.save();

      console.log('Booth inserted successfully:', savedSamiti);
      res.redirect(`/chooseward/${wardNumber}`);
  } catch (error) {
      console.error('Error inserting colony:', error);
      res.status(500).send('Error inserting colony');
  }
});


//ROUTES FOR VIEW DATA FOR EVERY PAGE ------>

// router.get('/read-only/:wardnumber', async (req, res) => {
//   const wardNumber = req.params.wardnumber;
//   res.render('./Readonly/readOnlyPage', {wardNumber})
// })

router.get('/read/view/info/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  res.render('./Readonly/readOnlyPage', {wardNumber, user})
})

router.get('/read-colony/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const colonyData = await colonyModel.find({ward:wardNumber});
    res.render('./Readonly/readColony', {wardNumber, colonyData, user})
  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})

router.get('/read-hospital/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const hospitalData = await hospitalModel.find({ward:wardNumber});
    res.render('./Readonly/readHospital', {wardNumber, hospitalData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})
router.get('/read-issue/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const issueData = await issueModel.find({ward:wardNumber});
    res.render('./Readonly/readIssue', {wardNumber, issueData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})
router.get('/read-mandir/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const mandirData = await mandirModel.find({ward:wardNumber});
    res.render('./Readonly/readMandir', {wardNumber, mandirData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})

router.get('/read-school/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const schoolData = await schoolModel.find({ward:wardNumber});
    res.render('./Readonly/readSchool', {wardNumber, schoolData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})

router.get('/read-church/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const churchData = await churchModel.find({ward:wardNumber});
    res.render('./Readonly/readChurch', {wardNumber, churchData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})

router.get('/read-gurudawara/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const gurudawaraData = await gurudawaraModel.find({ward:wardNumber});
    res.render('./Readonly/readGurudawara', {wardNumber, gurudawaraData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})

router.get('/read-mosque/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const mosqueData = await mosqueModel.find({ward:wardNumber});
    res.render('./Readonly/readMosque', {wardNumber, mosqueData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})

router.get('/read-booth/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const boothData = await boothModel.find({ward:wardNumber});
    res.render('./Readonly/readBooth', {wardNumber, boothData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})
router.get('/read-ganpatisamiti/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const ganpatisamitiData = await samitiModel.find({ ward: wardNumber, samitiType: 'गणपति' });
    res.render('./Readonly/readGanpati', {wardNumber, ganpatisamitiData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})

router.get('/read-durgasamiti/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const durgasamitiData = await samitiModel.find({ ward: wardNumber, samitiType: 'दुर्गा' });
    res.render('./Readonly/readDurga', {wardNumber, durgasamitiData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})

router.get('/read-gayatriparivar/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const gayatriParivarData = await samitiModel.find({ ward: wardNumber, samitiType: 'गायत्रीपरिवार' });
    res.render('./Readonly/readGayatriParivar', {wardNumber, gayatriParivarData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})

router.get('/read-bkumari/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const bkumariData = await samitiModel.find({ ward: wardNumber, samitiType: 'ब्रम्हाकुमारी' });
    res.render('./Readonly/readBkumari', {wardNumber, bkumariData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})

router.get('/read-dharmiksangathan/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const dharmikSangathanData = await samitiModel.find({ ward: wardNumber, samitiType: 'धार्मिक-संगठन' });
    res.render('./Readonly/readDharmikSangathan', {wardNumber, dharmikSangathanData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})

router.get('/read-bhajankirtantoli/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const bhajanKirtanData = await samitiModel.find({ ward: wardNumber, samitiType: 'भजन-कीर्तन-टोली' });
    res.render('./Readonly/readBhajanKirtan', {wardNumber, bhajanKirtanData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})

router.get('/read-madarse/:wardnumber', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = req.params.wardnumber;
  try {
    const madarseData = await samitiModel.find({ ward: wardNumber, samitiType: 'मदरसे' });
    res.render('./Readonly/readMadarse', {wardNumber, madarseData, user});

  } catch (error) {
    console.error('Error retrieving colonies:', error);
    res.status(500).send('Internal Server Error');
  }

})


//DELETE ITEMS FROM DATABASE -------->
router.get('/delete/colony/:colonyId/:ward', async (req, res) => {
  const colonyId = req.params.colonyId;
  const ward = req.params.ward;
  try {
    // Find the colony by ID and delete it
    const deletedColony = await colonyModel.findByIdAndDelete(colonyId);

    if (!deletedColony) {
      return res.status(404).json({ success: false, message: 'Colony not found' });
    }

    console.log('Colony deleted successfully:', deletedColony);
    res.redirect(`/read-colony/${ward}`);
  } catch (error) {
    console.error('Error deleting colony:', error);
    res.status(500).json({ success: false, message: 'Error deleting colony', error: error.message });
  }
});

router.get('/delete/hospital/:hospitalId/:ward', async (req, res) => {
  const hospitalId = req.params.hospitalId;
  const ward = req.params.ward;
  try {
    // Find the colony by ID and delete it
    const deletedColony = await hospitalModel.findByIdAndDelete(hospitalId);

    if (!deletedColony) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    console.log('deleted successfully:', deletedColony);
    res.redirect(`/read-hospital/${ward}`);
  } catch (error) {
    console.error('Error deleting colony:', error);
    res.status(500).json({ success: false, message: 'Error deleting', error: error.message });
  }
});

// router.get('/info/:itemid', isLoggedIn, async function(req, res){
//   const user = await userModel.findOne({email: req.session.passport.user});
//   const item = await colonyModel.findOne({_id: req.params.itemid})
//   const wardNumber = user.ward;
//   res.render('innerform', {wardNumber, item, user})
// })

router.get('/info/:itemType/:itemId', isLoggedIn, async function(req, res){
  try {
    const user = await userModel.findOne({email: req.session.passport.user});
    let item;

    // Determine which model to query based on the itemType
    switch(req.params.itemType) {
      case 'innerform':
        item = await colonyModel.findOne({ _id: req.params.itemId });
        data = [];
        break;
      case 'innerHospital':
        item = await hospitalModel.findOne({ _id: req.params.itemId });
        data = [];
        break;
      case 'innerChurch':
        item = await churchModel.findOne({ _id: req.params.itemId });
        data = [];
        break;
      case 'innerGurudawara':
        item = await gurudawaraModel.findOne({ _id: req.params.itemId });
        data = [];
        break;
      case 'innerMandir':
        item = await mandirModel.findOne({ _id: req.params.itemId });
        data = [];
        break;
      case 'innerMosque':
        item = await mosqueModel.findOne({ _id: req.params.itemId });
        data = [];
        break;
      case 'innerSchool':
        item = await schoolModel.findOne({ _id: req.params.itemId });
        data = [];
        break;
        case 'innerIssue':
        item = await issueModel.findOne({ _id: req.params.itemId });
        data = [];
        break;
        case 'innerBooth':
        item = await boothModel.findOne({ _id: req.params.itemId });
        if(item){
          data = await samitiModel.find({ boothnumber: item.boothnumber });
        }else{
          console.log('Item not found');
          data = [];
        }
        break;
        case 'innerGanpatiSamiti':
          item = await samitiModel.findOne({ _id: req.params.itemId });
          data = [];
          break;
        case 'innerDurgaSamiti':
          item = await samitiModel.findOne({ _id: req.params.itemId });
          data = [];
          break;
        case 'innerGayatriParivar':
          item = await samitiModel.findOne({ _id: req.params.itemId });
          data = [];
          break;
        case 'innerBkumari':
          item = await samitiModel.findOne({ _id: req.params.itemId });
          data = [];
          break;
        case 'innerDharmikSangathan':
          item = await samitiModel.findOne({ _id: req.params.itemId });
          data = [];
          break;
        case 'innerBhajanKirtan':
          item = await samitiModel.findOne({ _id: req.params.itemId });
          data = [];
          break;
        case 'innerMadarse':
          item = await samitiModel.findOne({ _id: req.params.itemId });
          data = [];
          break;
          
        
      default:
        return res.status(400).send("Invalid itemType");
    }

    if (!item) {
      return res.status(404).send('Item not found');
    }

    const wardNumber = user.ward;
    // Render the appropriate EJS template based on the itemType
    res.render(req.params.itemType, { wardNumber, item, user, data });

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/update/form/:itemid', isLoggedIn, async function(req, res){
  const user = await userModel.findOne({email: req.session.passport.user});
  const item = await colonyModel.findOne({_id: req.params.itemid})
  console.log(item)
  res.render('./UpdateForm/colonyUpdate', {user})
})

router.post('/add-members/:itemType/:itemid', isLoggedIn, async function(req, res) {
  try {
      const user = await userModel.findOne({ email: req.session.passport.user });
      const { memberName, mobileNumber } = req.body;
      const itemType = req.params.itemType;
      
      // Create an array to store member objects
      let members = [];
      
      // Check if both memberName and mobileNumber are arrays
      if (Array.isArray(memberName) && Array.isArray(mobileNumber)) {
          // Iterate over memberName and mobileNumber arrays to create member objects
          for (let i = 0; i < Math.max(memberName.length, mobileNumber.length); i++) {
              // Check if both memberName and mobileNumber have values at index i
              const name = memberName[i] || ''; // If undefined, use empty string
              const number = mobileNumber[i] || ''; // If undefined, use empty string
              const member = {
                  name: name,
                  mobileNumber: number
              };
              members.push(member);
          }
      } else {
          // If either memberName or mobileNumber is not an array, create a single member object
          const name = memberName || ''; // If undefined, use empty string
          const number = mobileNumber || ''; // If undefined, use empty string
          const member = {
              name: name,
              mobileNumber: number
          };
          members.push(member);
      }
      
      // Update the colony document by pushing the new member(s) to the members array
   switch(itemType){
    case 'colony':
    await colonyModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;
  
  case 'hospital':
    await hospitalModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;

  case 'school':
    await schoolModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;

  case 'church':
    await churchModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;

  case 'mandir':
    await mandirModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;

  case 'gurudawara':
    await gurudawaraModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;

  case 'mosque':
    await mosqueModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;

  case 'booth':
    await boothModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;

  case 'ganpatisamiti':
    await samitiModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;

  case 'durgasamiti':
    await samitiModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;

  case 'gayatriparivar':
    await samitiModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;

  case 'bkumari':
    await samitiModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;

  case 'dharmiksangathan':
    await samitiModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;

  case 'bhajankirtan':
    await samitiModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;

  case 'madarse':
    await samitiModel.findOneAndUpdate(
      { _id: req.params.itemid },
      { $push: { members: { $each: members } } }
  );
  break;
   }

      const previousPage = req.headers.referer || '/';
      res.redirect(previousPage);
  } catch (error) {
      console.error("Error adding member(s):", error);
      res.status(500).send("Internal Server Error");
  }
});

// Route to handle redirection to previous state
router.get('/goback', (req, res) => {
  // Checking if the referer header exists
  res.redirect('/')
});

router.get('/issue-form',isLoggedIn, async function(req,res){
  const user = await userModel.findOne({email: req.session.passport.user});
  const wardNumber = user.ward;
  res.render('./Form/issueForm', {user, wardNumber});
})

router.post('/add-issue/:wardnumber', async (req, res) => {
  const wardNumber = req.params.wardnumber;
  const { location, landmark, description, issue, priority, workerName, workerMobile} = req.body;

 
  try {
    
      const newIssue = new issueModel({
          location: location,
          landmark: landmark,
          description: description,
          issueType: issue,
          priority: priority,
          workerName: workerName,
          workerMobile: workerMobile,
          ward: wardNumber
      });

      // Save the new colony document to the database
      const savedIssue = await newIssue.save();

      console.log('Colony inserted successfully:', savedIssue);
      res.redirect(`/`);
  } catch (error) {
      console.error('Error inserting colony:', error);
      res.status(500).send('Error inserting colony');
  }
});

router.get('/resolve/:id/:ward', async function(req, res){
  const issueId = req.params.id;
  const wardNumber = req.params.ward;

  try {
      // Find the issue document by its unique identifier
      const issue = await issueModel.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(issueId) }, // Correctly invoke ObjectId constructor with 'new'
          { resolve: true }, // Set the resolve field to true
          { new: true } // Return the updated document
      );

      if (!issue) {
          return res.status(404).json({ message: 'Issue not found' });
      }

      // Issue resolved successfully
     res.redirect(`/read-issue/${wardNumber}`)
  } catch (error) {
      console.error('Error resolving issue:', error);
      res.status(500).json({ message: 'Error resolving issue' });
  }
})

router.get('/delete-issue/:id/:ward', async function(req, res) {
  const issueId = req.params.id;
  const wardNumber = req.params.ward;
  try {
      // Find the issue document by its unique identifier and delete it
      const deletedIssue = await issueModel.findOneAndDelete({ _id: new mongoose.Types.ObjectId(issueId) });

      if (!deletedIssue) {
          return res.status(404).json({ message: 'Issue not found' });
      }

      // Issue deleted successfully
      res.redirect(`/read-issue/${wardNumber}`);
  } catch (error) {
      console.error('Error deleting issue:', error);
      res.status(500).json({ message: 'Error deleting issue' });
  }
});

router.get('/issue-mang',isLoggedIn, async function(req,res){
  const user = await userModel.findOne({email: req.session.passport.user});
  res.render('issueMang', {user})
})


module.exports = router;
