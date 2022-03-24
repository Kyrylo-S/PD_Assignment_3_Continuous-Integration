const express = require ('express');
const path = require ('path');

const {check, validationResult} = require('express-validator');
const { RSA_PSS_SALTLEN_DIGEST } = require('constants');

var MySite=express();
MySite.use(express.urlencoded({extended:true}));

MySite.set('views', path.join(__dirname, 'views'));
MySite.use(express.static(__dirname + '/public'));
MySite.set('view engine','ejs');

var PhoneFilter=/^[0-9]{3}\-?[0-9]{3}\-?[0-9]{4}\-?$/;     
var NameFilter=/^[a-zA-Z!.,#$%&'*+/=? ^_`{|}~-]+$/;
var CityFilter=/^[a-zA-Z!.,#$%&'*+/=? ^_`{|}~-]+$/;
var StreetFilter=/^[a-zA-Z!.,#$%&'*+/=? ^_`{|}~-]+$/; 
var AppartmentFilter=/^[0-9]+$/;

class Province
{
    constructor(Name, Tax)
    {
        this.Name=Name;
        this.Tax=Tax;
    }
}
const Alberta=new Province("Alberta" ,0.05);
const BC=new Province("BC" ,0.12);
const Manitoba=new Province("Manitoba" ,0.12);
const NB=new Province("NB" ,0.15);
const NL=new Province("NL" ,0.15);
const NT=new Province("NT" ,0.05);
const NS=new Province("NS" ,0.15);
const PEI=new Province("PEI" ,0.15);
const Ontario=new Province("Ontario" ,0.13);
const Quebec=new Province("Quebec" ,0.14975);
const Saskatchewan=new Province("Saskatchewan" ,0.11);
const Yukon=new Province("Yukon" ,0.5);
const Nunavut=new Province("Nunavut" ,0.5);

var Provinces=[];
Provinces[0]=Alberta;
Provinces[1]=BC;
Provinces[2]=Manitoba;
Provinces[3]=NB;
Provinces[4]=NL;
Provinces[5]=NT;
Provinces[6]=NS;
Provinces[7]=PEI;
Provinces[8]=Ontario;
Provinces[9]=Quebec;
Provinces[10]=Saskatchewan;
Provinces[11]=Yukon;
Provinces[12]=Nunavut;

function checkProvince (userInput)
{
    if(userInput!="Please choose")
    {
         return true;
    }
    else 
    {
        return false;
    }
}

function customProvinceValidation(value)
{
     if (!checkProvince(value))
     {
         throw new Error ('Please choose you province');
     }
     return true;
}

function checkCity (userInput, City)
{
    if(City.test(userInput))
    {
         return true;
    }
    else 
    {
        return false;
    }
}

function customCityValidation(value)
{
     if (!checkCity(value, CityFilter))
     {
         throw new Error ('Please input correct format city, for example "Toronto"');
     }
     return true;
}

function checkName (userInput, Name)
{
    if(Name.test(userInput))
    {
         return true;
    }
    else 
    {
        return false;
    }
}

function customNameValidation(value)
{
    console.log(checkName(value, NameFilter))
     if (!checkName(value, NameFilter))
     {
         throw new Error ('Please input your name, special characters and numbers are not allowed');
     }
     return true;
}

function checkPhone (userInput, Phone)
{
    if(Phone.test(userInput))
    {
         return true;
    }
    else 
    {
        return false;
    }
}

function customPhoneValidation(value)
{
     if (!checkPhone(value, PhoneFilter))
     {
         throw new Error ('Please input correct format phone XXX-XXX-XXXX or XXXXXXXXXX');
     }
     return true;
}

function checkStreet (userInput, Street)
{
    if(Street.test(userInput))
    {
         return true;
    }
    else 
    {
        return false;
    }
}

function customStreetValidation(value)
{
     if (!checkStreet(value, StreetFilter))
     {
         throw new Error ('Please input correct name of the street(no numbers and special symbols alloud');
     }
     return true;
}

function checkAppartment(userInput, Appartment)
{
    if(Appartment.test(userInput))
    {
         return true;
    }
    else 
    {
        return false;
    }
}

function customAppartmentValidation(value)
{
     if (!checkAppartment(value, AppartmentFilter))
     {
         throw new Error ('Please input number of your appartment');
     }
     return true;
}

MySite.get('/',function(request, response){
response.render('form');
});
MySite.post('/', 
    [
         check('Phone', '').custom(customPhoneValidation),
         check('City', '').custom(customCityValidation),
         check('Name', '').custom(customNameValidation),         
         check('Street', '').custom(customStreetValidation),
         check('Appartment', '').custom(customAppartmentValidation),
         check('Province', '').custom(customProvinceValidation),
         check('Email', 'email is required').isEmail()                

    ], function(request, response)
    {
        var encore=request.body.Encore 
        var enclave=request.body.Enclave 
        var tshirt=request.body.TShirt 
        var tyre=request.body.Tyre 
        const errors = validationResult (request);      
        const err = "Please select products worth more than 10$!"
     
    if (!errors.isEmpty() && (encore != "yes" && enclave != "yes" &&tshirt != "yes" &&tyre != "yes")  || (encore != "yes" && enclave != "yes" &&tshirt == "yes" &&tyre != "yes"))
    {
        response.render('form', {
            errors : errors.array(),
            err : err
        })
    }
    else if (!errors.isEmpty())
{
    response.render('form', { 
        errors : errors.array(),
    })
}
    else if ((encore != "yes" && enclave != "yes" &&tshirt != "yes" &&tyre != "yes")  || (encore != "yes" && enclave != "yes" &&tshirt == "yes" &&tyre != "yes"))
    {
        response.render('form', {
            err : err
        })
    }    
    else
    {
        var province=request.body.Province
        var name = request.body.Name
        var street = request.body.Street
        var appartment = request.body.Appartment      
        var city = request.body.City
        var phone = request.body.Phone
        var email = request.body.Email       
        var cost=0;
        cost+=(encore=="yes")?33493:0
        cost+=(enclave=="yes")?59688:0
        cost+=(tshirt=="yes")?9:0
        cost+=(tyre=="yes")?18:0  
        console.log(tyre)
        console.log(enclave)
        console.log(tshirt)
        console.log(encore)
        var products="";
        products+=(encore=="yes")?"Encore, ": ""
        products+=(enclave=="yes")?"Enclave, ": ""
        products+=(tshirt=="yes")?"T-shirt, ": ""
        products+=(tyre=="yes")?"Tyre, ": ""
    let tax;  
    for(let i=0; i<Provinces.length; i++)
    {
    if (province==Provinces[i].Name)
    {
        tax=Provinces[i].Tax;
    }
    }   
        var taxcost = cost * tax;
        var total = cost + taxcost;    
        var data = {
            name:name, 
            street:street,
            city:city,
            appartment:appartment,
            phone:phone,
            email:email,   
            province:province, 
            products:products,
            tax:taxcost,
            total:total
        }
        response.render('form', data)
        }});

      //start server and listen to port
MySite.listen(8080); // http://localhost:8080

//Confirmation Output
console.log('Excution Complete... Website opened at port 8080!');
      