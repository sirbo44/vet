const express = require('express');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.use(express.json());
app.use(session({"secret":"1234567890"}));
app.use(express.static('views'));
require("dotenv").config();


port = process.env.PORT;
password = process.env.PASSWORD;
db = process.env.DB;

let User = require('./models/user');
let Message = require('./models/message');
let Pet = require('./models/pet');


mongoose.connect('mongodb+srv://stavros:'+ password +'@sirbo.tbn8eiu.mongodb.net/'+ db);

function getRole(req){
    return req.session.role;
}

function getEmail(req){
    return req.session.email ? req.session.email : '';
}


// home page
app.get('/', (req, res) => {
    data = [
        {"title":"Speed", "content":"In our veterinary web app, swift access to critical care resources and instant consultations ensures your pet receives the urgent attention they deserve.Laborum enim consequat minim magna et fugiat eiusmod exercitation."},
        {"title":"Telemedicine Consultations", "content":"Experience the convenience of virtual veterinary care through our telemedicine consultations, connecting you directly with skilled professionals for expert guidance and care from the comfort of your home."},
        {"title":"24/7 Support", "content":"Rest assured, our veterinary web app provides round-the-clock support, ensuring that your pet's needs are met at any hour, day or night, with professional guidance just a tap away."}
    ]
    res.render('pages/home', {"role": getRole(req), "email": getEmail(req)});
})
// services
app.get('/services', (req, res) => {
    data = [
        {'title': "Vaccinations and Preventive Care", "content":"Complete Nose To Tail Examination Animals are experts at hiding their pain. Our nose To tail check-up provides a complete review and analysis of your pet’s health, allowing us to determine any concerns.", "image":"../images/services.jpeg"},
        {'title': "Wellness Examinations", "content":"Keep Your Pet’s Smile Bright! Pawsitively's dental service includes an oral exam, dental cleaning and polishing, and, if necessary, extractions. The exam helps to screen for early signs of gum disease.", "image":"../images/services1.jpeg"},
        {'title': "Dental Care", "content":"Keep Your Pet’s Smile Bright! Pawsitively's dental service includes an oral exam, dental cleaning and polishing, and, if necessary, extractions. The exam helps to screen for early signs of gum disease.", "image":"../images/services3.jpeg"},
        {'title': "Grooming and Hygiene", "content":"Keep Your Pet’s Smile Bright! Pawsitively's dental service includes an oral exam, dental cleaning and polishing, and, if necessary, extractions. The exam helps to screen for early signs of gum disease.", "image":"../images/services2.jpeg"}
    ]
    res.render('pages/services', {"role": getRole(req), "email": getEmail(req)});
})
//news page
app.get('/news', (req,res) =>{   
    data = [
        {'title':'Tailored Nutrition Plans for Happy Pets','content':"Unlock optimal health for your furry friends with our new feature—customized nutrition plans. Tailor your pet's diet effortlessly through our veterinary web app, ensuring they receive the nutrients they need for a vibrant life."},
        {'title':'Emergency Care Anytime, Anywhere','content':"Instant peace of mind is just a click away! Access emergency veterinary care through our web app, connecting you with skilled professionals 24/7 to address your pet's urgent health concerns."},
        {'title':'Wellness Reminders for Pet Parents','content':"Never miss a beat with our wellness reminders. Receive timely notifications for vaccinations, check-ups, and more, helping you stay on top of your pet's health routine effortlessly with our veterinary web app."},
        
    ]
    res.render('pages/news', {"role": getRole(req), "email": getEmail(req)});
});
// messages
app.get('/messages', async (req, res) => {
    const messages = await Message.find();
    res.render('pages/messages', {"role": getRole(req), "email": getEmail(req), "messages":messages});
})
// contact
app.get('/contact', (req,res) => {
    res.render('pages/contact', {"role": getRole(req), "email": getEmail(req)});
})

//profile page
app.get('/profile', async (req,res) => {
    if(req.session.email){
        const pets = await Pet.find();
        let owners_pets = []
        for(let i = 0;i<pets.length;i++){
            if (pets[i].owner == req.session.email){
                owners_pets.push(pets[i])
            }
        }
        res.render('pages/profile', {"pets":owners_pets, "role": getRole(req), "email": getEmail(req)});
    } else {
        res.redirect('login');
    }
    
})
// contact us page
app.get('/appointment', (req, res) => {
    if(req.session.email){
        res.render('pages/appointment', {"email": getEmail(req), "role": getRole(req), "email": getEmail(req)});
    }else{
        res.redirect('login')
    }
})

app.post('/appointment', (req, res) => {
    Message.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        exams: req.body.service,
        message: req.body.message
    }) 
    res.redirect('/appointment');
})

//login page
app.get('/login', (req, res) => {
    res.render('pages/login', {"role": getRole(req), "email": getEmail(req)});
})

app.post('/login', async (req, res) => {
    const user = await User.findOne({"email": req.body.email}).exec();
    if(user != null){
        if (user.password == req.body.password){
            req.session.email = req.body.email;
            req.session.role = user.role
            res.redirect("/")
        }
        else{
            res.render('pages/error', {"error": "wrong credentials", "role": getRole(req), "email": getEmail(req), "email": getEmail(req)})
        }
    }
    else{
        res.render('pages/error', {"error": "User not found", "role": getRole(req), "email": getEmail(req)})
    }
})

//logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

//addpet
app.get('/addpet', (req,res) => {
    res.render('pages/addpet', {"role": getRole(req), "email": getEmail(req)})
})

app.post('/addpet', (req,res) => {
    Pet.create({
        id: req.body.id,
        owner: req.body.owner,
        exams: req.body.exams
    }) 
    res.redirect('/addpet');
})

//register page 
app.get('/register', (req, res) => {
    res.render('pages/register', {"role": getRole(req), "email": getEmail(req)})
})

app.post('/register', async (req, res) => {
    const user = await User.findOne({'email': req.body.email}).exec();
    if (Boolean(req.body.checkbox)){
        if (user != null){
            res.render('pages/error', {'error':"Email " + req.body.email + " already linked to another account", "role": getRole(req), "email": getEmail(req)});
        }
        else{
            User.create({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                password: req.body.password, 
                role: "client"
            })
            res.redirect('/login');
        }
    }
})

// listen port
app.listen(port, () =>{
    console.log("Server runs on port "+ port);
})